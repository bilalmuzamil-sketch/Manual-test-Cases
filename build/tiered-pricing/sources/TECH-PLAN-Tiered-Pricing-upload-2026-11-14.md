# Tiered Pricing — Technical Implementation Plan

**Date:** 2026-11-11
**PRD:** [Tiered Pricing v0.17](https://shopview.atlassian.net/wiki/spaces/PM/pages/938213378/Tiered+Pricing) (Confluence page version 37)
**Companion PRD (own plan, own PR, same release):** [Sales by Tier and Sales by Category](https://shopview.atlassian.net/wiki/spaces/PM/pages/968687617/Sales+by+Tier+and+Sales+by+Category) (page version 21)
**Jira epic:** [SV-11692](https://shopview.atlassian.net/browse/SV-11692) Tiered Pricing
**Design:** [Tiered Pricing design canvas](https://claude.ai/artifact/A3NtAX9CHJCD87SXDTn9AE?sk=z3YP2vy3EJhhhP_Dr9mV0Q) — pages 1–15 (one per story), 272 screens; Stories 16–19 have no screens by design
_(keep the 🎨 Design access note in Section 0)_
**Tech stack:** Symfony 7.4 / PHP 8.5 / Doctrine ORM 3 + DBAL 4 / MySQL 8 (BE) · Vue 3.5 + Quasar 2 + TanStack Query (FE)
**Estimated complexity:** High — one PR, 18 phases, touches pricing, catalog, customers, work orders, Part Sales, invoicing, audit and permissions

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Branch:** — _(one branch and one PR for the whole plan; the reports plan's branch is cut from this one)_
- **Phase commits:** — _(`Phase N: done @ <sha>`, one commit per phase; the last SHA is where the next phase starts)_
- **Open questions / blockers:** none open with Product. Product answered round 1 (PQ1–PQ19), round 2 (PQ20–PQ26; replies 1013514262 and 1014267917) and PQ27 (reply 1017118734), and published page version 36 on 2026-11-12, then page version 37 on 2026-11-12, which no longer reserves "Credits not tied to a part" (the reports dropped that row); every answer is folded into this plan. DQ6 ran on the prod replica on 2026-11-11 (results in Section 1 → Clarifications) and is re-run right before release. The reports plan's round 2 (RQ10–RQ13) does not block this plan. Where the PRD is silent, engineering chose D31–D36 (Section 3), listed for plan review; D28 is withdrawn. See Section 1 → Clarifications.

### PRD baseline

| | |
|---|---|
| **PRD version this plan is built on** | v0.17 — Confluence page version **37** (published 2026-11-12), read in full 2026-11-12; page 37's diff re-checked 2026-11-13 |
| **Exact baseline text** | [page version 37](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=938213378&pageVersion=37) (Confluence keeps every version; diff it against the current one in the page history → Compare) |
| **Last audited against** | page version 37 (full audit against page 33 on 2026-11-11, delta audit against page 35 on 2026-11-12, findings fixed in revisions 3 and 5; page 36's TP-S4-R19 sentence and page 37's removal of the "Credits not tied to a part" reservation re-checked 2026-11-12 and 2026-11-13) |
| **Design baseline** | Tiered Pricing design canvas, approved by the design authority 2026-11-09 (canvas audit 2026-11-10) |

**When the PRD changes:** compare the current page version with the baseline above. If it moved, diff baseline → current, re-check every changed requirement against Sections 1, 3, 6, 10 and the appendices, re-run the fresh-eyes audit, then add a row to the revision history below and move the baseline. A comment reply or the PRD's change-log line is never a substitute for the diff — other people edit the page without notice.

### Plan revision history

| Rev | Date | PRD (page version) | Audited | What changed in the plan |
|---|---|---|---|---|
| 1 | 2026-11-11 | v0.17 (32) | pending | First plan (draft; Product round 1 open) |
| 2 | 2026-11-11 | v0.17 (33) | pending | Product round 1 folded in (PQ1–PQ19); PQ6 tax name and PQ17 archived simulator reworked; snapshot core/fee rows follow the part |
| 3 | 2026-11-11 | v0.17 (33) | 33 (2026-11-11) | Audit findings fixed: costTyped, archived cells, tier delete vs closed work orders, inventory dialog 403, PRD wording |
| 4 | 2026-11-12 | v0.17 (35) | 33 | PRD page 35: round 2 answered (PQ20–PQ26); PQ22 archived-view chain and PQ23 hover text reworked |
| 5 | 2026-11-12 | v0.17 (35) | 35 (2026-11-12) | Delta audit vs page 35 fixed: Parts-tab retyped cost, $0 preview, resync of rule-less matrices, Categories-line audit entries |
| 6 | 2026-11-12 | v0.17 (35) | 35 (2026-11-12) | Release A stops using `pricing_rule` (legacy FK dropped, duplicate cleanup off the table, resync guarded; release B drops the resync with the table); every binding PRD sub-bullet pasted, with a per-phase wording table |
| 7 | 2026-11-12 | v0.17 (36) | 36 (2026-11-12) | PRD page 36: PQ27 answered — archived columns by archive date |
| 8 | 2026-11-13 | v0.17 (37) | 37 (2026-11-13) | PRD page 37: 'Credits not tied to a part' no longer reserved (reports row removed) |
| 9 | 2026-11-13 | v0.17 (37) | 37 (2026-11-13) | E2E content removed: per-phase E2E notes and gates, the Section 7 E2E plan, E2E traceability rows, Phase 18's E2E pass, Appendix B §1.9 and Appendix C (tech plans carry no E2E; `/e2e-after-change` chooses coverage from the diff) |

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link. Use the **DesignSync** tool (load it with `ToolSearch` `select:DesignSync`), with `get_project` / `list_files` / `get_file` and the project id from a `claude.ai/design/p/<projectId>` link. `get_file` is capped at 256 KiB, so check `.truncated`. A `claude.ai/artifact/<id>` canvas opens with the **Artifact** tool (`action: "read"`), and a `figma.com` link with the Figma MCP. WebFetch and curl return 403. Project sub-agents (`be-*`, `fe-*`) don't have these tools, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt.
>
> This canvas is a multi-file artifact: `project/canvas.json` maps every screen file to its page and title (`boards[<file>].page/title`) and carries the designer's notes per screen (`notes`); each screen is `project/<file>.dc.html`. Read one screen with `action: "read"`, `path: "project/<file>.dc.html"`. Screen numbers in this plan (e.g. "design 4.8") are the canvas titles.

> ⚡🔒 **Performance and security are top priorities for every phase.** Before writing code, read §9. Every new read path must be paginated or bounded, tenant-scoped, and backed by an index, with no N+1 or per-row fan-out. Every new endpoint must enforce authorization. Where §9 says data is derived or backfilled, keep it up to date on the write paths it lists. When a phase is dispatched, the orchestrator includes the §9 items that phase touches in the implementer's prompt.

> 📎 **How this plan is laid out.** Sections 1–11 are the plan. **Appendix A** (backend design) and **Appendix B** (frontend design) hold the file-by-file detail each phase points to. Where an appendix and Sections 3, 5 or 9 disagree, **Sections 3, 5 and 9 win** — the appendices were written before the contract reconciliation (Section 5), the triage of their open points (Section 3, D21–D24) and Product's round 1 answers (page version 33; Section 6 and D28–D32).

---

## 1. Requirements (extracted from PRD)

Requirement ids are the PRD's own, prefixed `TP-` (`TP-S10-R1` = Tiered Pricing, Story 10, requirement R1). Gaps in the numbering are the PRD's (it was trimmed from 362 to 250+ ids). Each story maps to one Jira story under the epic. The text below is copied verbatim from page version 37: the first line of each bullet, plus every binding sub-bullet under its requirement (TP-S1-R8, TP-S2-R8, TP-S3-R5, TP-S3-R6, TP-S4-R31, TP-S9-R4, TP-S9-R9, TP-S9-R12, TP-S9-R18, TP-S9-N6, TP-S10-R1, TP-S10-R4, TP-S10-R20, TP-S11-R6, TP-S11-R7, TP-S11-R9, TP-S11-R12, TP-S12-R2, TP-S12-R12, TP-S16-R4, TP-S19-R8, TP-S19-R20). TP-S10-R1's table is kept contiguous so it renders. Section 6 → "PRD wording per phase" names the strings each phase builds.

#### Story 1: Release day — [SV-11693](https://shopview.atlassian.net/browse/SV-11693)

- **TP-S1-R1** (SV-11693): On release day, the client's existing default matrix is renamed the General Matrix, with its rules unchanged. It prices every category that has no matrix of its own, as it does today.
- **TP-S1-R9** (SV-11693): Each existing category matrix becomes a matrix in the library with the same name, rules and categories. No category moves to another matrix. A client with no category matrices has only the General Matrix. A category matrix with no rules (today its categories are priced by the default matrix) gets a copy of its client's General Matrix rules on release day, so no price changes; afterwards it keeps its own rules, and later General Matrix edits don't reach it.
- **TP-S1-R10** (SV-11693): Apart from the rename in S1-R1 and the name suffixes in S1-E9 and S1-E13, no matrix, rule or price changes on release day. No matrix has a tier column other than Default, no matrix has its Part Sale side on, and the client has one tier, Default. The below-cost warning (Story 15) only informs.
- **TP-S1-R11** (SV-11693): Uncategorized already uses the default matrix and can't be renamed today, so the rename to General Matrix changes nothing for it.
- **TP-S1-R2** (SV-11693): Every existing customer is on the Default tier for work orders and for Part Sales.
- **TP-S1-R3** (SV-11693): For a client who changes nothing, no sell price changes on release day. Parts already on work orders and Part Sales keep their prices (S11-R6); they never show the Manual icon, and their details read "Priced before tiers" (S12-R6). A part added afterwards prices exactly as it would have the day before, receiving and canned lines included (S11-R9, S11-R7), except for the rare half-cent ties that now round up (S10-R5). Parts already received are repriced only when split onto a new work order or Part Sale (S11-E6), or when their category changes (S11-R3). A work order or Part Sale already open on release day keeps Default for parts added later, whatever tier its customer is put on (S10-R14).
- **TP-S1-R6** (SV-11693): Fixed rules are unchanged on release day and work as today.
- **TP-S1-R7** (SV-11693): There is no feature flag. Everything in this PRD ships to every client on release day.
- **TP-S1-R8** (SV-11693): Before release, the release note (the in-app What's New entry) and the client email explain these changes in plain words:
    1. Settings › Pricing has Tiers, Matrices and Fixed Rules tabs. The default matrix is now called the General Matrix, unchanged.
    2. Settings › Categories shows each category's pricing matrix and every tier's price, and edits it in place.
    3. Matrices gain tier columns, a Part Sale Matrix tab, the % Off, $ Off and + $ rules, the Price Part Simulator, the below-cost warning and an Audit Log. Tiers and categories get an Audit Log too, and the Matrices, Tiers and Categories lists each have one, deleted ones included.
    4. Part lines on work orders and Part Sales show a Priced by column, and the price itself opens the details of what priced it.
    5. The customer card on the customer page gains a Pricing section, and Edit Customer gains the two tier fields once the client has more than one active tier.
    6. A part on a line priced by a tier other than Default, received at a new cost, is priced again by that tier's current rules: the tier the line was priced for, archived or not, not the customer's current one. A line priced by Default keeps its margin, as today (S11-R9).
    7. For a customer on a tier other than Default, every part on a canned line is priced by that tier when the canned line is added, not at the sell price saved on the canned line. For a customer on Default, nothing changes (S11-R7). A part with no cost keeps the saved price until its cost comes in (S11-E8).
    8. Change Customer says that existing parts keep their prices.
    9. The new Sales by Tier and Sales by Category reports under Reports › Parts (S17-R2).
    10. For clients using customer-named categories: how to move onto tiers with CS, that deleting those categories moves their parts and past lines to Uncategorized (S1-E1), and to delete them before using Set Rule with % Off or $ Off (S1-E2).
    11. A parts discount saved in a customer's Fees & Discounts still applies on top of their tier price (S17-E1). Clients who used it as a tier remove it when they move the customer onto a tier; CS's heads-up covers the 3 clients who use it today.
    12. Moving a customer to another tier, or archiving a tier, changes nothing on work orders and Part Sales already made: an open one keeps the tier it was made with, for parts added later too, and one open on release day keeps Default. Lines split onto a new work order or Part Sale are priced by the customer's current tier (S10-R14, S11-E6).
- **TP-S1-N1** (SV-11693): None. Nothing in this story is a user action, so there is nothing to refuse.
- **TP-S1-E1** (SV-11693): Clients using customer-named categories keep working as before until they move. Deleting one moves its parts and past lines to Uncategorized (S8-R8, S8-E1); nothing recategorizes them.
- **TP-S1-E2** (SV-11693): ShopView doesn't detect customer-named categories and blocks nothing in their matrices; Set Rule reaches them too when their matrices are checked (S2-R24). A part still in one whose matrix gives a tier % Off or $ Off can be discounted twice. Example: a Fleet category priced at $160 against a real Default price of $200, then 20% off, gives $128. CS tells each client not to set % Off or $ Off there and to delete these categories before using Set Rule.
- **TP-S1-E3** (SV-11693): Moving a part out of a customer-named category changes its tax where that category has a different tax-exempt setting. It also moves its QuickBooks revenue to the part's own category (Story 18). The heads-up covers both.
- **TP-S1-E9** (SV-11693): Two existing matrices with the same name, or with names that differ only in capitals, keep both; the second is named "\<name\> (2)".
- **TP-S1-E11** (SV-11693): Today's matrix editor doesn't allow gaps or overlaps between ranges, so no existing matrix has one on release day.
- **TP-S1-E12** (SV-11693): An existing matrix whose first range starts above $0.00 shows its real start in the grid and prices exactly as today: a cost below the first range uses the first range's rule. Once that matrix side is saved, its first range starts at $0.00 (S3-R16), which changes no price.
- **TP-S1-E13** (SV-11693): An existing category matrix called "General Matrix", in any capitals, has " (old)" added to its name on release day, for example "General Matrix (old)", so the renamed default matrix keeps the name. Its rules and categories don't change.

#### Story 2: Tiers — [SV-11694](https://shopview.atlassian.net/browse/SV-11694)

- **TP-S2-R1** (SV-11694): The Tiers list shows each tier's number, name, customers and status. The Customers column counts the distinct customers on the tier for either channel, with the work order and Part Sales split on hover. Default is tier 1. Once Default is renamed, its new name carries the Default badge. The General Matrix and Uncategorized keep the Default badge they carry today; nothing else carries it.
- **TP-S2-R25** (SV-11694): The Tiers list has a Matrices column: "All" when the tier has its own rules in every Active matrix, otherwise "4/5" (Active matrices where it does, of all Active matrices). Inactive matrices don't count. Default reads "All". The count reads the Work Order Matrix side only; a separate Part Sale side doesn't change it.
- **TP-S2-R3** (SV-11694): A tier name is required, trimmed, up to 50 characters, and unique among the client's active and archived tiers, ignoring case. The field stops accepting characters at 50. A blank or taken name shows an inline error and nothing is saved; a name an archived tier uses shows "An archived tier is called \<name\>. Rename it first." The names "Manual", "Fixed price", "Fixed line total" and "Before tiers", in any letter case, are reserved for the reports and show "\<name\> is used by the reports. Choose another name.", naming the reserved name as written whatever case was typed ("Fixed price is used by the reports. Choose another name.").
- **TP-S2-R15** (SV-11694): Each active tier has a number: Default is 1 and the others follow in the order they were created, with no gaps. When a tier is archived, the tiers after it move up one number; their order and names never change. Deleting a tier renumbers the later tiers the same way. Tiers can't be reordered. Archived tiers have no number. The number shows as plain text beside the tier's name (no pill or badge) on the Tiers list, in grid headers and in a customer's tier pickers (S9-R30); on the Tiers list it sits under the # header.
- **TP-S2-R17** (SV-11694): New Tier opens a new tier's page, with no dialog: an empty name field with the cursor in it and the hint "New tiers go last, as Tier \<n\>.", Cancel and Create Tier. Until the tier is created, its matrix list has no checkboxes and no Set Rule. Create Tier creates the tier and stays on its page; it can take customers at once. There is no limit on active or archived tiers. Cancelling, or leaving with no name, creates nothing (S19-R14).
- **TP-S2-R29** (SV-11694): Creating a tier shows "\<tier\> created" with "It prices the same as the tier before it until you set its rules."
- **TP-S2-R18** (SV-11694): A new tier appears as a column in every matrix, priced Same as previous tier until a matrix gives it something else (Story 4).
- **TP-S2-R5** (SV-11694): Any tier can be renamed, Default included. Edits to its columns price parts from then on. Lines keep the name and price they recorded (S12-R5). To change a tier's pricing structure, the client can reprice it in place, or archive it, rework it while archived (S2-R6) and reactivate it, or archive it and create a new one.
- **TP-S2-R6** (SV-11694): A tier other than Default can be archived. An archived tier keeps its columns' rules and stays in reports, but can't be assigned customers (its Customers tab has no Manage Customers; a tier must be reactivated before customers are added), so it prices only parts added to open work orders and Part Sales made while it was active (S10-R14), and it has no column in any active grid or on the Categories page. It can be renamed and its pricing changed from its page (Set Rule, and the archived grid view in S4-R19). Reactivated, it goes last, with the next number, and its columns come back as they were. A tier after it on Same as previous tier keeps following the tier it follows now.
- **TP-S2-R26** (SV-11694): An archived tier's row menu has Reactivate and Delete. Delete follows S2-R8 and S2-R13, the same in the Tiers list menu and on the tier's page; an archived tier has no customers (S2-R7), so its Delete is either grayed (S2-R13) or asks first (S2-R30). Reactivate applies at once, with no confirmation, and shows "\<tier\> is reactivated. It's now the last tier, Tier \<n\>."
- **TP-S2-R30** (SV-11694): Archive and Delete ask first. "Archive \<tier\>?" (or "Delete \<tier\>?") names, one per line, each tier whose prices change because it follows this one through Same as previous tier: "These tiers price the same as \<tier\> and will follow \<tier before it\> instead:". After the list: "Parts already on work orders keep their prices." Buttons: Cancel and Archive (or Delete). The list names tiers only, never matrices: every tier that follows this one in any matrix or side, directly or through another tier that follows it. If no tier follows it, the question is just "Archive \<tier\>?" (or "Delete \<tier\>?") with the same last line. A tier with customers on it is blocked first (S2-R7).
- **TP-S2-R7** (SV-11694): A tier with customers on it, for either channel, can't be archived or deleted. Archive, and Delete unless it is grayed (S2-R13), open a dialog that says so and lists those customers with their channel(s), with the Remove Customers link (S2-R12). The client moves them (Edit Customer or Manage Customers) and tries again. There is no move step in the dialog and no "move all to another tier" action.
- **TP-S2-R12** (SV-11694): In that dialog, Close is a secondary button, as in every dialog that only informs. A "Remove Customers" link opens that tier's Manage Customers on the Remove tab, so the client can take the customers off and come back to archive. The link shows only to users with 'Customers — Create & Edit'.
- **TP-S2-R8** (SV-11694): A tier can be deleted only when no customers are on it (S2-R7) and no saved work order, estimate or Part Sale line, open or invoiced, was priced by it (S12-R19), and no open work order, estimate or Part Sale keeps it (S10-R14). These don't block deleting:
    - a customer who was on the tier and was taken off before any part was priced;
    - lines it priced that were later deleted.

  The Default tier can't be archived or deleted. Deleting a tier removes its column from every matrix.
- **TP-S2-R13** (SV-11694): Delete is grayed, in the Tiers list menu and on the tier's page, only when the tier priced saved lines or open work orders, estimates or Part Sales still keep it (S2-R8), whether or not it has customers. Hovering or focusing it shows the reason in the standard tooltip: "Can't delete \<tier\>. \<n\> open work orders, estimates or Part Sales use it." when open ones keep it, or "\<tier\> priced parts on \<n\> saved lines, so it can't be deleted. Archive it instead." when it priced saved lines (for example "Fleet Test priced parts on 3 saved lines, so it can't be deleted. Archive it instead."). When both are true, the saved-lines reason shows. An estimate counts as the work order it belongs to, so it is never counted twice. Otherwise, Archive and Delete on a tier with customers open the dialog in S2-R7. Archive is never grayed; it keeps the data for records and reports.
- **TP-S2-R14** (SV-11694): The Tiers list shows active tiers by number, then archived tiers A to Z by name. It has a Status filter (Active, Archived) that opens on Active, shows 50 tiers a page, and keeps each user's last filters and page when they come back. With the Status filter on Archived and no archived tier, the list says "No archived tiers yet." With Active, there is always at least Default.
- **TP-S2-R28** (SV-11694): Clicking an active or archived tier's row on the Tiers list opens its page on the Pricing tab, never a dialog, with the breadcrumb Settings › Pricing › Tiers › \<tier\>, also when opened from a link or bookmark. The tier's name is the page title, renamed in place and saved at once. Coming back keeps the list's filter and page (S2-R14).
- **TP-S2-R20** (SV-11694): A tier's page has Pricing and Customers tabs. Pricing lists every matrix with its categories and two columns, Work Order Matrix and Part Sale Matrix, showing how each side prices the tier ("Same as work orders" when the matrix has no separate Part Sale side), in the grid's words ("Uses previous tier", "10% off", "% markup", "Mixed rules"; S4-R31); the Default tier's Pricing tab lists every matrix with its Default rules. Edit on a matrix's row opens that matrix's page already in edit, with the tier's column in view (S3-R26). On an archived tier's page, Edit opens the archived grid view (S4-R19). The matrix list shows the General Matrix first, then matrices A to Z by name, and loads as the work order list does: the same number at a time, with more loading as the user scrolls.
- **TP-S2-R22** (SV-11694): The Pricing tab's matrix list has a checkbox on each row and a select-all checkbox in the header, which checks every matrix, Active and Inactive, loaded or not, and shows partly checked when only some are. Checking a row doesn't open the matrix. While any matrix is checked, the design system's bulk action bar shows at the top of the matrix list, as on a work order's lines, and stays in view while scrolling. It shows the count ("2 matrices"), "Set \<tier\> to", one rule picker grouped as in the grid (Off default price: % Off, $ Off; From cost: + $, Markup %, Margin %) that starts on % Off, its value, Set Rule and a clear button that unchecks every matrix. There is no Set Rule For Entire Tier button. The picker has no Previous tier option; a tier is put back on Same as previous tier from each matrix's grid, or with Undo (S2-R27).
- **TP-S2-R23** (SV-11694): Set Rule asks first: "Set \<tier\>'s Rule?" with "\<tier\> becomes \<rule\> in \<n\> matrices (\<m\> inactive), replacing what it had. Parts already on work orders keep their prices." and Cancel / Set Rule. The count is the checked matrices whose rules for the tier would change; "(\<m\> inactive)" shows only when some are Inactive. When no checked matrix would change, nothing is asked and "\<tier\> already uses \<rule\> in those matrices" shows ("in that matrix" for one).
- **TP-S2-R24** (SV-11694): On confirm, the tier gets that rule in every range of every checked matrix, Active and Inactive, on the Work Order Matrix side and on each Part Sale side that is on, replacing what it had there (its own rules or Same as previous tier). It never asks Change All (S3-R12 covers grid saves only). Unchecked matrices don't change, and the checks clear. A matrix created afterwards starts the tier as Same as previous tier (S3-R30); a Part Sale side turned on afterwards copies the tier's rule from the work order side (S3-R31).
- **TP-S2-R27** (SV-11694): The success message reads "\<tier\> set to \<rule\>" with "\<n\> matrices changed.", with Undo and a close button. It stays 20 seconds and pauses while the pointer or keyboard focus is on it. Undo puts back exactly what the tier had in every matrix it changed and shows "Undone" with "\<tier\>'s rules are back."
- **TP-S2-N7** (SV-11694): Set Rule is blocked while its value is empty or invalid, with the message by the bar: "Enter a % from 0 to 99.99" (% Off), "Enter an amount of $0.00 or more" ($ Off), "Enter a margin from 0 to 99.99" (Margin %) or "Enter a value of 0 or more" (+ $, Markup %). Cancel in the confirmation, or clearing the checks, changes nothing.
- **TP-S2-N8** (SV-11694): The Default tier's page has no checkboxes and no Set Rule; Default is priced by each matrix's Default column.
- **TP-S2-E2** (SV-11694): When a tier is archived or deleted, a tier after it priced Same as previous tier now follows the tier before it. Lines already saved keep their prices (S11-R6). An archived tier still prices parts added to the open work orders and Part Sales that keep it (S10-R14).
- **TP-S2-E5** (SV-11694): Undo is refused once any matrix it would change was saved again after the rule was set. The message names the matrix: "Can't undo: \<matrix\> was saved after this rule was set." Nothing changes.

#### Story 3: Matrices and rules — [SV-11695](https://shopview.atlassian.net/browse/SV-11695)

- **TP-S3-R18** (SV-11695): A matrix opens as a page, never a dialog, from every entry point: the Matrices list, a tier's page and a category's page. It replaces today's matrix editor dialog. Its title is the matrix name, renamed in place: the name saves as soon as the field loses focus, apart from the grid, and a name that is blank, under 3 or over 127 characters, or taken shows the inline error and keeps the old name. A new matrix's name saves with the matrix (S3-R30). Under the title, a Categories line shows the categories it prices; the General Matrix's reads "All categories without a matrix (n)". The page has two tabs, Work Order Matrix and Part Sale Matrix, each holding the tier grid (Story 4) and, under it, the Price Part Simulator (Story 5). Each tab has its own Edit, Save and Cancel. Switching tabs with unsaved changes asks "Discard these changes?" with Keep Editing and Discard Changes. Its three-dot menu has Audit Log (S19-R19).
- **TP-S3-R25** (SV-11695): Clicking a matrix's name on the Matrices list opens its page in view. Edit on the Matrices list, on a tier's page, or on a category's page whose matrix prices only that category (S7-R13) opens it already in edit. Cancel discards every change and returns it to view, asking first only when something changed (S19-R3).
- **TP-S3-R26** (SV-11695): Breadcrumbs, with no separate Back link, show where the page was opened from: Settings › Pricing › Matrices › \<matrix\>; Settings › Categories › \<category\> › \<matrix\> from a category (Uncategorized included); Settings › Pricing › Tiers › \<tier\> › \<matrix\> from a tier. Opened from a link or bookmark, the breadcrumb is Settings › Pricing › Matrices › \<matrix\>.
- **TP-S3-R13** (SV-11695): Categories are assigned to a matrix from the matrix page's Categories line, with a multi-select category picker with search and Select all, and from a category's page with its matrix picker (S7-R9). A category on another matrix shows "Now: \<matrix\>" beside it; picking it moves it to this matrix when the matrix is saved. A category removed from the line moves to the General Matrix when the matrix is saved. Uncategorized isn't listed; it always uses the General Matrix.
- **TP-S3-R28** (SV-11695): A matrix used by at least one category is Active; the General Matrix is always Active. A matrix with no categories is Inactive: it prices nothing, keeps its rules, and can be saved that way (a new matrix, a duplicate, or a matrix whose last category was removed). Adding a category makes it Active at once; removing its last category makes it Inactive. The Matrices list shows Active or Inactive as a badge; the matrix page shows Inactive as plain gray text beside the name and nothing when Active.
- **TP-S3-R5** (SV-11695): A rule is a cost range (start and end, both inclusive) with one calculation, in two groups:
    - Off default price, in tier columns only: % Off (a percent off Default's sell price) and $ Off (a dollar amount off Default's sell price);
    - From cost: + $ (cost plus a dollar amount per unit), Markup % and Margin %.

  No value is negative. A column picks its rule type once (S4-R5), so a matrix can mix calculations across its columns.
- **TP-S3-R20** (SV-11695): A matrix side has one set of cost ranges, shared by Default and every tier column. Add Range, removing a range and changing a range's end change the ranges for every column; % Off and $ Off keep each range's value with its range.
- **TP-S3-R6** (SV-11695): Save is blocked, with the cells highlighted and a message naming them, when:
    - a range's end isn't above its start ("Enter an end above \<start\>");
    - a value is empty, a Default cell included ("Enter a value");
    - a value has more than two decimals ("Use at most two decimals");
    - a margin is 100% or more ("Enter a margin from 0 to 99.99"); today's editor converts one silently;
    - a % Off isn't from 0 to 99.99 ("Enter a % from 0 to 99.99");
    - a $ Off is below $0.00 ("\<tier\>: enter $0.00 or more in every range.");
    - ranges carried from before release leave a gap or overlap (S1-E11);
    - a new matrix's name is empty, under 3 or over 127 characters, as today, or another matrix has it, ignoring case (an inline error under the name).

  0% markup or margin, + $0.00, 0% off and $0.00 off are allowed; they sell at the base price.
- **TP-S3-R16** (SV-11695): Ranges are entered by their end. The first range starts at $0.00; each later range starts $0.01 above the end of the range before it ("$25.01 to \[end\]"), so ranges never overlap or leave a gap. The last range has no end ("$10,000.01 and up") and can't be removed. Add Range adds a range before the last one.
- **TP-S3-R32** (SV-11695): Each range except the last has a delete button at its left (tooltip "Remove this range"), lined up down the grid. Removing a range merges it into the range above, which takes its end.
- **TP-S3-R23** (SV-11695): In every column, the last range copies the calculation and value of the range above it, and follows it when that range changes, is added or removed. Its tooltip reads "Same as the rule above". Editing the last range to a different calculation or value makes it its own rule, kept when the matrix is saved and reopened; editing it back to match makes it follow again. In a matrix with one range, that range has no rule above it to follow.
- **TP-S3-R30** (SV-11695): A new matrix opens in edit with an empty name, one range from $0.00 with an empty Default cell, and every tier on Same as previous tier. Nothing is created until Save.
- **TP-S3-R21** (SV-11695): The Part Sale Matrix tab has a "Separate Part Sale pricing" switch, off by default. Off, the tab shows only the switch and an info-icon tooltip saying Part Sales use the work order prices, with no grid and no Edit; Part Sales of this matrix's categories are priced by its Work Order Matrix.
- **TP-S3-R31** (SV-11695): Switching it on saves at once: the Part Sale side starts as a copy of the Work Order Matrix's current rules, every tier column included, and prices only Part Sales. Switched off and on again, it starts as a fresh copy; the deleted rules don't come back.
- **TP-S3-R27** (SV-11695): Switching it off asks first: "Turn Off Part Sale Pricing?" with "Turning off the separate Part Sale matrix will revert the pricing to the work order matrix." and Cancel / Turn Off. On confirm the Part Sale rules are deleted.
- **TP-S3-R8** (SV-11695): Duplicate makes "\<name\> (copy)", or "(copy 2)" and so on when that name is taken, in the library, with the same rules on both sides and every tier column, and no categories. The copy opens on its page. It has no tie to the matrix it came from.
- **TP-S3-R9** (SV-11695): Deleting a matrix asks first, naming the categories it prices. On delete, its categories move to the General Matrix (S11-R6).
- **TP-S3-R12** (SV-11695): Only a grid Save asks Change All: saving the grid of a matrix used by more than one category asks it (S4-R16). The General Matrix never asks; it confirms instead (S4-R18). A change to Default's rules also names the tiers that price from Default (S4-R30). Renaming, changing its categories and turning the Part Sale switch on save without asking; turning it off asks first, because it deletes that side's rules (S3-R27). Otherwise, a matrix used by one category, or by none, saves without asking.
- **TP-S3-N3** (SV-11695): The General Matrix can't be deleted. Delete is disabled, with the tooltip "The General Matrix can't be deleted. You can edit it."
- **TP-S3-N4** (SV-11695): The General Matrix's categories can't be picked: it always prices every category without a matrix of its own.
- **TP-S3-E3** (SV-11695): Costs are rounded to the cent, half away from zero, before a rule is chosen. So a cost of $10.005 is $10.01 and falls in exactly one range.
- **TP-S3-E4** (SV-11695): On release day every range keeps its calculation and value. An existing last range that differs from the range above it becomes its own rule; one that matches starts following. Opening or saving a matrix without editing its rules never changes a price.

#### Story 4: The tier grid: every tier of a matrix, edited in place — [SV-12456](https://shopview.atlassian.net/browse/SV-12456)

- **TP-S4-R1** (SV-12456): Columns: Cost Range, Default, then each active tier by number. Each tier header shows its number and name, with no tooltip. Rows: the matrix side's cost ranges (S3-R20).
- **TP-S4-R27** (SV-12456): Default and every tier column share the grid's width evenly, in view, in edit and in the Price Part Simulator. A column is never narrower than 128px or wider than 176px. Below 128px the grid scrolls sideways with Cost Range pinned; above 176px the columns stop growing and the spare width stays at the right. The grid is never wider than 1760px. Columns can't be resized; a longer tier name is cut short with "…" and shows in full on hover. On a 1512-wide screen at least Default and 3 tiers show without scrolling.
- **TP-S4-R3** (SV-12456): Each cell shows its rule in short: "10% off", "$5 off", "Cost + $5" ("Cost + $5.50" with cents), "35% markup", "30% margin". A Same as previous tier column's cells read "Uses previous tier", and hovering one names the tier it follows, by number and name: "Uses previous tier, 2 · Wholesale." When that tier also uses its previous tier, the hover adds the tier whose rule actually prices it, without the tiers in between: "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule." There is no "How it's priced" row.
- **TP-S4-R4** (SV-12456): Edit turns every cell editable. An edit bar shows "No changes yet" or "\<n\> changes", with Cancel and Save and no other button. A new matrix has Cancel and Create Matrix in the page head instead. The count is what the user edited, measured against the last saved version, so a value changed and then changed back doesn't count: each cell they changed whose value now differs, each range end that differs, each range added or removed, and each column whose rule type differs counts as one change. Gray auto-filled values and cells that change only because they follow another column (Same as previous tier) don't count. Nothing changes until Save (S3-R25).
- **TP-S4-R5** (SV-12456): In edit, each column's rule picker sits under its name in the header. A tier's picker lists, in order: Previous tier (Same as previous tier); Off default price: % Off, $ Off; From cost: + $, Markup %, Margin %. Picking a type applies it to every range of the column and clears its values. Each Cost Range cell has its end (S3-R16).
- **TP-S4-R28** (SV-12456): In edit, a From cost cell's symbol ($ before the value for + $, % after it for Markup % and Margin %) is a small picker with + $, Markup % and Margin %. Picking one changes that range only and clears its value. Once a column's ranges use different types, its header picker shows "Mixed rules" as its current value (never offered as a choice), its cells each show their own value with their own type ("35% markup", "30% margin"), as S4-R3 says, and the column reads "Mixed rules" in view and on the Categories list. "Mixed rules" is only for different types (S4-R31). Picking a type in the header makes the whole column that type again.
- **TP-S4-R31** (SV-12456): Wherever a column's rules are summed up in one label (the Categories list, a tier's Pricing tab, and the column's header picker for "Mixed rules"):
    - One rule, the same value in every range: the value with its type, for example "35% markup", "30% margin", "Cost + $5", "10% off", "$5 off".
    - Several ranges, all one type, with different values: the type alone, with no value, for example "% markup", "% margin", "Cost + $", "% off", "$ off". This is a normal layered matrix; the General Matrix usually reads "% markup".
    - Ranges of different types: "Mixed rules".

  The grid itself always shows each range's own value (S4-R3). % Off and $ Off cells have no symbol picker: an Off default price column uses one type.
- **TP-S4-R29** (SV-12456): In edit, Tab moves down the column: from a range to the next range of the same tier, and from the last range to the first range of the next column. Shift+Tab goes back up. The range ends in the Cost Range column work the same way. On a From cost value, Alt+Down opens that range's rule picker (S4-R28), as on any dropdown.
- **TP-S4-R7** (SV-12456): % Off and $ Off give each cost range its own value, taken off Default's sell price in that range. Picking a new rule type clears the column's values; % Off and $ Off start empty in every range, so auto-fill works there as in a From cost column (S4-R26).
- **TP-S4-R26** (SV-12456): In edit, typing a value in a range fills every range below it that is empty or was filled this way, in gray, with the same rule type and value. Auto-fill always follows the last range entered in that column: if range 1 is + $ and range 2 is Markup %, ranges 3 and below follow range 2. A gray value can be typed over; a range typed over is left alone afterwards. Save saves every range, gray values included.
- **TP-S4-R10** (SV-12456): Choosing Same as previous tier fills the column's cells with what the previous tier pays in this matrix (down to Default when that tier is itself Same as previous tier), editable. Saved with those values unchanged, the tier keeps following the previous tier ("Uses previous tier" in view). With any value changed, it saves as the tier's own rules starting from the copied rule types and values.
- **TP-S4-R12** (SV-12456): Save validates the grid (S3-R6), then saves every column at once, after the question in S4-R16 or the confirmation in S4-R18 where they apply. The success toast reads "\<matrix\> saved" with what changed and "Parts already on work orders keep their prices.", for example "1 change: Tier 5 is 28% margin."; changes are counted as in S4-R4. It names up to three changes, then "and \<n\> more", for example "3 changes: Tier 5 is 28% margin; Default is 35% markup; 1 range added." Gray auto-filled ranges are saved but not counted, so a save can change more ranges than the count names. The grid returns to view.
- **TP-S4-R20** (SV-12456): After Save, the cells whose rule changed stay highlighted until the user leaves the page.
- **TP-S4-R15** (SV-12456): "Default" in every label is the Default tier's current name. If a client renames Default to "Retail", the column, the "Off Retail price" group heading and every price detail follow. The Priced by column, the Change Customer notice and the reports use the current name, and so do the price details for Default. The Default badge keeps reading "Default".
- **TP-S4-R30** (SV-12456): Saving a change to Default's rules in any matrix names every tier that prices from Default there: a tier on % Off or $ Off, and a tier on Same as previous tier that reaches Default or such a tier. They are listed one per line under "Default's rules change, and these \<n\> tiers price from Default in this matrix, so they change too:" ("this tier prices … so it changes too" for one). Alone it asks "Change Default's Prices?" with "Parts already on work orders keep their prices." and Cancel / Save. For a matrix used by more than one category the list joins the Change Prices question (S4-R16); for the General Matrix it joins its confirmation (S4-R18). With no such tier, nothing extra is asked. Adding or removing a range, or moving a range's end, is a change to Default's rules (S3-R20).
- **TP-S4-R16** (SV-12456): Saving the grid of a matrix used by more than one category asks "Change Prices in \<n\> Categories?" with "The \<matrix\> matrix prices \<n\> categories:", every category on its own line, then "Saving changes prices in all \<n\>. Parts already on work orders keep their prices." and Cancel / Change All. It never counts parts or customers.
- **TP-S4-R22** (SV-12456): Change All saves the edited grid for every category using the matrix.
- **TP-S4-R18** (SV-12456): Saving the General Matrix never asks Change All; it always saves for every category without a matrix of its own. It confirms first: "Save the General Matrix?" with "This changes prices for \<n\> categories without a matrix of their own." and Cancel / Save. n counts the categories without a matrix of their own, Uncategorized included.
- **TP-S4-R19** (SV-12456): Edit on an archived tier's Pricing tab opens that matrix's grid in an archived view: Default plus every archived tier as columns, laid out like the active grid, with archived tiers in the order they were archived, earliest first; only the archived tiers' columns can be edited (S4-R32). A notice at the top reads "Archived tiers don't price parts. Reactivate a tier and assign customers to use these rules." In the archived view, a Same as previous tier column follows the column directly to its left, as in an active grid; for the first archived tier that is Default. The Price Part Simulator shows under the archived grid for the columns shown, priced the same way, so someone deciding whether to reactivate a tier can see how it would price parts against Default. Active grids never show archived tiers; an archived tier's rules are kept and come back with its column when it is reactivated (S2-R6).
- **TP-S4-R32** (SV-12456): In the archived grid view, Default's column and the cost ranges are read-only; Default's column shows the tooltip "Default prices live parts, so it can't be changed in the archived view." Saving changes only archived tiers, so it never asks Change Prices (S4-R16), the General Matrix confirmation (S4-R18) or the Default question (S4-R30).
- **TP-S4-N1** (SV-12456): Default's picker lists only the From cost types (+ $, Markup %, Margin %): Default has no Same as previous tier, % Off or $ Off. Its cells can still mix From cost types (S4-R28).
- **TP-S4-E3** (SV-12456): A tier created while a grid is open in edit appears after the grid is saved or cancelled, as Same as previous tier.

#### Story 5: Price Part Simulator — [SV-12457](https://shopview.atlassian.net/browse/SV-12457)

- **TP-S5-R1** (SV-12457): Under the grid on the matrix page, on both tabs, a separate table titled "Price Part Simulator", with the info tooltip "Type a part cost to see each tier's price and profit. Nothing is saved.", has one Part Cost field, in dollars, starting at $100.00. Its columns line up with the grid's. Tier pages and category pages have no simulator.
- **TP-S5-R2** (SV-12457): For the typed cost, the table shows, under Default and each active tier, the sell price and the profit ("$12.50 profit") for a part with that cost in a category on this matrix, on that tab's side. Profit is the sell price minus the typed cost, per unit, before Fees & Discounts, rounded to the cent.
- **TP-S5-R3** (SV-12457): Prices follow Story 10 exactly, Same as previous tier included. A cost on a range boundary is priced by the range that contains it, and a cost with more than two decimals is rounded to the cent first (S3-E3).
- **TP-S5-R4** (SV-12457): The table updates as the cost is typed and, while the grid is in edit, reflects the unsaved values.
- **TP-S5-R5** (SV-12457): A negative profit shows with a minus sign, and a sell price below the typed cost shows the below-cost warning icon with the tooltip "Below cost." (S15-R5).
- **TP-S5-R6** (SV-12457): Nothing typed in the simulator is saved or changes a price.
- **TP-S5-N1** (SV-12457): An empty cost, zero, or a value that isn't a number: the field shows an error and the table shows "—" under every column.

#### Story 6: Every matrix in one list — [SV-11696](https://shopview.atlassian.net/browse/SV-11696)

- **TP-S6-R11** (SV-11696): Settings › Pricing has Tiers, Matrices and Fixed Rules tabs, replacing today's Pricing matrices and Fixed rules tabs. The Fixed Rules tab lists only fixed rules, as today.
- **TP-S6-R1** (SV-11696): Settings › Pricing › Matrices lists every matrix with Matrix, Status, Categories, Tiers, Work Order Matrix (Default's rules in short) and Part Sale Matrix (On or Off). Status is Active or Inactive (S3-R28), with "No categories use this matrix" on hover for Inactive.
- **TP-S6-R10** (SV-11696): The Tiers column reads "All" when every active tier has its own rules in that matrix. Otherwise it lists the numbers of the tiers that do ("1, 2, 4"), with their names on hover. Default always counts. Archived tiers never show in this column. The column reads the Work Order Matrix side only; a separate Part Sale side doesn't change it.
- **TP-S6-R8** (SV-11696): The General Matrix is listed first with the Default badge; its Categories cell reads "All categories without a matrix (n)", where n counts those categories now, Uncategorized included.
- **TP-S6-R7** (SV-11696): Other matrices show up to three category names, then "+N" with the full list on hover. A matrix with no categories shows "—" and stays in the list.
- **TP-S6-R9** (SV-11696): Each row has Edit, which opens the matrix page in edit (S3-R25), and a More Actions menu with Duplicate and Delete (S3-R8, S3-R9), as on the Digital Vehicle Inspection templates list. New Matrix opens a new matrix page (S3-R30) that can be cancelled before it is saved (S19-R14).
- **TP-S6-R2** (SV-11696): The list has a search that matches matrix and category names, and a Status filter (Active, Inactive).
- **TP-S6-R3** (SV-11696): A search with no match says 'No matrices match the search "…".' with Clear Search; filters with no match say "No matrices match these filters" with Clear All Filters.
- **TP-S6-R6** (SV-11696): The list shows 50 matrices a page, the General Matrix first, then by name A to Z. The Matrix and Categories columns sort. Categories sorts by the number of categories, most first on the first click (S19-R22). Search, sort and page are kept when the user comes back.

#### Story 7: Categories: every category's pricing at a glance — [SV-12458](https://shopview.atlassian.net/browse/SV-12458)

- **TP-S7-R1** (SV-12458): Settings › Categories lists every category, including one with no sales or parts, with Category, Pricing Matrix, Default, then one column per active tier by number, each header with the tier's number and name. Uncategorized is first. The General Matrix shows its Default badge in the Pricing Matrix column.
- **TP-S7-R2** (SV-12458): Each Default and tier cell shows its Work Order Matrix rule in short, as S4-R31 sets out ("25% margin", "% markup", "Mixed rules", "5% off", "$5 off", "% off"), or "Uses previous tier" for a Same as previous tier column, with the full rule on hover. The hover lists each cost range on its own line, for example "$0.00 to $25.00: 35% markup". A "Uses previous tier" cell's hover reads as in S4-R3: "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule." The hover shows the Work Order Matrix rule only; Part Sale rules are on the matrix page's Part Sale Matrix tab.
- **TP-S7-R4** (SV-12458): Search matches category and matrix names; the list sorts by Category or Pricing Matrix, with Uncategorized always first. On first load, Uncategorized is first, then categories A to Z by name. The list loads as the work order list does: the same number at a time, with more loading as the user scrolls. Search and sort are kept when the user comes back. A search with no match says 'No categories match the search "…".' with Clear Search.
- **TP-S7-R6** (SV-12458): Clicking anywhere on a category's row opens its page, never a dialog, with the breadcrumb Settings › Categories › \<category\>. The page has its name, renamed in place; its Pricing Matrix picker; QuickBooks Products and Services (only when QuickBooks is connected, as today); Tax Exempt; New Matrix; Delete, in the page's ⋯ menu (S8-R8); then the matrix's tier grid, read-only, with no simulator. Every field today's Edit Category has stays on the page. Edit works as S7-R13 says.
- **TP-S7-R13** (SV-12458): On a category's page, Edit opens the matrix's page already in edit (S3-R25, S3-R26) when only this category uses the matrix. When the matrix prices more than one category (the General Matrix included), Edit is grayed with the tooltip "Can't edit here. The \<matrix\> matrix prices \<n\> categories, so edit it from the matrix." ("The General Matrix prices \<n\> categories, …"), and a link beside it, "Go to the \<matrix\> matrix" ("Go to the General Matrix"), opens the matrix's page already in edit; the breadcrumb leads back to the category.
- **TP-S7-R15** (SV-12458): Above the grid, a line names the other categories the matrix prices: "The \<matrix\> matrix also prices \<n\> other categories: \<A\> · \<B\>." ("1 other category" for one). For the General Matrix: "The General Matrix also prices every other category without a matrix of its own (\<n\>)."
- **TP-S7-R14** (SV-12458): In Settings, the Parts group lists Categories, then Pricing, then Bin Locations. Today it lists Pricing, Bin Locations, then Categories.
- **TP-S7-R12** (SV-12458): The name, the QuickBooks Products and Services mapping, Tax Exempt and the Pricing Matrix pick each save as soon as they are changed (S7-R9).
- **TP-S7-R9** (SV-12458): Picking a different Pricing Matrix moves the category at once, shows that matrix's grid, and confirms with "\<category\> now uses \<matrix\>" and "Parts already on work orders keep their prices."
- **TP-S7-R11** (SV-12458): New Matrix opens a new matrix page (S3-R30) with this category already picked (S3-R13).
- **TP-S7-N1** (SV-12458): Without 'Settings — Parts', there is no Categories page, as today (S16-R8).

#### Story 8: Categories over time — [SV-11704](https://shopview.atlassian.net/browse/SV-11704)

- **TP-S8-R1** (SV-11704): Renaming a category keeps it on the same matrix under the new name.
- **TP-S8-R10** (SV-11704): New Category on the Categories page opens a New Category page: a name, a Pricing Matrix (the General Matrix unless another is picked), QuickBooks Products and Services (only when QuickBooks is connected, as today) and Tax Exempt, with the matrix's grid, read-only. A new category is priced for every tier from the start. It has Save and Cancel; nothing is created until Save (S19-R14).
- **TP-S8-R3** (SV-11704): Every new part starts in Uncategorized. An advisor can change the category, which reprices the part (S11-R3).
- **TP-S8-R4** (SV-11704): Uncategorized is a system category. It can't be renamed, deleted or edited, and always uses the General Matrix; no action changes its matrix. Its page is read-only, with no rename, Delete or matrix picker. Its Edit is grayed with a link to the General Matrix, like any category on a shared matrix (S7-R13).
- **TP-S8-R8** (SV-11704): Today, deleting a category that parts use is blocked ("Category cannot be deleted. It is used in one or more products."); now Delete, on the category's page, asks first instead, and nothing blocks deleting a category other than Uncategorized. It asks "Delete \<category\>?" with "Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. Invoices already sent aren't sent again; one synced again later books these parts to Uncategorized's QuickBooks item. This can't be undone." and Cancel / Delete (red), with no counts. On confirm the category is deleted, its parts and every line move to Uncategorized (priced by the General Matrix from their next reprice), its QuickBooks product and service mapping is removed, as today, the delete is sent to AccountingHub (S18-R6), and its matrix stays in the library.
- **TP-S8-N3** (SV-11704): Category names are unique, ignoring capitals: "A category called \<name\> already exists". They need at least 3 characters, as today.
- **TP-S8-E1** (SV-11704): If a category is deleted, every part in it moves to Uncategorized, as today: catalog parts, work order and Part Sale lines (invoiced ones included), canned line parts, and order and delivery items. Past lines report as Uncategorized, so category reports for past periods change; that is accepted for customer-named categories (S1-E1). Invoices already sent to QuickBooks or AccountingHub aren't sent again because their lines moved (S18-R5, S18-R6). A matrix left with no category stays in the library and prices nothing.
- **TP-S8-E2** (SV-11704): Deleting a category changes no price. The move is not a category change under S11-R3, so it never reprices lines in bulk. A moved part is priced by the General Matrix only the next time it is repriced (its cost or category changes).

#### Story 9: Putting customers on tiers — [SV-11697](https://shopview.atlassian.net/browse/SV-11697)

- **TP-S9-R1** (SV-11697): Every customer has a work order tier and a Part Sales tier, chosen independently from the client's active tiers; an archived tier can't be picked. Changing one never changes the other.
- **TP-S9-R2** (SV-11697): A new customer, an imported one included, starts on Default for both channels. New Customer shows both tier fields, set to Default, to users with 'Customers — Create & Edit' (S9-R31). They are the first pricing fields on New Customer; every other pricing field shows only in Edit Customer today.
- **TP-S9-R3** (SV-11697): Edit Customer shows the Work Order Tier and Part Sales Tier fields directly under Default Shop Supplies, before Notes. None of Edit Customer's existing fields move.
- **TP-S9-R31** (SV-11697): Edit Customer and New Customer show the tier fields only when the client has more than one active tier. With only Default, they are hidden and every customer stays on Default.
- **TP-S9-R30** (SV-11697): The tier pickers list active tiers by number, each shown as its number and name, for example "4 · Fleet". The picker's search matches the number or the name (S19-R18).
- **TP-S9-R12** (SV-11697): The customer page shows the customer's pricing, read-only, in a section of its customer card headed "Pricing", under IBS. This is the card on the customer page, not the customer card on work orders, Part Sales and imported work orders. The section shows, in order:
    - Labor Rate: the rate at the user's current location, with "Varies by location" when the customer's rate differs at another location;
    - Shop Supplies: "No shop supplies", the customer's own charge, or "Location default";
    - Tax: the name of the tax picked on the customer, exactly as the client named it in Settings, or "Default Tax Settings" when none is picked, as on Edit Customer;
    - Work Order Tier and Part Sales Tier, each with its number, only when the client has more than one active tier (S9-R31).
- **TP-S9-R14** (SV-11697): The card's own edit icon opens Edit Customer, where tiers, labor rate and shop supplies are changed, as today.
- **TP-S9-R15** (SV-11697): The whole pricing section, tiers included, shows only to users with 'View and Manage AP/AR Data'. Changing tiers in Edit Customer needs only 'Customers — Create & Edit'.
- **TP-S9-R16** (SV-11697): The pricing rows show even when the customer has no address. Today the card hides every row, IBS included, for a customer with no address.
- **TP-S9-R4** (SV-11697): A tier's Customers tab lists its customers with their channel(s). Manage Customers can be opened at any time. It has two tabs:
    - Add Customers lists every customer who isn't on the tier for at least one channel;
    - Remove Customers lists the customers on the tier, with the count.

  Each row shows the customer's current work order and Part Sales tiers.
- **TP-S9-R17** (SV-11697): Each Manage Customers tab says what it does in a tooltip on its title, with no message above the list.
- **TP-S9-R18** (SV-11697): Ticking customers shows the design system's dark bulk action bar at the top of the dialog, above the search and the list, as on a work order's lines. It holds:
    - "3 selected";
    - Select All, with the number of customers in the list, while not every customer is ticked;
    - a Work Orders checkbox and a Part Sales checkbox;
    - the X that clears the selection.
- **TP-S9-R19** (SV-11697): A channel checkbox in the bar is checked when every ticked customer has that channel, and mixed when only some do. Checking or clearing it sets that channel on every customer ticked at that moment. On the Remove tab, it sets the channels to take them off.
- **TP-S9-R20** (SV-11697): A customer ticked afterwards starts with both channels it isn't on yet, until it is changed on its row or in the bar.
- **TP-S9-R21** (SV-11697): Each ticked row has its own Work Orders and Part Sales chips. A chip shows locked when its channel can't change: on Add, a channel the customer is already on; on Remove, a channel they are not on. A locked chip is greyed and shows only its name ("Part Sales"), with no added words.
- **TP-S9-R22** (SV-11697): A removed customer goes back to Default for that channel.
- **TP-S9-R23** (SV-11697): The footer sums up the change ("Adding 3 customers: 2 for both, 1 for Work Orders only."). The button names the count: "Add 3 Customers"; on Remove, a red "Remove 2 Customers".
- **TP-S9-R24** (SV-11697): Switching tabs clears the picks.
- **TP-S9-R5** (SV-11697): A customer's tiers change only by an explicit action. A customer's row on a tier's Customers tab has no actions menu. One customer is moved to another tier in Edit Customer, from their customer page. Several are moved in the other tier's Manage Customers. There, adding a customer for a channel takes them off the tier they were on for that channel (S9-R1).
- **TP-S9-R7** (SV-11697): Changing a customer's tier never changes their work orders or Part Sales already made: their prices stay (S11-R6), and open ones keep the tier they were made with (S10-R14). The dialog says "Existing work orders and Part Sales keep their prices and tier."
- **TP-S9-R27** (SV-11697): After a customer's tier changes in Edit Customer or Manage Customers, their open work orders and Part Sales keep the tier they were made with, for parts added later too (S10-R14), and their lines show no Manual icon. Price details on those lines name that tier and the customer's tier now (S12-R12), only on that channel: a work order tier change doesn't affect Part Sales.
- **TP-S9-R8** (SV-11697): The built-in Counter Sale customer can be put on a tier for work orders and for Part Sales, like any customer, so walk-in sales can have their own price. Edit Customer shows a tooltip on this customer's tier fields: "Every walk-in sale uses this tier." The tooltip shows only on the Counter Sale customer ShopView created when the account was set up; a client-created customer, even one named Counter Sale, is an ordinary customer.
- **TP-S9-R9** (SV-11697): A tier's Customers tab (the customers on the tier) has:
    - search by customer name;
    - a channel filter (Work orders, Part Sales, Both);
    - sorting by customer name, A to Z by default, and a sortable channel column, with ties broken by customer name;
    - 50 customers a page.

  Its search, filters, sort and page are kept when the user comes back.
- **TP-S9-R10** (SV-11697): The Manage Customers picker has the same sort. Its search matches the customer's name and the names of their current work order and Part Sales tiers, so typing "Fleet" finds the customers on Fleet. It has no paging: it loads 50 customers at a time as the user scrolls in the dialog. The tab count and Select all cover every customer the search matches, loaded or not.
- **TP-S9-R11** (SV-11697): The Customers list is unchanged. A customer's tiers are seen on the customer page, in Edit Customer and on a tier's Customers tab.
- **TP-S9-N1** (SV-11697): A ticked customer with neither Work Orders nor Part Sales shows "Pick Work Orders, Part Sales or both." and the button stays off. With nobody ticked, the footer says "No customers picked yet." and the button is off.
- **TP-S9-N3** (SV-11697): Closing Manage Customers without saving changes nothing.
- **TP-S9-N6** (SV-11697): The empty states say:
    - a search with no match, on a tier's Customers tab or in Manage Customers: 'No customer matches "…".';
    - the Add tab when every customer is already on the tier: "Every customer is already on Fleet Platinum.";
    - the Remove tab of an empty tier: "No customer is on Fleet Platinum yet."
- **TP-S9-E2** (SV-11697): Selecting all of a large customer list (for example 1,284) saves with the spinner, then the confirmation toast.
- **TP-S9-E3** (SV-11697): A customer can't be deleted when they have work orders or Part Sales, vehicles, linked contacts, transactions, payments or open credit, as today. Deleting a customer with none of these removes their tier assignments.
- **TP-S9-E5** (SV-11697): On the Add tab, Select All and a channel checked in the bar leave out any customer already on the tier for every channel picked. Those customers aren't ticked, and the footer says how many were skipped ("12 skipped: already on Fleet Platinum for Work Orders."). They never block Save. A customer can still be ticked for a channel they aren't on yet.
- **TP-S9-E7** (SV-11697): The Remove tab works the same way: customers who aren't on the tier for any channel picked are left out. On both tabs, checking a channel in the bar again skips again. A customer ticked by hand stays ticked for the channels they can still use.
- **TP-S9-E6** (SV-11697): A bulk add or remove is all or nothing. If any customer fails, nothing is saved and the dialog keeps the picks.

#### Story 10: How a part is priced — [SV-11699](https://shopview.atlassian.net/browse/SV-11699)

- **TP-S10-R1** (SV-11699): Unless the part is on a line with a fixed line total (S10-R13), the system prices a part by the first of these that applies, in order:

  | Order | What applies | Pricing source |
  |---|---|---|
  | 1 | A sell price or margin typed on the line, by a user allowed to change pricing | Manual |
  | 2 | A fixed sell price on the part | Fixed price |
  | 3 | The work order's tier: the customer's tier for this channel (work order tier on work orders, Part Sales tier on Part Sales) when the work order or Part Sale was made (S10-R14), in the matrix of the part's category | Tier, or Default when the customer is on Default |

  Every way a part reaches a work order or Part Sale is priced by this order (S11-R7), and the line records what priced it (S12-R4).
- **TP-S10-R17** (SV-11699): The part's category gives the matrix: the category's own matrix, or the General Matrix when the category has none. A category uses one matrix; one matrix can price several categories. A part number typed on the add row that matches a catalog part is priced by that part's own category, the same as picking it; today it gets Uncategorized's price.
- **TP-S10-R18** (SV-11699): On a work order, the matrix's Work Order Matrix side prices the part. On a Part Sale, its Part Sale Matrix side prices the part when that side is on, otherwise its Work Order Matrix side (S3-R21). This holds for the General Matrix too.
- **TP-S10-R19** (SV-11699): A customer on Default pays that side's Default column.
- **TP-S10-R20** (SV-11699): A customer on another tier pays that tier's column on that side:
    - From cost (+ $, Markup %, Margin %): the tier's own rule for the part's cost;
    - % Off: Default's price for the part on that side, less the percent set for the part's cost range;
    - $ Off: Default's price for the part on that side, less the amount set for the part's cost range, never below $0.00;
    - Same as previous tier: exactly what the tier before it (by number) pays in the same matrix and side, following each Same as previous tier in turn, ending at Default.
- **TP-S10-R21** (SV-11699): A tier never borrows from another matrix: the General Matrix prices only categories without a matrix of their own. A tier on Same as previous tier in a category's matrix is priced from that matrix, even when the General Matrix gives the tier something else.
- **TP-S10-R2** (SV-11699): Default's column always prices a part that has a cost, so every tier, through Same as previous tier, always has a price. Fees & Discounts apply after the line prices, as today (S17-E1).
- **TP-S10-R3** (SV-11699): Inside a column, the rule whose cost range contains the part's cost applies. A cost above the last range's start is priced by the last rule ([SV-4409](https://shopview.atlassian.net/browse/SV-4409)). Start and end are both inclusive, and ranges have no gaps (S3-R16), so every cost falls in exactly one range.
- **TP-S10-R4** (SV-11699): Each calculation gives the sell price this way:
    - Markup % or Margin %: the value entered drives the price, with the same math ShopView uses today (markup: cost × (1 + markup); margin: cost ÷ (1 − margin)). % Off, $ Off and + $ are the only new calculations;
    - \+ $: the cost plus the amount, per unit;
    - % Off: the price the Default column gives that part at that moment, on the same matrix side, less the percent;
    - $ Off: that Default price less the amount, per unit; a result below $0.00 is $0.00.
- **TP-S10-R5** (SV-11699): Sell prices are rounded to the cent, half away from zero, exactly, so the simulator, the grid, line prices and reports always agree. Today's markup math rounds about 1 in 1,300 half-cent ties down; those prices are one cent higher for parts priced from release day. Every price shown is rounded to the cent.
- **TP-S10-R15** (SV-11699): % Off rounds the Default price to the cent first, then applies the discount and rounds again. So the discount is always exactly the percentage off the Default price the client sees. Example: a Default price of $10.005 shows as $10.01, and 10% off gives $9.01 (rounding once would give $9.00).
- **TP-S10-R6** (SV-11699): + $ amounts apply per unit and are plain amounts, like every price in ShopView today. ShopView doesn't convert currencies. The line total is the unit sell price times the quantity.
- **TP-S10-R7** (SV-11699): The cost used is the cost on the line, per unit, as matrices use today.
- **TP-S10-R11** (SV-11699): A customer's tiers price the same at every location. They are client-wide, like matrices, categories and customers.
- **TP-S10-R16** (SV-11699): What is set per location is unchanged. A fixed sell price belongs to the location's inventory part, so the same customer can get a fixed price on a part at one location and their tier price at another. Fees & Discounts and labor rates follow the location, as today.
- **TP-S10-R12** (SV-11699): Special-order and catalog-only parts are priced by the same order as inventory parts. They can't carry a fixed price, so a typed price applies first, then the customer's tier. A special-order part with no cost is priced when its cost is entered or it is received (S11-R1, S11-R9).
- **TP-S10-R13** (SV-11699): A part on a line with a fixed line total keeps its own sell price, as today. The customer pays the line's fixed total. The line stores the fixed total's parts amount (the fixed total less its labor). No tier or Default prices those parts, and their pricing source is Fixed line total. Sales by Tier reports the line's parts amount in its Fixed line total row (Sales by Tier S1-E4). The line also records each part's share of its parts amount, split in proportion to the parts' costs at invoicing, in cents (by quantity when every part costs $0.00), so reports and credits always read the same split. Prices are per unit, so any leftover cent goes on a part with a quantity of 1, or on the line's labor when there is none, as today.
- **TP-S10-R14** (SV-11699): A work order or Part Sale keeps the tier its customer had for that channel when it was made, even if that tier is archived later. Every part added to it is priced by that tier's current rules; receiving follows S11-R9. A work order or Part Sale already open on release day was made before tiers, so it keeps Default for both channels, whatever tier its customer is later put on; to use the customer's tier, the advisor splits the lines onto a new work order or Part Sale (S11-E6). Moving the customer to another tier affects only work orders and Part Sales made afterwards, or made by splitting (S11-E6). Changing the customer on a work order or Part Sale doesn't change its tier either: new parts keep being priced by the tier it was made with (S14-R3).
- **TP-S10-R22** (SV-11699): When a cost is typed on a work order part line, the sell price fills in as quickly as today (about 0.3 seconds) at the largest client's size: about 270 categories, 10 tiers and 20 cost ranges. Settings actions (Set Rule on a tier's page, Change All) have no speed target.
- **TP-S10-N1** (SV-11699): If the part has no cost (empty, $0.00 or below), no rule prices it: the sell price is $0.00 and no + $ amount is added. This is today's behavior for a part added with no cost, and it now also applies when the cost of a part already on a line is edited to $0.00, which today keeps the old sell price. The line is logged under the work order's tier (Default included) at $0.00, so Priced by and the details name that tier. It is priced by its rule once its cost is entered (S11-R1). A part with no cost on a canned line is the exception (S11-E8).
- **TP-S10-N2** (SV-11699): If the user lacks 'See Financial Data', the price, margin, Manual icon, Priced by column and details are hidden, as prices are today.
- **TP-S10-E2** (SV-11699): If a rule gives a price below cost (for example a deep % Off on a cheap part), the price stands. The margin shows negative, as a manual price below cost does today. No approval step is added; the matrix warns about it beforehand (S15-R5).
- **TP-S10-E3** (SV-11699): If two admins change a matrix while a part is being priced, the part uses the configuration saved at the moment it is priced.
- **TP-S10-E4** (SV-11699): Fee and diagnostic lines that are labor (time at a labor rate, such as a service call, travel or a diagnosis) are not priced by tiers.
- **TP-S10-E7** (SV-11699): A fee entered as a part (shop supplies, a fuel surcharge, a card fee) is a part like any other. A fixed sell price keeps it fixed (S10-R1). Otherwise, the customer's tier prices it by its category. No outreach is planned to clients with fee parts that have no fixed sell price; a client who sets up tiers owns the change to those fees' sell prices. About 1,500 fee part lines a quarter, across 69 clients, have no fixed sell price.
- **TP-S10-E5** (SV-11699): An internal customer is priced like any other customer. A tier whose columns are cost + 0% markup or cost + $0 sells parts at cost, and the line shows that tier as its source. There is no separate internal price path in the pricing order ([SV-9414](https://shopview.atlassian.net/browse/SV-9414)). Parts priced at cost this way move as normal. How a customer or work order is marked internal belongs to the Internal Work Orders PRD.
- **TP-S10-E6** (SV-11699): On a fixed-total line, a part's sell price can't be typed, as today. Changing a part's cost never changes the fixed total. Tiers never change a fixed total or its parts amount.
- **TP-S10-E8** (SV-11699): Same as previous tier skips archived tiers. Tier numbers never repeat, so a chain always ends at Default.

#### Story 11: When a part is priced again — [SV-11700](https://shopview.atlassian.net/browse/SV-11700)

- **TP-S11-R1** (SV-11700): A part is priced when it is added with a cost, or when its cost is first entered.
- **TP-S11-R2** (SV-11700): Changing the cost of a priced part recalculates its sell price and margin with the rule that applies at that moment, as today, and records what priced it again. Only a Fixed price is kept. A cost changed from a vendor invoice or an order item doesn't reprice the line (S11-R10).
- **TP-S11-R16** (SV-11700): Entering or changing the cost replaces a typed sell price with the calculated one, as today. This includes a Manual price, and a sell price typed while the part had no cost ([SV-10594](https://shopview.atlassian.net/browse/SV-10594), out of scope).
- **TP-S11-R12** (SV-11700): The cost can be re-entered only on:
    - a special-order or catalog part not yet received;
    - a Part Sale part, until the Part Sale is invoiced.

  It can't be re-entered on inventory parts, found parts, received work order parts or invoiced work orders, as today. Engineering confirms this for received parts. Re-entering the cost reprices the line even when the amount is the same.
- **TP-S11-R3** (SV-11700): Changing the part's category recalculates it the same way, using the new category's matrix. This includes a received part, whose category can still be changed; today only a part not yet received reprices on a category change.
- **TP-S11-R4** (SV-11700): Changing the quantity keeps the unit sell price.
- **TP-S11-R5** (SV-11700): Typing a sell price or margin that differs from the calculated one makes the line Manual. Typing the same price does not. A Manual price stays when the quantity changes, but not when the cost or category changes (S11-R2, S11-R3). Clearing the sell price restores the fixed or calculated price.
- **TP-S11-R6** (SV-11700): Parts already on a work order or Part Sale keep their prices. These never reprice them:
    - changes to tiers, matrices, rules or categories' matrices, Set Rule on a tier's page, Change All, the Part Sale switch and deleting a matrix;
    - moving the customer to another tier;
    - changing the customer on the work order or Part Sale.

  A line whose cost can't be re-entered keeps its price unless its category changes (S11-R3) or it is received at a new cost (S11-R9), which uses the tier the line recorded, never the customer's current tier. A user reprices one line on purpose by removing and re-adding the part (which prices it by the work order's tier, S10-R14), by re-entering its cost where it can be edited (S11-R12), or by typing a price (Manual, S11-R5). Splitting lines onto a new work order or Part Sale prices them by the customer's current tier (S11-E6); nothing else reprices a whole work order in this release.
- **TP-S11-R7** (SV-11700): Every way a part line is created is priced by the order in S10-R1, once it has a cost:
    - adding a part on a work order or Part Sale (the inline row, catalog search, Quick Add);
    - the part request modal;
    - a technician adding a part (Tech View, the phone part request);
    - canned lines, including canned lines added by Maintenance Reminders ([SV-10561](https://shopview.atlassian.net/browse/SV-10561)). Every part on a canned line, inventory, catalog or special-order, is priced when the canned line is added, by the work order's tier (S10-R14), like any part, with two exceptions: when that tier is Default, a special-order or catalog part comes in at the sell price saved on the canned line, as today,, and records Default, so Priced by and Sales by Tier show Default and its details name the canned line (S12-R12); and a part with no cost (S11-E8). The canned line's labor isn't repriced;
    - inspections;
    - ShopCoach.

  Changing the customer keeps the work order's tier (Story 14). Engineering confirms each path in the tech plan. A path that prices differently is listed here as an exception, never left out silently. Imported invoices and the Open API create no part lines, so nothing here prices them and they have no price details.
- **TP-S11-R14** (SV-11700): Approving an estimate creates no part lines and reprices nothing. An estimate is the work order itself, so its parts keep the prices they were given when added (S11-R6).
- **TP-S11-R8** (SV-11700): Replacing the part on a line prices it fresh from the new part, as today.
- **TP-S11-R9** (SV-11700): Receiving a part at a cost is handled by what priced it:
    - a part received with its first cost is priced then (S11-R1);
    - a price from Default, a line priced before tiers, or a canned line's saved price on a Default work order, received at a different cost, keeps its margin, as today (SV-9965);
    - a price from any other tier received at a different cost is priced again from the matrix at that tier's current rules, archived or not, as a cost edit does (S11-R2), which corrects parts ordered at a placeholder cost such as $0.01. It uses the customer and tier recorded on the line, never the customer's current tier, and the line keeps them; its details show the rule and cost used at receipt;
    - a Manual price received at a different cost keeps its margin, as today (SV-9965). Example: $2.00 → $3.00 on a $4.00 part becomes $6.00;
    - a Fixed price or a fixed line total doesn't change (S10-E6).

  Parts already received keep their prices, except when split onto a new work order or Part Sale (S11-E6) or when their category changes (S11-R3). Example: a work order opened before release, or before its customer moved to Tier 2, has parts priced by Default (or before tiers); received later at a new cost, they keep their margin and stay Default, not Tier 2. To get Tier 2 prices, the advisor splits the lines onto a new work order (S11-E6).
- **TP-S11-R15** (SV-11700): The receive window says nothing about tiers. Its 6-second notice reads "Updating the cost also updates the sell price.", replacing today's "Updating the cost also updates the sell price to keep the margin.", which isn't true for a tier-priced line.
- **TP-S11-R10** (SV-11700): A cost changed from a vendor invoice edited after receiving, or from an order item before receiving, updates the line's cost. The line keeps its sell price and pricing source, as today, so its margin changes. To reprice, the advisor types the price or removes and re-adds the part; the cost of a received part can't be re-entered (S11-R12). Invoiced and paid work orders aren't updated, as today.
- **TP-S11-N1** (SV-11700): No rule or tier reprices a part on an invoiced work order or Part Sale. Reopening it keeps its prices. A sell price typed on an invoiced work order works as it does today. Part Sales stay locked once invoiced, as today. A credit or return uses the original invoiced price.
- **TP-S11-N2** (SV-11700): If the part has a fixed sell price, cost and category changes don't change its price ([SV-7160](https://shopview.atlassian.net/browse/SV-7160), [SV-5744](https://shopview.atlassian.net/browse/SV-5744)).
- **TP-S11-E2** (SV-11700): Nothing sets a warranty part's price to $0 by itself, and marking a part as warranty doesn't change its price ([SV-10037](https://shopview.atlassian.net/browse/SV-10037)). The advisor types $0, so the line is Manual and shows the Manual icon (S12-R10). This is intended: it lets a reviewer ask whether the job was warranty work, since ShopView has no warranty work order type. The part keeps its recorded cost.
- **TP-S11-E8** (SV-11700): A catalog or special-order part with no cost on a canned line comes in at the sell price saved on the canned line, as today, and keeps it until its cost is entered or it is received; then the work order's tier prices it (S11-R1). Until then it records the work order's tier (Default included), as a part with no cost does (S10-N1), and its details say "Saved price from canned line \<canned line\>. Priced by \<tier\> when its cost comes in."
- **TP-S11-E7** (SV-11700): A found part can't take a cost (the cost field is off, as today), so no tier or Default prices it. Its sell price is typed, and it shows as Manual.
- **TP-S11-E5** (SV-11700): A negative sell price can still be typed on the Parts tab and in the part dialog, as today; it is a Manual price. Quick Add blocks it ("Sell price cannot be negative."), as today. Tiers never produce a negative price ([SV-6146](https://shopview.atlassian.net/browse/SV-6146)).
- **TP-S11-E6** (SV-11700): Splitting a work order moves the chosen lines, labor and parts together, to a new work order with a new number for the same customer and asset; a Part Sale is split by its parts the same way. The new work order or Part Sale takes the customer's current settings, including their current tier for that channel (S10-R14), and its parts are priced again by S10-R1 as if added there. Lines left behind keep their prices. The split screen and its steps are unchanged from today. A moved line with a Manual price, a fixed price, a fixed line total or a canned line's saved price keeps it, since those come before the tier (S10-R1). Every other moved part, received or not, is priced again by the new work order's or Part Sale's tier at the cost on its line (S11-R9).

#### Story 12: Seeing what priced a part — [SV-11701](https://shopview.atlassian.net/browse/SV-11701)

- **TP-S12-R1** (SV-11701): On work order and Part Sale lines, every sell price that has a pricing source (Default, tier, fixed price, fixed line total, Manual, and lines priced before the release) opens its price details: there is no icon to hover. The price can be reached by keyboard. These lines are the work order Parts and Lines tabs and the Part Sale parts table.
- **TP-S12-R10** (SV-11701): A gray Manual icon always shows beside a Manual price, and only there; its screen reader name is "Price typed by hand: see details". A customer change, a tier change, a fixed price and a fixed line total show no icon, and their details explain them (S12-R12, S12-R17).
- **TP-S12-R2** (SV-11701): Hovering the price on desktop, or tapping it on a tablet, opens the price details. With the cursor in the price box, Alt+Down opens them; typing still edits the price. They show:
    - the pricing source;
    - the tier name;
    - the matrix, its side (Work Order Matrix or Part Sale Matrix) and the rule (cost range and calculation);
    - the cost used;
    - the sell price;
    - when it was priced;
    - for % Off or $ Off, the Default price it was taken from;
    - where the part came from: "Inventory, bin \<bin\>" for an inventory part (today the part number's hover shows "Inventory" with no bin), or "\<vendor\> - \<vendor bill #\>" for a special-order part, as the part number's hover shows today. A part with neither, such as a quick-added part with no vendor, has no line for it.

  Focus returns to the price when they close.
- **TP-S12-R18** (SV-11701): When the tier was priced as Same as previous tier, the details say so and name the tier whose rule was used: "Fleet is the same as the previous tier, Wholesale, in Brakes."
- **TP-S12-R12** (SV-11701): In these cases, the price details say more:
    - a fixed line total: the line's fixed total and its parts amount, for example "Part of a fixed line total of $450.00 (parts $210.00)";
    - a line on a work order or Part Sale whose customer has since moved to another tier: "Priced by Fleet, Acme Freight's tier when this work order was made. Acme Freight is now on Wholesale.";
    - a canned line's saved price on a work order or Part Sale whose tier is Default (S11-R7): "Saved price from canned line \<canned line\>.";
    - a line priced before the release: "Priced before tiers", with what the line recorded (S12-R6).
- **TP-S12-R3** (SV-11701): The work order Parts tab and the Part Sale parts table get a Priced by column after Sell Price. It shows the pricing source in words, with the Manual icon for a Manual price; hovering or focusing it opens the price details too. The work order Lines tab opens the details from its part rows' prices but has no Priced by column.
- **TP-S12-R4** (SV-11701): When a part is priced, the line records what the details show (S12-R2, S12-R12, S12-R18), its pricing source (Fixed line total included) and the customer it was priced for. For Manual, it also records who typed the price.
- **TP-S12-R15** (SV-11701): The line records the tier itself, as well as the name it showed. So Sales by Tier groups a renamed tier under its current name.
- **TP-S12-R19** (SV-11701): A line priced through Same as previous tier records the work order's tier as its pricing source and the tier whose rule was used as a detail. Priced by, Sales by Tier and the delete check in S2-R8 use the work order's tier.
- **TP-S12-R17** (SV-11701): A line kept through Change Customer says so in its details, for example "Priced by Fleet for Acme Freight".
- **TP-S12-R5** (SV-11701): Renaming, editing, archiving or deleting a tier, matrix, rule or category later never changes what a line recorded. After a tier is renamed, the Priced by column shows its current name. The price details show the name it had when the part was priced, followed by the current name, for example "Fleet (now Fleet Plus)". Default always shows its current name (S4-R15).
- **TP-S12-R6** (SV-11701): Lines priced before the release never show the Manual icon; their details read "Priced before tiers". Reports show them as "Before tiers".
- **TP-S12-R7** (SV-11701): The Priced by column and the price details show no part status, such as "Received". The Parts and Lines tables keep today's status.
- **TP-S12-R8** (SV-11701): While a part is being added (Quick Add, the inline row), no pricing source shows. The price details and the Manual icon appear once the part is saved.
- **TP-S12-R9** (SV-11701): The Priced by column is read-only: nothing reprices a line from it.
- **TP-S12-N2** (SV-11701): A part with no cost opens price details for the customer's tier at $0.00 (S10-N1), on work orders and Part Sales, never the Manual icon. A found part's typed price shows as Manual (S11-E7).
- **TP-S12-N3** (SV-11701): Nothing about what priced a part shows on the customer's invoice, the estimate, the work order printout, a PDF or in the customer portal in this release.
- **TP-S12-E1** (SV-11701): On a tablet a tap on the price opens the details (S12-R2); a tap elsewhere closes them.

#### Story 13: Part Sales — [SV-11702](https://shopview.atlassian.net/browse/SV-11702)

- **TP-S13-R1** (SV-11702): Parts on a Part Sale are priced by the customer's Part Sales tier when the Part Sale was made (S10-R14), from the Part Sale Matrix side of the matrix when that side is on and its Work Order Matrix side when it is off (S10-R18). A customer whose Part Sales tier was never changed is priced by Default (S9-R2). The Priced by column and price details work as on work orders (Story 12).
- **TP-S13-E1** (SV-11702): Change Customer on a Part Sale already ships ([SV-8105](https://shopview.atlassian.net/browse/SV-8105)). With this release, it works as on a work order: parts already on it keep their prices (S11-R6), and the same notice shows (Story 14).

#### Story 14: Changing the customer on a work order — [SV-11703](https://shopview.atlassian.net/browse/SV-11703)

- **TP-S14-R2** (SV-11703): Changing the customer never reprices parts already on the work order (S11-R6). After the change, a notice says how many lines were priced for the previous customer, for example "3 lines priced at Default for the previous customer". The count is the part lines whose pricing source is a tier or Default and whose recorded customer is the previous customer; Manual, Fixed price, Fixed line total and Before tiers lines don't count. When those lines were priced by more than one tier, the notice gives the count without a tier name: "5 lines priced for the previous customer". Today nothing is shown. Users without 'See Financial Data' don't see this notice (S16-R5). Those lines show no Manual icon (S12-R10); their price details name the customer they were priced for (S12-R17), so the advisor can fix them before the work order is invoiced.
- **TP-S14-R3** (SV-11703): Changing the customer changes who is invoiced, not the work order's tier. New parts added after the change are priced by the work order's tier, as they would have been before the change (S10-R14). To price parts by the new customer's tier, the advisor splits the lines onto a new work order (S11-E6).
- **TP-S14-R4** (SV-11703): The Change Customer dialog keeps today's grey caption, which reads differently on a Part Sale, and adds "Parts already on the work order keep their prices, and new parts keep this work order's pricing." On a Part Sale it adds "Parts already on the Part Sale keep their prices, and new parts keep this Part Sale's pricing."
- **TP-S14-R5** (SV-11703): When the new customer's tier differs from the work order's tier, an amber note in the dialog names both, for example "This work order keeps Default pricing. Fleet Plus applies to new work orders, or split this one to use it." On a Part Sale: "This Part Sale keeps Default pricing. Fleet Plus applies to new Part Sales, or split this one to use it." Red is not used.
- **TP-S14-N1** (SV-11703): Changing the customer is blocked while deposits exist, as today.
- **TP-S14-E1** (SV-11703): Changing to a customer on the same tier shows no amber note in the dialog; the lines still record the customer they were priced for.

#### Story 15: The below-cost warning in the matrix — [SV-11708](https://shopview.atlassian.net/browse/SV-11708)

- **TP-S15-R5** (SV-11708): A value, in Default's column or a tier's, whose rule would sell a part for less than its cost at any cost in its range shows the standard warning icon (an exclamation mark) to the right of the value, in view and in edit. For the last, open range, costs up to ten times its start or $10,000, whichever is higher, are checked. The icon's tooltip reads "\<tier\> sells a \<$cost\> part below cost.", where \<$cost\> is the lowest cost in the range at which the rule sells below cost. Example: in a $0.00 to $100.00 range where Default is Cost + $10 and Fleet is 20% off, a $40.03 part sells for $40.02 (20% off $50.03), so the tooltip reads "Fleet sells a $40.03 part below cost." The warning is always on, in every matrix and on both sides; there is no setting to turn it off.
- **TP-S15-R2** (SV-11708): The warning never blocks saving and never changes a price.
- **TP-S15-R3** (SV-11708): The warning updates as the grid is edited, so the client sees it disappear when they fix the rule.
- **TP-S15-N3** (SV-11708): A cell that says "Uses previous tier" shows no below-cost warning of its own; the column it uses carries it.
- **TP-S15-N4** (SV-11708): A price exactly at cost (0% markup, + $0.00) doesn't warn, so a 0% rule used on purpose for internal or at-cost tiers never warns; a deeper discount below it does.
- **TP-S15-N5** (SV-11708): A range that sells a part that costs more for less than a part in the range before it shows no warning.

#### Story 16: Who can do what — [SV-11705](https://shopview.atlassian.net/browse/SV-11705)

- **TP-S16-R6** (SV-11705): The permissions in section 4 (Permissions) govern every new screen, and no new permission appears in settings. Any internal check engineering adds requires both 'Settings — Parts' and 'See Financial Data' wherever S16-R5 does.
- **TP-S16-R2** (SV-11705): Controls a user may not use are hidden, not greyed, as today; for example, without 'Customers — Create & Edit' the customer page has no edit pencil. A user who can see a page but not change it sees it read-only, with no Edit, Save or New buttons.
- **TP-S16-R4** (SV-11705): Seeing a customer's tiers needs only the customer permissions, never 'Settings — Parts':
    - 'Customers — Create & Edit' lets a user view and change the customer's tiers in Edit Customer and New Customer, even without 'Settings — Parts' (Settings › Pricing is then hidden, S16-N1);
    - 'Customers — View' with 'View and Manage AP/AR Data' shows the customer's tiers read-only, in the customer card's pricing section.
- **TP-S16-R8** (SV-11705): The Categories page's pricing columns, its matrix grid and every edit to a matrix need 'Settings — Parts' and 'See Financial Data'. Without 'Settings — Parts', there is no Categories page, as today.
- **TP-S16-R5** (SV-11705): Viewing and editing tiers, matrices, the Price Part Simulator and category pricing needs both 'Settings — Parts' and 'See Financial Data'; so does the Audit Log (S19-R21). Every permission rule in this PRD is enforced, not only hidden: an action a user isn't allowed to take is refused however it is attempted. Without 'See Financial Data', price details and the pricing source are withheld the same way line prices are today.
- **TP-S16-R11** (SV-11705): A user with 'Settings — Parts' but not 'See Financial Data' sees no tiers, matrices or simulator: Settings › Pricing shows only the Fixed Rules tab. (Today Settings › Pricing needs only 'Settings — Parts'.) The Categories page shows only the Category column. New Category and a category's page show no Pricing Matrix field and no grid, and a new category uses the General Matrix.
- **TP-S16-R7** (SV-11705): Sales by Tier and Sales by Category are the one exception to withholding (S16-R5). Like every report, they show to users with 'Reports — Page Access', and show their costs and margins to all of them, as Sales by Customer does today.
- **TP-S16-N1** (SV-11705): Without 'Settings — Parts', the Parts group in Settings is hidden. A link to Pricing shows "Access restricted" with "Looks like you don't have access to this page. Reach out to your administrator to request access." and Go to home.
- **TP-S16-N4** (SV-11705): A technician without 'See Financial Data' can still add parts. They are priced by the customer's tier without the technician seeing the price. Likewise, a user without 'See Financial Data' can split a work order or Part Sale or change a part's category: the moved or recategorized parts are priced again by the rules (S11-E6, S11-R3), since no typed price is involved.
- **TP-S16-N5** (SV-11705): Changing a customer's tiers from Settings (Manage Customers) needs 'Settings — Parts', 'See Financial Data' and 'Customers — Create & Edit'. With 'Settings — Parts' but not 'Customers — Create & Edit', the user manages tiers and matrices, but a tier's Customers tab is read-only, and Manage Customers is hidden.
- **TP-S16-E1** (SV-11705): A user with 'Settings — Parts' but not 'Customers — View' doesn't see a tier's Customers tab. When they archive or delete a tier with customers, the dialog gives the count instead of the names: "12 customers are on Fleet. Someone who can manage customers moves them first."

#### Story 17: Reports and totals stay consistent — [SV-11706](https://shopview.atlassian.net/browse/SV-11706)

- **TP-S17-R1** (SV-11706): Work order and Part Sale Stats, invoice totals and taxes calculate from the saved line prices, as today.
- **TP-S17-R2** (SV-11706): Sales by Tier and Sales by Category, new reports with their own PRD, show parts sales and profit by what priced each line and by category. They sit under Reports › Parts and ship in the same release as this PRD. They read only what each line recorded (S12-R4, S12-R6). Their rows, columns, filters, permission and exports are in the Sales by Tier and Sales by Category PRD.
- **TP-S17-R5** (SV-11706): Sales by Tier and Sales by Category show Invoiced, Credits and Net. Credits are customer credit memos only (Part Sale returns and credits made on the customer page), before tax, after any restocking fee, dated by the credit, and counted in the credited line's tier or category at the original invoiced price (S11-N1).
- **TP-S17-R3** (SV-11706): Sales and Sales by Customer are unchanged.
- **TP-S17-N1** (SV-11706): None. Totals only read saved prices, so there is nothing to refuse.
- **TP-S17-E1** (SV-11706): A customer Fees & Discounts entry (for example a 5% military discount) applies at the end of the work order, after tier pricing, as today. The price details explain the line's unit sell price before that discount.

#### Story 18: Accounting and QuickBooks receive the right figures — [SV-11707](https://shopview.atlassian.net/browse/SV-11707)

- **TP-S18-R1** (SV-11707): Each part line is sent with its sell price exactly as on the invoice, whatever priced it. The figures sent are unchanged in shape: no new fields, and neither the pricing source nor the price details are sent. An invoice re-synced after a tier or matrix changed sends the prices on its lines, which never change (S11-R6).
- **TP-S18-R3** (SV-11707): QuickBooks and AccountingHub book part revenue by the category on the work order or Part Sale line, as today. Credits and refunds use the inventory part's current category, as today.
- **TP-S18-R5** (SV-11707): An invoice already synced is not sent again because a deleted category's lines moved to Uncategorized (S8-R8). If it is re-synced later, its part revenue books to Uncategorized's QuickBooks item.
- **TP-S18-R6** (SV-11707): Deleting a category is sent to AccountingHub the way category changes are today. An invoice already sent to AccountingHub is not sent again because a deleted category's lines moved to Uncategorized (S8-R8).
- **TP-S18-R4** (SV-11707): The Open API is unchanged in this release. Part lines keep returning their sell price exactly as on the invoice, whatever priced it. Tiers, matrices and a line's pricing source are not exposed through the API and can't be set through it.
- **TP-S18-N1** (SV-11707): If no integration is connected, nothing is sent, as today.
- **TP-S18-N2** (SV-11707): Internal and no-charge work orders are sent as the Internal Work Orders PRD specifies; tiers add nothing to what is sent.

#### Story 19: Shared behavior for every new page, dialog and list — [SV-11709](https://shopview.atlassian.net/browse/SV-11709)

- **TP-S19-R1** (SV-11709): Saving, dialogs, field messages and session expiry work as they do across ShopView today: while saving, the primary button shows a spinner and Save, Cancel and the X are disabled, so a double click can't save twice; dialogs close only with Cancel or the X; required and number fields use today's messages ("{Field} is a required field", "{Field} cannot be higher than {max}", "{Field} must be a valid number"); an expired session logs the user out with "Session expired, please log in again." and unsaved work is lost.
- **TP-S19-R13** (SV-11709): Tiers, matrices and categories are created and edited on their own pages, never in dialogs; no matrix is edited in a dialog anywhere. Dialogs are used only to confirm, to pick customers (Manage Customers), to show the Audit Log and where today's screens already use one.
- **TP-S19-R14** (SV-11709): Every create flow (New Tier, New Matrix, New Category) can be cancelled before it is saved, and cancelling creates nothing.
- **TP-S19-R15** (SV-11709): The new pages show no explanatory text or help banners. Explanations (cost ranges, how a price is found, the Part Sale switch) sit in short info-icon tooltips beside the item they explain, one or two plain sentences that never repeat the label. Tier names have no tooltip.
- **TP-S19-R3** (SV-11709): Leaving a matrix page, the New Category page or a grid in edit with unsaved changes asks "Discard these changes?" (Keep Editing / Discard Changes). With no changes, it leaves straight away.
- **TP-S19-R5** (SV-11709): The Manual icon and the grid's warning icons have a text name for screen readers. The Priced by column and price details always name the source in words, never by color alone.
- **TP-S19-R6** (SV-11709): Every new control is reachable by keyboard, including every grid cell in edit. Enter in the New Tier name field saves the tier.
- **TP-S19-R7** (SV-11709): Every new page, list, tab and grid shows a loading skeleton while it loads; today, core lists show only a loading bar. The price details show the popover spinner.
- **TP-S19-R10** (SV-11709): A failed load shows "Ooooops! An error occurred" with Try again, and keeps the search, filters, sort and page. Today, the core app shows this message only as a toast.
- **TP-S19-R8** (SV-11709): Every change to a matrix, a tier or a category is recorded, with what changed (each value before and after), who made it, when, and for which client:
    - A matrix: created, renamed, deleted, its rules (Default's and each tier's, on either side), its categories, and the Part Sale switch.
    - A tier: created, renamed, archived, reactivated, deleted, a rule set for the entire tier or undone, and customers added to it or moved off it.
    - A category: created, renamed, deleted, its matrix, Tax Exempt, and its QuickBooks mapping. A deleted category is recorded with its name, matrix, QuickBooks mapping and the number of parts and lines moved to Uncategorized.

  Clients see these in the Audit Log (S19-R19, S19-R21), with no new permission.
- **TP-S19-R12** (SV-11709): A client's Audit Log keeps every matrix, tier and category change for all time, as a work order's audit log does, so a client can see what changed at any point. ShopView's own internal copy of these records follows the existing audit log cleanup (90 days today). Engineering confirms in the tech plan what ShopView's existing change log already captures for these records.
- **TP-S19-R19** (SV-11709): Audit Log is in the three-dot menu of each matrix's page and the Matrices list, each tier's page, its row on the Tiers list and the Tiers list, and each category's page and the Categories list. It opens ShopView's existing history dialog as it is today, titled "Audit Log: \<matrix\>", "Audit Log: \<tier\>" or "Audit Log: \<category\>" for one, and "Audit Log: Matrices", "Audit Log: Tiers" or "Audit Log: Categories" for a list (every matrix's, tier's or category's changes, deleted ones included, each detail starting with its name). It keeps today's search box and columns, without the Line column, newest first, with each change in the details as "\<label\>: \<old\> → \<new\>", and Close. It loads 50 entries at a time, with more loading as the user scrolls, as today. With nothing recorded it shows "No history here. Yet." It shows every change since release (S19-R12).
- **TP-S19-R20** (SV-11709): Audit Log events are named:
    - A matrix: "Matrix Created", "Matrix Renamed", "Matrix Changed", "Matrix Deleted", "Rule Changed", "Categories Changed", and "Tier Rule Set", "Tier Rule Undone" or "Tier Deleted" when a tier's Set Rule, its Undo or a tier's deletion changes the matrix.
    - A tier: "Tier Created", "Tier Renamed", "Tier Archived", "Tier Reactivated", "Tier Deleted", "Tier Rule Set", "Tier Rule Undone", "Customer Added", "Customer Changed", "Customer Removed".
    - A category: "Category Created", "Category Renamed", "Category Deleted", "Category Matrix Changed", "Tax Exempt Changed", "QuickBooks Mapping Changed".
- **TP-S19-R21** (SV-11709): Opening any Audit Log (a matrix's, a tier's or a category's, or the Matrices, Tiers or Categories list's) needs 'Settings — Parts' and 'See Financial Data', like the pages it is on. A tier's Audit Log and the Tiers list's show customer names in their customer events.
- **TP-S19-R22** (SV-11709): In every sortable list in this PRD, the first click on a number column sorts it highest first.
- **TP-S19-R23** (SV-11709): Each save makes one Audit Log entry on the log of what was saved, summing up everything that save changed, and nothing is logged for edits that weren't saved. For example, one matrix save that adds a range and sets its rules reads "1 range added; rules set for Default and 5 tiers". Set Rule makes one entry on the tier's log ("Rule set in 7 matrices") and one on each matrix it changed; Undo does the same. A bulk Manage Customers save makes one entry on the tier's log ("3 customers added, 1 removed"). A category delete makes one entry on the Categories list's log, with the number of parts and lines moved.
- **TP-S19-R18** (SV-11709): Every search in this PRD matches a case-insensitive substring of each field it names and ignores leading and trailing spaces; results keep the list's sort. In a customer's tier pickers (S9-R30), a typed whole number matches that tier number exactly and lists it first, then the tiers whose names contain the text.
- **TP-S19-R9** (SV-11709): Every column title, modal header, page title, tab and button uses Title Case. Articles, short prepositions and conjunctions are lower case unless they start the text, for example "Work Order Tier", "Part Sales Tier", "Manage Customers on Fleet Platinum". Sentences in messages and tooltips stay in sentence case.
- **TP-S19-E2** (SV-11709): If someone else saved first, the second save is refused and nothing is saved. Everything typed is kept. When the save became invalid (a matrix or tier name now taken, a category moved to another matrix, a tier archived), the page shows the reason inline, naming the conflict. When someone else saved the same matrix, it shows "\<matrix\> was changed by someone else. Reload to see their changes."

_279 requirement ids._

### Dependency notes and messages changed in page versions 33 and 35

Verbatim from page version 37.

- **Story 2 dependency:** Dependency: tiers take over the Settings › Pricing page. [SV-11258](https://shopview.atlassian.net/browse/SV-11258) (Settings Pricing and Categories Sorting) changes the same page. Sorting for the Matrices and Categories lists is built here (S6-R6, S7-R4). Fixed Rules sorting stays on SV-11258 and ships separately.
- **Story 6 dependency:** Dependency: this list replaces the pricing matrices sorting work in [SV-11258](https://shopview.atlassian.net/browse/SV-11258). Fixed Rules sorting stays on SV-11258.

| Trigger | Message | Behavior | Story |
|---|---|---|---|
| Grid can't be saved | Cells highlighted with a message naming the gap, overlap or bad value; "Enter a value"; "Enter an end above \<start\>"; "Use at most two decimals"; "Enter a margin from 0 to 99.99"; "Enter a % from 0 to 99.99"; "\<tier\>: enter $0.00 or more in every range." | Inline; Save blocked | S3-R6 |
| Matrix saved | "\<matrix\> saved" — "1 change: Tier 5 is 28% margin." "Parts already on work orders keep their prices." Up to three changes, then "and \<n\> more". | Success toast | S4-R12 |
| Switching matrix tabs with unsaved changes | "Discard these changes?" | Dialog: Keep Editing, Discard Changes | S3-R18 |
| Leaving with unsaved changes | "Discard these changes?" — Keep Editing / Discard Changes | Dialog | S19-R3 |
| Matrix saved by someone else first | "\<matrix\> was changed by someone else. Reload to see their changes." | Inline; nothing saved | S19-E2 |

### Non-functional requirements introduced by analysis

| Id | Requirement | Origin |
|---|---|---|
| NFR-001 | One org-keyed pricing resolver; no process-static matrix cache (the current `PricingRulesApplier` has no client key and is unsafe in workers/CLI that touch several clients) | Analysis (code) |
| NFR-002 | Every new read and write is tenant-scoped; every inbound id is resolved through a scoped repository or validator; collections fail whole on any foreign id; every new repository/query repository has a tenant-isolation test | Analysis (Golden Rule) |
| NFR-003 | Pricing source, Priced by and price details are **absent** (not zeroed) from every response for users without 'See Financial Data'; the Change Customer count and notice likewise (TP-S14-R2) | Analysis (masked-pricing echo bug class) |
| NFR-004 | Every new endpoint enforces 'Settings — Parts' via a new atom granted only by the `settingsParts` bundle, plus `ROLE_PRICING::VIEW` where the PRD needs 'See Financial Data'; the permission-less `calculate-sell-price` endpoint gets a gate | Analysis (code: `settingsParts` has no unique atom) |
| NFR-005 | Part pricing stays within TP-S10-R22 (≈0.3 s at 270 categories × 10 tiers × 20 ranges): at most three indexed queries per request per client, memoized; batch loads for canned lines, split and the part picker | PRD TP-S10-R22 + analysis |
| NFR-006 | One exact integer pricing formula shared by PHP, the browser engine (BigInt) and the Inventory Value SQL twin, pinned by one shared vectors file: one half-away-from-zero rounding step from the cost in cents; the vectors cover half-cent ties and costs entered with up to four decimals (TP-S10-R5, TP-S3-E3; D23) | Analysis + user decision |
| NFR-007 | Every invoice writes a frozen per-part-line snapshot (`invoice_part_line`) whose sums reconcile with `invoice.parts_sell` / `invoice.parts_cost` in the same transaction; a mismatch logs at ERROR and never blocks invoicing | Analysis + user decision (reports data source) |
| NFR-008 | Audit Log entries stay within `entity_event.payload` (TEXT, 64 KB): compact diffs, 60 KB budget, truncation marker; customer ids in `entity_event_ref` | Analysis (no table rebuild on 8.85M rows) |
| NFR-009 | Schema changes are rollback-safe: additive in this release, plus one relaxation (dropping the legacy FK `FK_6DCEA672AA000BE7`); the retired `pricing_rule` table and `pricing_matrix.categories` column are frozen now, no release-A code uses them except the one-shot post-deploy resync, and they are dropped in the next release (follow-up ticket) | `database.md` two-release rule |
| NFR-010 | Lists in Settings are paginated or infinite-scrolled (50 per page/batch) and sorted server-side; Select All in Manage Customers and Set Rule work server-side over the full result, never by loading it | PRD + analysis (307k customers fleet-wide) |
| NFR-011 | An untouched prefilled sell price is never recorded as Manual: add paths send `sellPriceTyped` / `marginTyped`, and the picker and `calculate-sell-price` price by the work order's tier | Analysis (code: the add row always sends the prefill) |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Intake: anything the PRD won't say? | intake | "this one as well should be included: Sales by Tier and Sales by Category" (separate plan, same release) |
| One PR or several? | user | One PR per PRD; fixes found along the way go inside them (D1) |
| SV-11258 overlap | user | Matrices and Categories sorting built here (TP-S6-R6, TP-S7-R4); Fixed Rules sorting stays on SV-11258 and ships separately (PQ4, page 33 dependency notes) |
| Report data source | user | Per-line invoice snapshot (D11) |
| Rounding | user | Exact math everywhere (D23); Product confirmed (PQ19) |
| DQ1 table sizes | prod query | `SELECT table_name, table_rows FROM information_schema.tables …` → work_order_part 1,208,916 · work_order_part_request 1,433,091 · invoice 307,647 · entity_event 8,852,536 · credit_memo 4,302 · credit_memo_line_item 1,223 · pricing_matrix 1,987 · pricing_rule 10,479 · part_category 11,558 · company 307,238 |
| DQ2 credits (12 months) | prod query | 1,073 credit lines, all naming their original part line; 833 credits with lines; 2,206 credits without lines |
| DQ3 release-day names | prod query | 0 case-insensitive duplicate-name groups; 1 matrix already named "General Matrix" (TP-S1-E13 fires once) |
| DQ4 old line discounts | prod query | 0 invoices (2 years) with part-line adjustments and no adjustments snapshot |
| DQ5 line-less credits | prod query | 2,206: 466 from a payment, 13 floor-carry, 302 issued against an invoice |
| DQ6 release-day anomalies | prod replica query, 2026-11-11; re-run right before release | (a) 3 matrices without rules at 3 clients, with 2 categories on them (PQ26); (b) 0 clients without a default matrix, 0 with several, 0 whose default matrix has no rules; (c) 0 range overlaps, 0 gaps; (d) 1,565 matrices whose first range starts above $0.00, handled by TP-S1-E12 (real start kept, a cost below it uses the first range's rule); (e), categories already named "Credits not tied to a part", is dropped from the re-run: page 37 reserves no category name. The re-run's counts go in the PR (Appendix A, M2 step 4) |
| PQ1 QuickBooks books by the line's category today (TP-S18-R3) | Confluence comment | Answered 2026-11-11 (page 33): no change. QuickBooks and AccountingHub book part revenue by the line's category, and credits and refunds by the inventory part's current category, as today; regression check only |
| PQ2 category change on a received part (TP-S11-R3/R6) | Confluence comment | Answered: a received part reprices on a category change too (new behavior); Phase 4 |
| PQ3 category names reserve "Credits not tied to a part" (TP-S8-N3) | Confluence comment | Answered: reserved in any letter case, with "Credits not tied to a part is used by the reports. Choose another name."; every create and rename path (D28). Superseded by page 37: no category name is reserved (D28 withdrawn) |
| PQ4 SV-11258 Fixed Rules sorting | Confluence comment | Answered: stays on SV-11258 and ships separately; Matrices and Categories sorting are built here (D2) |
| PQ5 tier name max length (TP-S2-R3) | Confluence comment | Answered: up to 50 characters; the field stops accepting characters at 50 |
| PQ6 customer card Tax row (TP-S9-R12) | Confluence comment | Answered, changed from our proposal: the name of the tax picked on the customer, exactly as named in Settings, or "Default Tax Settings" when none is picked, as on Edit Customer |
| PQ7 renamed tier name on lines (TP-S12-R5 vs TP-S4-R15) | Confluence comment | Answered: Priced by shows the current name; price details show the name when priced, then the current one ("Fleet (now Fleet Plus)"); Default always shows its current name |
| PQ8 Change Customer notice without See Financial Data | Confluence comment | Answered: users without 'See Financial Data' don't see the notice (TP-S14-R2) |
| PQ9 leftover cent on fixed line totals (TP-S10-R13) | Confluence comment | Answered: today's rule; the leftover cent goes on a part with a quantity of 1, or on the line's labor when there is none (D10) |
| PQ10 concurrent matrix save (TP-S19-E2) | Confluence comment | Answered: the second save is refused with "\<matrix\> was changed by someone else. Reload to see their changes."; everything typed is kept |
| PQ11 Matrices list Categories sort (TP-S6-R6) | Confluence comment | Answered: by the number of categories, most first on the first click |
| PQ12 TP-S12-R7 status in tables | Confluence comment | Answered: the Parts and Lines tables keep today's status; only the Priced by column and the price details show none. There is no "Installed" status |
| PQ13 unworded grid messages (TP-S3-R6) | Confluence comment | Answered: "Enter a value", "Enter an end above \<start\>", "Use at most two decimals", "Enter a margin from 0 to 99.99" |
| PQ14 save toast with several changes (TP-S4-R12) | Confluence comment | Answered: names up to three changes, then "and \<n\> more" |
| PQ15 edit scope across the two tabs | Confluence comment | Answered: each tab has its own Edit, Save and Cancel; switching tabs with unsaved changes asks "Discard these changes?" with Keep Editing and Discard (TP-S3-R18); the buttons became Keep Editing and Discard Changes in page 35 (PQ24) |
| PQ16 hover text for rule cells (TP-S7-R2) | Confluence comment | Answered: each cost range on its own line ("$0.00 to $25.00: 35% markup"); a "Uses previous tier" cell's hover text was reworded in page 35 (PQ23) |
| PQ17 simulator in the archived view | Confluence comment | Answered, changed from our proposal: the Price Part Simulator shows under the archived grid for the columns shown (Default and the archived tiers); archived tiers still never price parts (D30) |
| PQ18 free-typed part number priced by its catalog category | Confluence comment | Answered: accepted; a typed number that matches a catalog part is priced by that part's own category (TP-S10-R17, D32) |
| PQ19 exact rounding at half-cent ties | Confluence comment | Answered: exact half-away-from-zero rounding everywhere (TP-S10-R5, TP-S1-R3). Product's note: QuickBooks Online works in four decimals and inventory can be received at a four-decimal cost, so final sell prices must always round the same way (D23) |
| Reports PRD page 18, S1-R3 / S1-R9 (core, environmental and single-part fees) | reports PRD | A part's core and environmental charges, and any fee or discount attached to that single part, are in the same row and category as the part: the snapshot's `core`, `core_credit` and `environmental_charge` rows copy the parent part's category and pricing fields, and part-line adjustments go on the part's row (Section 6 Phase 3) |
| PQ20 S1-R3 and the paragraph after S11-R9 don't name a category change on a received part (TP-S11-R3) | Confluence comment 1013448759 (round 2) | Answered 2026-11-11 (reply 1013514262, page 35): accepted; S1-R3 and the S11-R9 paragraph now name a category change, as the plan builds (Section 6 Phase 4) |
| PQ21 the Open API refuses "Credits not tied to a part" (TP-S8-N3 vs TP-S18-R4) | Confluence comment 1013448759 (round 2) | Answered (reply 1013514262, page 35): accepted; TP-S18-R4 now says the Open API refuses the reserved name on create or rename (D28). Superseded by page 37: TP-S18-R4 is back to "The Open API is unchanged in this release." (D28 withdrawn) |
| PQ22 what an archived Same-as-previous tier follows in the archived simulator (TP-S4-R19) | Confluence comment 1013448759 (round 2) | Answered, changed from our proposal (reply 1013514262, page 35): in the archived view a Same as previous tier column follows the column directly to its left, Default for the first archived tier; the simulator prices the same way (TP-S4-R19, D30) |
| PQ23 what the "Uses previous tier" hover names (TP-S4-R3, TP-S7-R2) | Confluence comment 1013448759 (round 2) | Answered, changed from our proposal (reply 1013514262, page 35): "Uses previous tier, 2 · Wholesale."; when that tier also uses its previous tier, "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule." (TP-S4-R3, TP-S7-R2, D29) |
| PQ24 button labels of the two "Discard these changes?" dialogs (TP-S19-R3 vs TP-S3-R18) | Confluence comment 1013448759 (round 2) | Answered (reply 1013514262, page 35): accepted; both dialogs read Keep Editing / Discard Changes (TP-S19-R3, TP-S3-R18) |
| PQ25 a cost edited to $0.00 or emptied (TP-S10-N1 vs today's SV-10035 keep-the-price fallback) | posted, comment 1013481507 (round 2, continued, item 25) | Answered (reply 1014267917, page 35): accepted; TP-S10-N1 now says a cost edited to $0.00 sets the sell price to $0.00, recorded under the work order's tier (Section 6 Phase 4) |
| PQ26 rule-less matrices on release day (TP-S1-R9/R10; Appendix A ambiguity A11) | posted, comment 1014038540 | Answered (reply 1014267917, page 35): accepted; TP-S1-R9 now says a rule-less matrix gets a copy of the General Matrix's rules on release day. Product checked: the only active client with an empty matrix has no category on it; the two affected categories belong to a dormant client and the internal training account (Section 4). TP-S1-R10's list of release-day exceptions doesn't mention this copy; TP-S1-R9 governs (a PRD-internal gap) |
| PQ27 archived-view column order (TP-S4-R19, D30) | posted, comment 1016659969 | Answered, changed from our proposal (reply 1017118734, page 36): archived tiers appear in the order they were archived, earliest first, not the order they had while active (D30) |
| FYI: TP-S11-R7 path list; reopened paid work order takes the current tier | Confluence comment | informational |
| PRD Review verdict v31 (READY) "For engineering" list | prd-review | All resolved by codebase research: see D4 (cache), D5 (link stored twice), D7 (audit location), D8 (permissions), Appendix A §2 (path-by-path), D14 (legacy rules) |

## 2. Architecture Overview

```
                    Settings › Pricing / Categories / Customers (FE pages, TanStack Query)
                                   │  /api/pricing/*  /api/customers/*/pricing-*
                                   ▼
 ┌──────────────── Sales/Pricing (new module) ─────────────────┐     Customer/Customers
 │ PricingTier ─┐   PricingMatrix ── MatrixRange ── TierRule    │     company.work_order_pricing_tier_id
 │              └──────────── (cells per tier per range) ───────┤     company.part_sales_pricing_tier_id
 │ TieredPriceCalculator (pure, exact integer math)             │
 │ PartPriceResolver  (org-keyed memo, ResetInterface) ◄────────┼──── PartsCatalogue: part_category.pricing_matrix_id
 │   cascade: typed → fixed price → work order's tier           │     (single link; pricing_matrix.categories frozen)
 └───────────────▲──────────────────────────────▲──────────────┘
                 │ PartPriceResolverInterface    │ defaultSellPrices()
 VehicleService/WorkOrders                        Inventory / catalog read sites (Default price, as today)
   work_order.pricing_tier_id (kept tier)
   PartRequestPricer → work_order_part_request.{pricing_source, pricing_tier_id,
                        priced_for_company_id, pricing_details JSON} → copied to work_order_part
   every add path, receive policy, split repricer, Change Customer count, price details
                 │
                 ▼  invoice created / recomputed
 Invoicing: InvoiceFinancialSnapshotService → invoice_part_line (one row per billed part row,
            reconciled with invoice.parts_sell / parts_cost)  ──►  Sales by Tier / Category (reports PR)
 EntityEvent: pricing_matrix / pricing_tier / part_category entries → Audit Log dialogs
```

Pricing runs on the **part request** (the line users edit); the work-order part minted at receipt copies the price and the pricing record. A work order or Part Sale stores the tier it keeps (NULL = Default), so a customer moving tier never changes an open order. Inventory and catalog screens keep showing the fixed or Default price.

## 3. Technical Decisions

`chosenBy` user = decided by the engineer running the wizard; agent = decided in the wizard, listed for override at plan review; coordinator = set by the orchestrating session's audit pass, also open to override at plan review.

| Id | Decision | Chosen by | Rationale / rejected alternatives |
|---|---|---|---|
| D1 | One PR for this PRD (and one for the reports PRD); fixes found along the way go inside; 18 phases, one commit each | user | Reviewability comes from one commit per phase. Rejected: 8 workstream PRs behind a temporary flag |
| D2 | SV-11258: Matrices + Categories sorting built here (TP-S6-R6, TP-S7-R4); Fixed Rules sorting stays on SV-11258 and ships separately | user; Product confirmed (PQ4) | The PRD defines those sorts; page 33's dependency notes keep Fixed Rules on SV-11258 |
| D3 | No feature flag. The reports branch is cut from this branch and rebased onto `develop` after this one squash-merges; both merge in the same window, after the last bugfix release before the feature (`.0`) cut, so they ship together with the What's New note | agent | Follows D1 and TP-S1-R7; `develop` ships bugfix releases, so merge timing is the gate |
| D4 | Replace the static `PricingRulesApplier` (referenced from 16 files in `api/src` besides its own, with 40 static calls in 13 of them; no client key) with one org-keyed, tier-aware `PartPriceResolver`; the Inventory Value SQL twin stays in parity | agent | TP-S10-R1 one resolver; cross-tenant hazard in workers/CLI |
| D5 | `part_category.pricing_matrix_id` is the single category→matrix link; `pricing_matrix.categories` frozen, read in release A only by the one-shot resync (D14), dropped in release B | agent | Two copies with different readers today; `LIKE` scans |
| D6 | Default is a real tier row per client; customer tier FKs and the work order's kept tier are nullable, NULL = Default; tier number derived from stable `position` | agent | No backfill of 307k customers or open orders |
| D7 | Audit Log on `entity_event` with three new entity types; workplace = the acting user's location; org-scoped reads | agent | The app's own never-purged history; the legacy `audit_log` (separate DB, 90-day purge) is untouched |
| D8 | New atom `ROLE_PARTS_SETTINGS::MANAGE` granted only by `settingsParts`; endpoints require it plus `ROLE_PRICING::VIEW` where the PRD needs 'See Financial Data'; gate `calculate-sell-price` | agent | TP-S16-R5 enforcement; `settingsParts` has no unique atom |
| D9 | Pricing record on `work_order_part_request`, copied to `work_order_part` | agent | Pricing runs on the request |
| D10 | One fixed-line-total routine for display, invoice and the snapshot; $0-cost parts split by quantity; the leftover cent follows today's `FixedLineTotal::calculatePrices()`: the first quantity-1 part, else the line's labor; the recorded shares sum to the line's parts amount (fixed total less labor). Detail in Section 6 Phase 3 | agent; Product confirmed (PQ9) | Screen, invoice, reports and credits read the same split |
| D11 | Reports read a frozen per-part-line invoice snapshot (`invoice_part_line`) | user | Same numbers as a live query; ties out by construction; live join is Parts-Velocity-slow |
| D12 | This PR writes the snapshot; the reports PR reads it and owns the historical backfill | agent | This PR owns every write path |
| D13 | Reports export caps and negative format follow the reports PRD as written | agent | Reports plan |
| D14 | Legacy `pricing_rule` frozen after the release-day migration: no release-A code reads or writes it except the post-deploy `ResyncLegacyMatricesCommand`, which catches edits made by old tasks during the deploy window, is run once in release A's deploy window, and is a no-op when the table is gone. M1 drops the legacy FK `FK_6DCEA672AA000BE7` (a relaxation, safe for the previous release, which still writes `pricing_rule`), so a matrix delete never touches the table; the duplicate-part cleanup stops reading and re-pointing it. Release B drops `pricing_rule`, `pricing_matrix.categories` and the resync command together (Section 8) | agent | A rollback prices by release-day rules (stale, no errors) |
| D15 | Record storage: indexed columns `pricing_source`, `pricing_tier_id`, `priced_for_company_id` + JSON `pricing_details` | agent | Counts and snapshot copy need columns; details are display-only |
| D16 | No widening of `entity_event.payload` (TEXT→MEDIUMTEXT is a COPY rebuild on 8.85M rows); compact diffs, 60 KB budget | agent | Realistic max ≈ 15 KB |
| D17 | RESTRICT foreign keys to `pricing_tier` from `company`, `work_order`, `work_order_part{,_request}`, added online (SV-6468 precedent), registered in `MANUALLY_MANAGED_FOREIGN_KEYS`; a tier delete first clears the kept tier on work orders that aren't open (D33) | agent | Back up TP-S2-R7/R8 |
| D18 | New module `Sales/Pricing` (canonical layout); `Sales/PricingRules` deleted; Set Rule / Undo are set-based writes | agent | Layout rules; up to ~270 matrices × 2 sides |
| D19 | Add and edit paths send `sellPriceTyped` / `marginTyped` / `costTyped` (absent = typed, so older FE builds behave as today); the pricer reprices on cost when `costTyped` is true, or when the sent cost differs from the stored one (TP-S11-R2); a sent cost equal to the stored one with `costTyped: false` changes nothing (TP-S11-R4/R5/R12; Section 6 Phase 4); picker and `calculate-sell-price` take `workOrderId` (and `partRequestId` for receive previews) | agent | NFR-011 |
| D20 | Masking = absent, not zeroed (the `ReceiveModalOutputDto` convention); the Change Customer notice is withheld the same way | agent; Product confirmed for the notice (PQ8) | NFR-003 |
| D21 | UI points settled from the PRD and the design notes: auto-fill follows the nearest typed range above (design 4.8); an existing matrix's Categories line saves when the picker closes, a new matrix's with Create Matrix (TP-S3-R12/R13); Manual icon beside the price and in Priced by (TP-S12-R10/R3); Priced by reads "Before tiers" for pre-release lines (details "Priced before tiers"); "Existing work orders and Part Sales keep their prices and tier." in Edit Customer and Manage Customers (TP-S9-R7); "Remove n Customers?" confirm per design 9.17–9.18; an archived tier's Customers tab has Reactivate Tier, applied at once with no confirmation (design 9.21–9.23, TP-S2-R6/R26); the Undo toast is hosted app-wide so it keeps its 20 s across navigation (TP-S2-R27); the column label is "Priced by", as the PRD writes it (TP-S19-R9 keeps short prepositions lower case); notice placement, shop-supplies format, channel-split hover and the zero-cost message follow the named design screens | agent | PRD + approved design settle these |
| D22 | Shared pricing vectors live in `app/src/components/ts/pricing/engine/vectors/tier-pricing-vectors.json`; the backend test reads the same file; no `.github` change (a vectors-only edit doesn't trigger backend CI — accepted) | agent | Avoids a separate CI PR (D1) |
| D23 | Exact integer math in PHP, the browser engine (BigInt) and SQL; simulator and below-cost warning computed in the browser; no backend `evaluate` endpoint. Each sell price takes one rounding step, half away from zero, from the cost in cents (TP-S10-R5). Every cost the pricer reads is stored in integer cents (`PartRequest.cost`, the work order `Part.cost`, the inventory `Part.purchasePrice`, `InventoryBatch` cost, `DeliveryItem` price), so a cost entered with more than two decimals (QuickBooks Online and receiving can carry four) is rounded to the cent, half away from zero, before a rule is chosen (TP-S3-E3, TP-S5-R3). The PHP calculator, the simulator, the grid, line prices, `InventoryValueSellExpression` and the reports (which read recorded prices) therefore agree; the shared vectors pin four-decimal costs and half-cent ties | user; Product confirmed (PQ19) | One formula everywhere, instant simulator |
| D24 | API contract reconciled between the two planners — Section 5 is authoritative | agent | Planners designed in parallel |
| D25 | Golden Rule exemption, signed off by the user 2026-11-12: the release-day migration (M2) and `ResyncLegacyMatricesCommand` run across every client (each statement scoped per client under `runAs()`); recorded in the PR's "Golden Rule Exemptions" block | user (signed off 2026-11-12) | Fleet-wide data migration precedent |
| D26 | Audit entries for writes with no header location (Open API category create, CLI): use the acting user's home location; if none, skip the entry and log a WARNING rather than block the Open API (planner BE-D6) | agent | `AuditWorkplaceRequiredError` would break `POST /api/v1/part-categories`; API-key users have a home location in practice |
| D27 | Snapshot cost per row from the pricing DTO, proven equal to `WorkOrderStats::getPartsCost()` by the fixture matrix; fallback a per-part SQL mirror of `LinesStatsFetcher` (planner BE-D9) | agent | One source for the invoice snapshot |
| D28 | Withdrawn: PRD v37 dropped the reserved category name (TP-S8-N3, TP-S18-R4). No create or rename path checks "Credits not tied to a part", the Open API and the inventory import are unchanged, and DQ6 no longer counts categories with that name. It was: a check in `PartCategoryCreator::create()` and `PartCategory::changeName()` covering every path | — | The reports no longer have a "Credits not tied to a part" row (reports PRD v21), so page 37 removed the reservation |
| D29 | "Uses previous tier" hover (TP-S4-R3, TP-S7-R2, page 35): "Uses previous tier, \<n\> · \<name\>." names the previous tier by number and current name (TP-S4-R15). When that tier also uses its previous tier, the hover adds " Priced by \<n\> · \<name\>'s rule." for the tier whose own rule prices the column, Default included (the end of the chain, the tier the price details name, TP-S12-R18/R19), with no tiers in between. In the archived view the chain is D30's, and an archived tier, which has no number (TP-S2-R15), is named without one | Product (PQ23); the archived-tier naming is engineering's reading of TP-S2-R15 | Page 35 wording |
| D30 | Archived view (TP-S4-R19, page 36): Default first, then the archived tiers ordered by `pricing_tier.archived_at` ascending (the order they were archived, earliest first; a tier archived again sorts by its latest archive date), ties broken by `position`, then id; `pt__organization_id_archived_at_position_idx` covers it. A Same as previous tier column follows the column directly to its left, so the first archived tier's follows Default. The simulator under the archived grid, the "Uses previous tier" fill (TP-S4-R10) and the hover (D29) all use that chain, computed in the browser from the archived view's own columns; the API sends no extra data. Archived tiers still never price parts; an open work order that keeps an archived tier is priced by TP-S10-E8's chain (the nearest active tier before it), which is unchanged. | Product (PQ22, PQ27) | Page 36 wording. The archived view's chain can differ from what an open work order keeping the tier pays (TP-S10-E8, TP-S2-E2) and from its chain after reactivation (it goes last, TP-S2-R6); Product chose it knowingly in PQ22 |
| D31 | Categories list hover (TP-S7-R2): the list keeps one short label and kind per cell plus each row's `matrixId`; the hover's range lines come from the matrix's Work Order side, fetched on first hover through `GET /api/pricing/matrices/{id}` and cached per matrix, with the popover spinner while it loads (TP-S19-R7) | agent | Keeps the list to one summary query (§9); a page of 50 categories could otherwise carry about 11,000 cells. Rejected: embedding every range in the list response |
| D32 | Typed part number (TP-S10-R17): the save prices by the category the line is saved under, which `ValidationAwarePartRequestCommand::categoryFromPartNumber()` already resolves from the typed number before falling back to Uncategorized. `calculate-sell-price` takes `partNumber` and applies the same lookup when no category is picked, so the add row's suggested price is the one the save records | agent | Today the row previews Uncategorized's price and saves under the catalog category (`InlinePartRow.vue:930-940`). Rejected: correcting only on save (the suggested price would change on save) |
| D33 | Deleting a tier (TP-S2-R8/R13) clears `work_order.pricing_tier_id` on the work orders and Part Sales that kept it but aren't open, in the same transaction as the delete (NULL = Default, the meaning the migration gives NULL). The RESTRICT foreign key (D17) stays as the safety net, and the usage check and the delete use the same definition of open, so they agree. Plan-review edge: a reversed invoice returns its work order to Complete (`InvoiceReversalService.php:143`), and parts added to it afterwards price at Default | coordinator | Without it the foreign key fails a delete TP-S2-R8 allows, when only closed or invoiced work orders kept the tier. Rejected: SET NULL on the key (it would hide a usage-check bug) |
| D34 | Sell-price previews never eject a user (R1). `calculate-sell-price` needs `ROLE_PRICING::VIEW` (NFR-004), so every FE caller skips it for users without See Financial Data: `InventoryPartDialog.vue`, `InlinePartRow.vue`, `PartDialog.vue` and `useReceiveView.ts`. The backend prices on save for them (TP-S16-N4). `pricing/calculate-sell-price` is also added to `NON_EJECTING_403_ENDPOINTS` in `app/src/boot/axios.ts` as a backstop | agent | Today `InventoryPartDialog` calls it on every category change for every user, and a 403 sends the user to Access Denied. Rejected: leaving the endpoint ungated (TP-S16-R5); the non-ejecting entry alone (the dialogs would still send requests bound to fail) |
| D35 | When the four less obvious audit events are written (TP-S19-R20, mapped from TP-S19-R8): "Rule Changed" for a grid save that changes any rule or range, on either side and in either view; every category move writes the same three entries, whatever path made it (a matrix's Categories line, New Matrix with categories, a category's own page, TP-S3-R13, TP-S7-R9): "Category Matrix Changed" on the category's log, and "Categories Changed" on the matrix it left (the General Matrix for a category removed from a Categories line) and on the matrix it joined ("Matrix Created" instead, for New Matrix). One save still makes one entry per log, summing up every category it moved there. They are written once, in the shared `AssignPartCategoriesToPricingMatrixCommandHandler`; "Matrix Changed" for the Part Sale switch turned on or off, the one matrix change TP-S19-R8 lists without its own event name; "Customer Changed" on a tier's log when a customer stays on the tier but their channels on it change, while "Customer Added" and "Customer Removed" mark joining on a first channel and leaving the last one. Each save still makes one entry per log (TP-S19-R23) | agent | Page 35 names the events but not their triggers. Rejected: one generic "Matrix Changed" for every matrix save (the other names would never appear) |
| D36 | A grid save writes only the columns its view shows: the active view writes Default and the active tiers, the archived view writes the archived tiers (TP-S4-R32). Every other tier keeps its cells, carried through the save's range changes as TP-S3-R20 says ranges are shared: a removed range merges into the range above, which keeps its value (TP-S3-R32); a moved end keeps each range's value; a last range that followed the range above keeps following (TP-S3-R23). A tier the view didn't send is left as it is, never turned into Same as previous. In a range added from the active view, each archived column gets the rule of the range above it, as auto-fill fills an empty range (TP-S4-R26); page 35 has no rule for that case | coordinator (audit G2) | An archived tier keeps its rules for reactivation (TP-S2-R6, TP-S4-R19). Rejected: reading absent tiers as Same as previous (it wipes archived tiers' rules) |

**New dependencies:** none (BigInt is native; no new PHP or npm packages).

## 4. Database Changes

Full DDL sketches, rollback notes and migration steps: **Appendix A → P1**. Summary:

| Change | Kind | Rollback safety |
|---|---|---|
| `pricing_tier` (new; `name` VARCHAR(50), TP-S2-R3) | table | Old code never reads it |
| `pricing_matrix` + `part_sale_side_enabled`, `rules_revision`, `version`, audit stamps | additive columns with defaults | Old code ignores them; `is_default` kept (mapped as `isGeneral`) |
| `pricing_matrix_range`, `pricing_matrix_tier_rule`, `pricing_tier_rule_change` (new) | tables | Old code never reads them |
| `company.work_order_pricing_tier_id`, `company.part_sales_pricing_tier_id` | nullable FKs + indexes | Old inserts get NULL = Default |
| `work_order.pricing_tier_id` | nullable FK + index | NULL = Default |
| `work_order_part_request` / `work_order_part` + `pricing_source`, `pricing_tier_id`, `priced_for_company_id`, `pricing_details` JSON | nullable columns + index | NULL = before tiers |
| `invoice_part_line` (new, child of invoice, cascade on delete; `core`, `core_credit` and `environmental_charge` rows carry their parent part's category and pricing fields, Section 6 Phase 3) | table | Old reversal deletes the invoice → cascade |
| `pricing_matrix` unique `(organization_id, name)` (M3, after M2) | index | Old handlers already refuse case-insensitive duplicates |
| `pricing_rule`, `pricing_matrix.categories` | frozen, unmapped (`schema_filter`, `PENDING_DROP_COLUMNS`); M1 drops the legacy FK `FK_6DCEA672AA000BE7` (`pricing_rule.matrix_id` → `pricing_matrix`, no ON DELETE); no release-A code uses either except the one-shot resync; **dropped in release B** with the resync command (follow-up ticket) | Old code keeps pricing from frozen release-day rules on rollback; dropping the FK only relaxes, and old code's writes stay valid |

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. The plan never picks a migration version: the implementer creates the file with `bin/console doctrine:migrations:generate`, which stamps the real time — a hand-picked round version like `…120000` collides with other branches. See `api/.claude/reference/database.md`.

### Data migrations

- **M2 — release-day data (TP-S1), per client, under `runAs()`:** insert the Default tier; rename duplicates " (2)" and an existing "General Matrix" " (old)", then the default matrix "General Matrix"; copy each matrix's `markup_for_interval` rules into work-order-side ranges with a Default `markup` cell (real first start kept, last range follows above when equal); handle anomalies (a client with no usable default matrix gets the seeded General Matrix; a matrix with no rules gets a copy of its client's General Matrix rules, TP-S1-R9 — counts from DQ6 go in the PR); rewrite `part_category.pricing_matrix_id` from today's pricing truth (`pricing_matrix.categories`). No customer, work order or line backfill (NULL = Default / before tiers). Golden Rule sign-off: D25.
- **Rule-less matrices (TP-S1-R9, page 35; PQ26):** a category matrix with no rules (today its categories are priced by the default matrix) gets a copy of its client's General Matrix rules on release day, so no price changes; afterwards it keeps its own rules, and later General Matrix edits don't reach it. DQ6 found 3 such matrices at 3 clients, with 2 categories on them; Product checked that the only active client with an empty matrix has no category on it, and the two affected categories belong to a dormant client and the internal training account.
- **M1 drops the legacy FK `FK_6DCEA672AA000BE7`** (`pricing_rule.matrix_id` → `pricing_matrix`, created by `Version20230118135908`, no ON DELETE). Today a matrix delete must delete its legacy rows first because of it; without it, release A's `DoctrinePricingMatrixRepository::remove()` never touches `pricing_rule`. Dropping a foreign key only relaxes, so the previous release, which still writes `pricing_rule`, keeps working. A legacy row left for a deleted matrix is unreachable to old code, which reads rules through their matrix.
- **Post-deploy:** run `ResyncLegacyMatricesCommand` once (idempotent), in release A's deploy window, to pick up matrix edits old tasks made during that window. It first checks that `pricing_rule` and `pricing_matrix.categories` exist and is a no-op with a message when they don't (after release B). `LegacyMatrixResync` re-copies a matrix never saved in the new model (`rules_revision = 0`) whose legacy rows differ from its ranges. A rule-less matrix (0 legacy rows, General Matrix ranges copied by M2) always differs, so the resync applies M2's rule-less rule to it: it copies the General Matrix's current ranges, never the empty legacy set (TP-S1-R9). Test: a rule-less matrix with a category on it keeps the General Matrix's rules through the resync, and a second run changes nothing.
- **Derived data maintained by this PR:** `invoice_part_line`, written in `InvoiceFinancialSnapshotService::capture()` on invoice create and on every recompute path (`InvoiceBuilder` create + `UpdateTotalWhen*`), moved to Uncategorized on category delete, cascaded on reversal. The historical backfill is the reports PR's.

## 5. API Changes

Conventions: new endpoints and new keys are **camelCase** (`api-standards.md`; new keys in legacy snake_case payloads are camelCase too, as the Fees & Discounts contract did), money in **cents**, percentages in **hundredths of a percent**, rule types `percentOff | amountOff | plusAmount | markup | margin`, pricing sources `tier | default | fixedPrice | fixedLineTotal | manual | beforeTiers`. Every write is all-or-nothing; 409 bodies carry `{code, message}` naming the conflict (TP-S19-E2). Lists are paginated (≤ 50) and sorted server-side. Settings reads stay on the **writer** (Appendix A "Reads: replica or writer").

### New endpoints (authoritative; supersedes the appendices' paths)

| Method & path | Purpose (PRD) | Auth | Notes |
|---|---|---|---|
| `GET /api/pricing/tiers?status&page&rowsPerPage` | Tiers list (TP-S2-R1/R14/R25) | settings atom + `ROLE_PRICING::VIEW` | Row: `{id, number, name, isDefault, status, customers:{total, workOrders, partSales}, matrices:{withOwnRules, activeTotal}, deleteBlock:{reason, count}\|null}` |
| `GET /api/pricing/tiers/options` | Tier pickers (TP-S9-R30) | `ROLE_CUSTOMER::CREATE_AND_EDIT` **or** settings atom | `{activeCount, tiers:[{id, number, name}]}` |
| `POST /api/pricing/tiers` · `GET`/`PATCH /api/pricing/tiers/{id}` | Create, view, rename (TP-S2-R3/R5/R17/R28/R29) | settings + pricing | 422 `{code: required\|taken\|takenByArchived\|reserved\|tooLong}`; `tooLong` = more than 50 characters after trimming (TP-S2-R3); detail includes `nextNumber` |
| `GET /api/pricing/tiers/{id}/usage` | Archive/delete flows (TP-S2-R7/R8/R13/R30, TP-S16-E1) | settings + pricing | `{customers:{count, list\|null}, openOrderCount, pricedLineCount, followers:[name], tierBeforeName, canDelete, deleteBlockedReason}`; names only with `ROLE_CUSTOMER::VIEW` |
| `POST …/tiers/{id}/archive` · `POST …/reactivate` · `DELETE …/tiers/{id}` | TP-S2-R6/R7/R8/R26 | settings + pricing | Re-checked under the tier row lock; 409 `hasCustomers` / `deleteBlocked`. Delete clears `pricing_tier_id` on work orders and Part Sales that kept the tier but aren't open, in the same transaction (D33) |
| `GET /api/pricing/tiers/{id}/matrices?page` | Tier Pricing tab (TP-S2-R20) | settings + pricing | General first, then A–Z; per side `RuleSummary {kind: usesPreviousTier\|single\|layered\|mixed, ruleType?, value?}` |
| `POST /api/pricing/tiers/{id}/rule-changes/preview` · `POST …/rule-changes` · `POST …/rule-changes/{changeId}/undo` | Set Rule + Undo (TP-S2-R22..R27, TP-S2-E5, TP-S2-N7/N8) | settings + pricing | Body `{rule:{ruleType, value}, selection:{all:true, exceptMatrixIds:[]}\|{matrixIds:[]}}`; preview `{changing, changingInactive}`; apply `{changeId, changedMatrixCount}`; undo 409 `{code:'savedAfter', matrixName}` |
| `GET /api/pricing/tiers/{id}/customers?search&channel&sortBy&descending&page` | Tier Customers tab (TP-S9-R9) | settings + pricing + `ROLE_CUSTOMER::VIEW` | Rows `{id, name, channels}` |
| `GET /api/pricing/tiers/{id}/customer-candidates?tab=add\|remove&search&page` | Manage Customers (TP-S9-R4/R10/E5/E7) | settings + pricing + `ROLE_CUSTOMER::CREATE_AND_EDIT` | Rows `{id, name, workOrderTier, partSalesTier}`; `meta:{total, onTierWorkOrdersOnly, onTierPartSalesOnly, onTierBoth}`; search covers current tier names |
| `POST /api/pricing/tiers/{id}/customer-assignments` | Bulk add/remove (TP-S9-R18..R24, TP-S9-E6) | same | `{mode:'add'\|'remove', customers:[{customerId, channels}], selectAll:{search, channels, exceptCustomerIds}\|null}` → `{customers, both, workOrdersOnly, partSalesOnly}` |
| `GET /api/pricing/matrices?search&status&sortBy&descending&page` | Matrices list (TP-S6) | settings + pricing | `sortBy=name\|categoryCount`; `categoryCount` sorts by the number of categories, highest first on the first click (TP-S6-R6, TP-S19-R22) |
| `GET /api/pricing/matrices/options` | Matrix pickers | settings + pricing | `[{id, name, isGeneral, categoryCount}]` |
| `GET /api/pricing/matrices/{id}?view=active\|archived` | Matrix page (TP-S3-R18, TP-S4-R1/R19) | settings + pricing | `{id, name, isGeneral, isActive, categories, generalCategoryCount, partSaleSeparate, rulesRevision, workOrderSide, partSaleSide\|null, tierColumnsOrder}`; side = `{ranges:[{id, startCents, endCents\|null}], defaultColumn:{cells}, tierColumns:[{tierId, mode:'own'\|'previousTier', cells}]}`; cell = `{rangeId, ruleType, value, followsAbove}`. With `view=archived`, `tierColumns` holds Default's column first, then the archived tiers ordered by `pricing_tier.archived_at` ascending (the order they were archived, earliest first; a tier archived again sorts by its latest archive date), ties broken by `position`, then id; `pt__organization_id_archived_at_position_idx` covers it; a Same-as-previous archived column follows the column to its left (TP-S4-R19, D30), so nothing extra is sent |
| `POST /api/pricing/matrices` | New Matrix (TP-S3-R30, TP-S7-R11) | settings + pricing | `{name, categories:[{id, expectedMatrixId}], workOrderSide}` |
| `PATCH /api/pricing/matrices/{id}` · `PUT …/{id}/categories` | Rename on blur; Categories line (TP-S3-R13/R18) | settings + pricing | Categories carry `expectedMatrixId` (409 on conflict); removed ones go to General |
| `PUT /api/pricing/matrices/{id}/sides/{side}/rules` | Grid save, per tab (TP-S4-R12/R22/R32, TP-S3-R6/R16/R20/R23) | settings + pricing | `{expectedRulesRevision, view, ranges:[{key, endCents\|null}], defaultColumn, tierColumns}`. Writes only the columns the view shows, each with an explicit mode (`own` or `previousTier`); other tiers keep their cells through the range changes (D36); 422 `{errors:[{rangeKey, column, code}]}` with codes `endNotAboveStart\|valueRequired\|tooManyDecimals\|marginOutOfRange\|percentOffOutOfRange\|amountOffNegative\|gapOrOverlap`, which the FE maps to the TP-S3-R6 messages; 409 `{code:'matrixChanged', message:'<matrix> was changed by someone else. Reload to see their changes.'}` when `expectedRulesRevision` is stale (TP-S19-E2); 200 returns the new `rulesRevision`. One side per request, so each tab saves on its own (TP-S3-R18) |
| `POST`/`DELETE /api/pricing/matrices/{id}/part-sale-side` · `POST …/{id}/duplicate` · `DELETE …/{id}` | TP-S3-R8/R9/R21/R27/R31, TP-S3-N3 | settings + pricing | |
| `GET /api/pricing/categories?search&sortBy&descending&page` | Categories list (TP-S7-R1/R2/R4) | settings atom; pricing columns only with `ROLE_PRICING::VIEW` (TP-S16-R11) | One summary query for the page's matrices; each row carries `matrixId`, and the TP-S7-R2 hover loads that matrix's Work Order side through `GET /api/pricing/matrices/{id}` (D31) |
| `GET /api/pricing/categories/{id}` · `PUT …/{id}/matrix` | Category page (TP-S7-R6/R9/R13/R15) | settings (+ pricing for the matrix) | `PUT` body `{matrixId\|null, expectedCurrentMatrixId}` |
| `GET /api/pricing/{matrices\|tiers\|categories}/audit-log` · `GET /api/pricing/{matrices\|tiers\|categories}/{id}/audit-log` | Audit Logs (TP-S19-R19/R21) | settings + pricing | `{collection:[{id, eventName, entityType, entityId, entityName, userName, occurredAt, summary, changes:[{label, oldValue, newValue}]}], pagination}`; 50 per page, newest first, search |
| `GET /api/pricing/calculate-sell-price?categoryId&cost&inventoryPartId?&workOrderId?&partRequestId?&partNumber?` | Add-row and receive previews (replaces `GET /api/pricing-rules/calculate-sell-price`) | `ROLE_PRICING::VIEW` | `{sellPrice, pricingSource, tierName}`; with `partRequestId` prices by the recorded tier and customer (receive preview, TP-S11-R9); with `partNumber` and no category, prices by the category of the catalog part matching the number, as the save does (TP-S10-R17, D32). A `cost` of 0 or empty answers $0.00 under the work order's tier (TP-S10-N1), or the fixed price for a fixed-price part. Never called for users without See Financial Data, and listed in `NON_EJECTING_403_ENDPOINTS` (D34) |
| `GET /api/customers/{companyId}/pricing-summary` | Customer card Pricing (TP-S9-R12/R15/R16) | `ROLE_CUSTOMER::VIEW` + `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW` | `{laborRate:{name, rateCents\|null, variesByLocation}, shopSupplies:{kind, percent?, minCents?, maxCents?}, tax:{taxId\|null, name\|null}, activeTierCount, workOrderTier, partSalesTier}`; `tax.name` is the name of the tax picked on the customer, exactly as stored; both null when none is picked, and the FE shows "Default Tax Settings" (TP-S9-R12) |
| `GET /api/work-orders/{workOrderId}/part-requests/{partRequestId}/price-details` | Price details (TP-S12-R2/R12/R17/R18) | `ROLE_WORK_ORDER::VIEW` + `ROLE_PRICING::VIEW` | Shape in Appendix A P4 plus `cannedLine.pendingCost`, `tierIsDefault` and `sameAsPreviousTierCurrentName`. Each tier comes with its name when priced (`tierName`, `sameAsPreviousTierName`) and its current name; the FE shows "Fleet (now Fleet Plus)" when they differ and Default by its current name (TP-S12-R5, TP-S4-R15). No part status (TP-S12-R7) |

### Modified endpoints

| Endpoint | Change |
|---|---|
| `POST /api/work-orders/part/make-request`, `POST /api/work-orders/part/change-request` | + `sellPriceTyped?`, `marginTyped?`, `costTyped?` (D19); response + `pricedBy`. The cost reprices only with `costTyped: true` (the user entered the cost field in this edit, the same amount included, TP-S11-R12), and only where the cost can be re-entered. With `costTyped: false` a sent cost equal to the stored one changes nothing, so a quantity or description save keeps the unit price and a Manual price (TP-S11-R4/R5); a different cost counts as typed. Absent = today's meaning |
| `GET …/inventory-parts-as-options-with-remaining-catalogue-parts` | + `workOrderId?` → `sell_price` priced by the work order's tier (D19) |
| `POST /api/work-orders/parts/change` | Typed price → Manual. A category change reprices the line, received or not, by the work order's tier at the cost on the line (TP-S11-R3), except a fixed price, a fixed line total, a no-cost canned part's saved price, or an invoiced work order or Part Sale (TP-S11-N1); response + `pricedBy` |
| Parts tab / Lines tab / Part Sale part rows | + `pricedBy:{source, label}` (absent without See Financial Data); `label` is the tier's current name (TP-S12-R5) |
| Work order / Part Sale payload | + `pricingTier:{id, number, name}\|null` |
| `POST /api/work-orders/change-customer` | Response + `linesPricedForPreviousCustomer:{count, tierName\|null}` (absent without See Financial Data, TP-S14-R2) |
| `POST /api/customers/create`, `/api/customers/change` | + `workOrderPricingTierId?`, `partSalesPricingTierId?` (missing key = unchanged); company view + `workOrderPricingTier`, `partSalesPricingTier`, `isSystemDefault` |
| `POST /api/parts-catalogue/add-category` | + `pricingMatrixId?` (403 without `ROLE_PRICING::VIEW`) |
| `POST /api/parts-catalogue/categories/{id}/remove` | Never blocked except Uncategorized (409); moves parts and lines (invoiced included) set-based; audit entry |
| PO receive (`POST /api/inventory/orders/accept`) | Client sell price counts only when flagged typed; work-order-linked items go through the receipt policy |
| Removed | `/api/pricing-rules/*` (matrix add/change/remove/list/calculate) — the FE moves to the new routes in this PR |

## 6. Implementation Phases

Eighteen phases in dependency order, one commit each. Backend phases (**B**) are dispatched to `be-implementer`, frontend phases (**F**) to `fe-implementer`. Each phase's detail lives in the appendix section named; Sections 3, 5 and 9 override the appendices.

| # | Phase | Layer | Implements | Depends on | Detail |
|---|---|---|---|---|---|
| 1 | Foundation: schema, domain, release-day migration, permission atom, audit types | B | TP-S1 all; data side of TP-S2/S3/S9/S10/S12 | — | Appendix A → P1 |
| 2 | Pricing engine, shared vectors, shared FE components | F | TP-S10-R4/R5/R15/R20 (browser engine), TP-S15-R5 math, TP-S19-R7/R10 components | 1 (vectors format agreed) | Appendix B → F0 |
| 3 | Resolver + recording core + invoice part-line snapshot | B | TP-S10 all, TP-S12-R4/R15/R18/R19, TP-S13-R1, TP-S17-R1, NFR-001/006/007 | 1, 2 (vectors) | Appendix A → P2 |
| 4 | Every pricing path through the resolver | B | TP-S11 all, TP-S10-R14, TP-S10-R17 (typed part number), TP-S13, TP-S14-R2/R3, NFR-011 | 3 | Appendix A → P3 |
| 5 | What priced a line (Priced by, price details, masking) | B | TP-S12, TP-S10-N2, NFR-003 | 4 | Appendix A → P4 |
| 6 | Lines UI: Priced by column, price details, Manual icon, add paths, receive notice and preview | F | TP-S12, TP-S11-R15, TP-S13, NFR-011 | 5 | Appendix B → F8 |
| 7 | Change Customer dialog copy, amber note, notice | F | TP-S14-R2/R4/R5, TP-S13-E1 | 4, 5 | Appendix B → F9 |
| 8 | Tiers and matrices API (incl. Set Rule/Undo; no simulator endpoint, D23) | B | TP-S2, TP-S3, TP-S4, TP-S6, TP-S15, TP-S19-R8/R20/R23, TP-S19-E2 | 1, 3 | Appendix A → P5 |
| 9 | Categories API (single link, delete changes, category audit) | B | TP-S7, TP-S8, TP-S18-R5/R6 | 8 | Appendix A → P6 |
| 10 | Customers, Manage Customers, Audit Log reads | B | TP-S9, TP-S16-R4, TP-S19-R19..R23 | 1, 8 | Appendix A → P7 |
| 11 | Settings › Pricing shell, nav order, Fixed Rules tab, Matrices list | F | TP-S6, TP-S7-R14, TP-S16-R11 | 8, 10 | Appendix B → F1 |
| 12 | Matrix page (view), simulator, below-cost warning | F | TP-S3-R18/R26/R28, TP-S4 view, TP-S5, TP-S15 | 2, 8 | Appendix B → F2 |
| 13 | Grid edit, New Matrix, save flows, archived view, discard guard | F | TP-S3, TP-S4 edit, TP-S19-R3/R14 | 12 | Appendix B → F3 |
| 14 | Tiers list, tier page, archive/delete/reactivate, Set Rule with Undo | F | TP-S2 | 8, 10, 13 | Appendix B → F4 |
| 15 | Tier Customers tab and Manage Customers | F | TP-S9-R4..R11/R17..R24, TP-S9-N*, TP-S9-E* | 10, 14 | Appendix B → F5 |
| 16 | Categories list, category page, New Category, delete | F | TP-S7, TP-S8 | 9, 12 | Appendix B → F6 |
| 17 | Customer tier fields and customer card Pricing section | F | TP-S9-R1..R3/R12..R16/R30/R31, TP-S9-R8 | 10 | Appendix B → F7 |
| 18 | Remove legacy code | F | TP-S19-R13 (no matrix dialogs anywhere) | all | Appendix B → F10 |

### Per-phase notes that override or extend the appendices

**Phase 1 (Appendix A P1).** `pricing_tier.name` is VARCHAR(50), not Appendix A M1's VARCHAR(100): TP-S2-R3 caps a tier name at 50 characters after trimming, and `PricingTierName` refuses a longer one (422 `tooLong`). The post-deploy resync keeps rule-less matrices on the General Matrix's rules (Section 4; test there). DQ6 ran on the prod replica on 2026-11-11 (Section 1 → Clarifications); re-run it right before release and put its counts in the PR. The 3 rule-less matrices get a copy of the General Matrix's rules (TP-S1-R9, Section 4). Rule calculation values stored snake_case in the DB, exposed camelCase (Section 5).
- **Release A stops using `pricing_rule` (D14; Section 8):** M1 drops `FK_6DCEA672AA000BE7`; `DoctrinePricingMatrixRepository::remove()` doesn't touch `pricing_rule`; `DbalDuplicatePartCleanupRepository` drops its `pricing_rule` reference, scope entry and `countPricingRules()`, with `DuplicatePartRemovalResultDto::survivorPricingRuleCount` and the CLI warning; `LegacyMatrixResync` checks that `pricing_rule` and `pricing_matrix.categories` exist first. Tests: deleting a matrix that has legacy rows succeeds with the FK gone and leaves those rows alone; the duplicate cleanup and the matrix delete issue no statement naming `pricing_rule` (asserted with a query logger, so it holds once release B drops the table); the resync is a no-op when the table is absent; a static test fails if a class outside `LegacyMatrixResync` and its command names `pricing_rule` or `PricingRule::TABLE_NAME`.
- **Verification:** static (cs-fix, phpstan on changed files, pest); migration gate (`doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` → "No changes detected"); `bin/smoke-test.sh --warmup` then `bin/smoke-test.sh`.

**Phase 2 (Appendix B F0).** The engine uses BigInt exact integer math (D23; TP-S10-R5, Product confirmed). Create the shared vectors file at the D22 path, including the PRD examples (TP-S10-R15, TP-S15-R5, §5 terminology 10 → 13 / 14.29); half-cent ties (15% markup on $1.70 = $1.96, today $1.95); costs entered with three or four decimals with the cent cost they round to (TP-S3-E3: $10.005 → $10.01, $10.0049 → $10.00, $1.6950 → $1.70, then priced); $ Off floor; Same-as-previous chains across archived tiers; first range above $0; and an archived Same-as-previous column priced from the column to its left in archive-date order, Default for the first archived tier (D30). The simulator and the below-cost warning use only this engine; there is no backend fallback.
- **Verification:** eslint, `vitest related --run`, `vue-tsc --noEmit`; compile gate.

**Phase 3 (Appendix A P2).** Math per D23: one rounding step, half away from zero, from the cost in cents, identical in `TieredPriceCalculator`, the `InventoryValueSellExpression` SQL twin and the browser engine. The backend test runs `priceCases` from the shared vectors, and `InventoryValueSellExpressionParityTest` runs the Default-column cases through the SQL twin. `calculate-sell-price` moves to `/api/pricing/calculate-sell-price` (Section 5); a `cost` of 0 or empty answers $0.00 under the work order's tier, or the fixed price (TP-S10-N1; endpoint test for both). QuickBooks and AccountingHub booking doesn't change (TP-S18-R3): part revenue books by the line's category, and credits and refunds by the inventory part's current category, as today.
- **Fixed line total (D10, TP-S10-R13).** Weights and the all-$0 split by quantity follow Appendix A §2.4 steps 1–2. Unit prices truncate to the cent, as today (not §2.4 step 3's rounding), so the leftover is never negative. The leftover cent follows today's rule in `FixedLineTotal::calculatePrices()` (`api/src/VehicleService/WorkOrders/Domain/Line/FixedLineTotal.php:86-121`): it goes on the first part with a quantity of exactly 1, and when the line has none, the line's labor portion grows by it and its parts amount shrinks by it. "First" is the order `calculatePrices()` walks today: `sortParts()` sorts a copy, so the order is the order the parts were added. Keep that order, or open fixed-total lines show the cent on a different part. Each part's recorded share is then its unit price × quantity, and the shares sum to the line's parts amount (the fixed total less labor, after any cent moved to labor). This replaces §2.4 step 4's "last quantity-1 part".
- **Invoice part-line snapshot (D11; reports PRD page 18, S1-R3 and S1-R9).** A `core`, `core_credit` or `environmental_charge` row copies `part_category_id`, `pricing_source`, `pricing_tier_id` and `priced_for_company_id` from its parent part request, so the reports put it in the part's tier row and category. A `part_line` fee or discount that targets a single part (its part or part-request id) goes into that part's `part` row as `line_adjustment_cents`. Gross, net and cost stay each row's own amounts. Only `part_line` adjustments are attributed; whole work order or Part Sale fees stay out of the rows, as Appendix A §2.5 has it.
- **Verification:** static; smoke; the invoice-create functional test asserting snapshot rows reconcile.

**Phase 4 (Appendix A P3).** PO receive: client sell price counts only when flagged typed (Section 5); the PO receive FE preview moves in Phase 6. Reopened paid work order takes the customer's current tier (FYI posted). The Change Customer count is left out of the response for users without See Financial Data (TP-S14-R2).
- **Category change on a received part (TP-S11-R3; new behavior).** `parts/change` (`ChangeCommandHandler:172-192`) takes Appendix A's Branch A. A category change reprices the line at the cost on the line, with the work order's tier and the new category's matrix, as a cost change does (TP-S11-R2), received or not. It records what priced it again: the source, the work order's tier and the work order's current customer. It runs for users without See Financial Data too (TP-S16-N4; the response is masked) and pushes the price and record to the work order parts minted from the request (`PartsManager::updatePartsForPartRequest()`). A Manual price is replaced (TP-S11-R5). A fixed price (TP-S11-N2), a fixed line total (TP-S10-E6) and a no-cost canned part's saved price (TP-S11-E8) are kept.
  - **With receiving (TP-S11-R9):** a later receipt at a new cost is handled by what priced the line, which is now the category reprice. A tier line reprices by the tier it recorded; a Default line keeps its margin.
  - **With invoicing and credits (TP-S11-N1):** on an invoiced work order or Part Sale a category change, where today's screens allow one, never reprices. A credit or return keeps using the original invoiced price.
- **Cost edits need `costTyped` (TP-S11-R4/R5/R12, D19; audit G1).** `PartDialog` always sends `cost` and `margin`, so a pricer that repriced whenever a cost arrives would reprice every dialog save, drop Manual prices and apply rule changes to tier lines. `make-request` and `change-request` therefore take `costTyped`. The pricer reprices on cost only when it is true: the user entered the cost field in this edit, the same amount included (TP-S11-R12: "Re-entering the cost reprices the line even when the amount is the same"), and only where the cost can be re-entered (TP-S11-R12 list; Appendix A §3.2's gap closure). With `costTyped: false` a sent cost equal to the stored one changes nothing, so a quantity or description save keeps the unit price (TP-S11-R4) and a Manual price (TP-S11-R5); a different cost counts as typed. Absent, the flag keeps today's meaning, so a browser on the old build behaves as today.
- **A cost edited to $0.00 or emptied (TP-S10-N1, page 35; PQ25).** Build TP-S10-N1 as written: the sell price becomes $0.00, with no + $ added, recorded under the work order's tier (Default included) with basis `no_cost`. Today's SV-10035 fallback (`UpdatePartRequestDataResolver.php:513-519`, which keeps the stored price when the recompute returns null) stays only for a recompute that genuinely can't price, never for a $0.00 or empty cost. A no-cost canned part keeps its saved price (TP-S11-E8). This replaces Appendix A §3.2's "Cost edited to 0 → keep the stored price".
- **Typed part number (TP-S10-R17, D32).** The save prices by the category the line is saved under, which `ValidationAwarePartRequestCommand::categoryFromPartNumber()` resolves from the typed number before the Uncategorized fallback, so the part is priced by its catalog part's own category. `calculate-sell-price` applies the same lookup when it gets `partNumber` and no category.
- **Tests, on top of Appendix A P3:** `parts/change` on a received tier-priced part (the new category's matrix at the work order's tier, record updated, minted parts updated); the same with a Default customer, a Manual line (replaced) and a fixed-price part (kept); a user without See Financial Data (repriced, response masked); an invoiced work order (price unchanged); a receipt at a new cost after a category reprice (TP-S11-R9 by the new record); a credit on an invoice whose part's category changed before invoicing (the invoiced price). Make-request with a typed number matching a catalog part whose category has its own matrix (priced by that matrix), and `calculate-sell-price?partNumber=` giving the same price. `change-request` with `costTyped: false` and the stored cost on a Manual line and on a tier line after a rule change (price unchanged); `costTyped: true` with the same cost on an editable line (repriced); a quantity-only save (unit price kept). A cost edited to $0.00 and to empty (sell price $0.00, recorded under the work order's tier); a recompute that can't price (stored price kept).
- **Verification:** static; smoke; regression list in Appendix A P3.

**Phase 5 (Appendix A P4).** Row field is `pricedBy:{source, label}` (Section 5); `label` is the tier's current name, Default's included (TP-S12-R5, TP-S4-R15). Price details return the name when priced and the current name for the work order's tier and for the Same-as-previous rule tier, plus `tierIsDefault` (Section 5). Neither carries a part status (TP-S12-R7).

**Phase 6 (Appendix B F8).** Five coordinated edits in `WorkOrderPartRequests.vue` (incl. `lineDescriptionColspan`); receive notice constant changes for all three receive surfaces; PO receive preview follows TP-S11-R9 using `calculate-sell-price?partRequestId`. The Parts and Lines tables keep today's status column; the Priced by column and the price details show no part status (TP-S12-R7). Price details show a renamed non-Default tier as "\<name when priced\> (now \<current name\>)", for example "Fleet (now Fleet Plus)", and Default always by its current name (TP-S12-R5); the Same-as-previous sentence (TP-S12-R18) and "Priced by \<tier\> for \<customer\>" (TP-S12-R17) name tiers the same way. When no category is picked, the inline row and the part dialog pass the typed part number to `calculate-sell-price` (`partNumber`), so the suggested price is the one the save records (TP-S10-R17, D32). A category change on a staged or received part takes the new price and Priced by from the `parts/change` response.
- **Senders of `costTyped` (audit G1).** `PartDialog.vue` `mapPartForAPI` (lines 1343–1352) always sends `cost` and `margin`; it sends `costTyped: true` (and `marginTyped: true`) only after an input on that field since the dialog opened. `InlinePartRow.vue` sends `costTyped: true` with every cost the user entered, and its `onCostBlur` reprices after any input while focused, even back to the same amount (TP-S11-R12), instead of only when `draft.cost !== costOnFocus`; a tab-through stays a no-op. The Parts tab's and the Part Sale parts table's cell edits in `WorkOrderPartRequests.vue` save through `change-request` by absence, so they send `costTyped: true` with every cost they send. Today `savePartRequestField` returns early when `focusedCellOldValue === currentCellValue` (lines ~2690–2697), so a retyped same cost never saves; a cost cell that had input since focus (`noteCellInput` / `cellInputs`, lines 450 and 2536–2540) skips that guard and sends `cost` with `costTyped: true`, and tabbing through stays a no-op (TP-S11-R12). Tests: a dialog quantity or description save sends `costTyped: false`; retyping the same cost sends `true`; the inline row reprices on a retyped same cost and not on a tab-through; on the Parts tab, a cost cell retyped to the same value saves with `costTyped: true` and a tabbed-through one sends nothing.
- **A cost emptied or set to $0.00 previews $0.00 (TP-S10-N1, page 35).** `PartDialog.vue` `handleCalculateSellPrice` (line ~1485) returns early on `!cost.value`, and `InlinePartRow.vue` `recalculateSellPrice` returns early on `cost === null`, so the screen keeps the old sell price while the save records $0.00. Both now preview with a cost of 0: `calculate-sell-price` answers $0.00, or the fixed price for a fixed-price part (users without See Financial Data still skip the call, D34). Tests: emptying the cost and typing 0 each show $0.00 in the part dialog and the inline row; a fixed-price part keeps its fixed price.
- **No 403 ejection from sell-price previews (D34; audit R1).** Every caller of `calculate-sell-price` skips it when the user lacks See Financial Data: `InventoryPartDialog.vue` (`handleCategoryInput`, `handleCostChange`, `handleAverageCostChange` and `handleSellPriceBlur`, all through `recalculateSellPrice`), `InlinePartRow.vue` (`recalculateSellPrice`), `PartDialog.vue` (`handleCalculateSellPrice`, line ~1485) and `useReceiveView.ts` (`sellPriceQueryOptions`). The backend prices on save for those users (TP-S16-N4; inventory parts through `Part::applyFixedSellPrice`, Appendix A §2.1). Add `pricing/calculate-sell-price` to `NON_EJECTING_403_ENDPOINTS` in `app/src/boot/axios.ts` as a backstop and to `boot/tests/non-ejecting-403.spec.ts`. Tests: `InventoryPartDialog` without See Financial Data changes the category and sends no request and stays on the page; with it, the request is sent; the same for the inline row and the part dialog.
- **Verification:** static; compile; browser-walk `/work-orders/<id>` Parts and Lines tabs and a Part Sale as `admin` (Priced by column, hover/Alt+Down details, Manual icon after typing a price) and as a user without See Financial Data (no column, no details).

**Phase 7 (Appendix B F9).** Users without See Financial Data don't see the notice (TP-S14-R2): the API leaves `linesPricedForPreviousCustomer` out for them, and the dialog shows nothing when it is absent. Placement per design 14.8.
- **Browser-walk:** Change Customer on a work order and a Part Sale whose new customer is on another tier (amber note), then the notice count.

**Phase 8 (Appendix A P5).** Paths per Section 5. Grid save: a stale `expectedRulesRevision` gives 409 `matrixChanged` with "\<matrix\> was changed by someone else. Reload to see their changes." and saves nothing (TP-S19-E2); validation gives 422 with a code per cell for the TP-S3-R6 messages ("Enter an end above \<start\>", "Enter a value", "Use at most two decimals", "Enter a margin from 0 to 99.99", "Enter a % from 0 to 99.99", "\<tier\>: enter $0.00 or more in every range."). Each side saves on its own, so per-tab Edit (TP-S3-R18) needs no API change. The Matrices list's `sortBy=categoryCount` sorts by the number of categories, most first on the first click (TP-S6-R6). `?view=archived` returns Default, then the archived tiers ordered by `pricing_tier.archived_at` ascending (the order they were archived, earliest first; a tier archived again sorts by its latest archive date), ties broken by `position`, then id; `pt__organization_id_archived_at_position_idx` covers it (TP-S4-R19, D30). Test: three tiers archived out of creation order come back by archive date, and a reactivated-then-re-archived tier comes last. A tier name over 50 characters gives 422 `tooLong` (TP-S2-R3). No `evaluate` endpoint; Appendix A P5's row is dropped (D23).
- **Archived tiers' rules survive active-view saves (D36; TP-S2-R6, TP-S4-R19, TP-S3-R20; audit G2).** This replaces Appendix A P5's "Tiers absent from `tiers` = Same as previous". An active-view save writes Default and the active tiers only; an archived-view save writes the archived tiers only. Range changes made in the active view reach the archived columns as D36 sets out. Page 35 has no rule for what an archived column holds in a range added from the active view; the plan gives it the rule of the range above, as auto-fill does. Tests: an archived tier with its own rules through an active-view save with no range change (unchanged), a removed range (the range above keeps its value and takes the end), a moved end (values stay), an added range (copies the range above; a following last range follows it); an archived-view save leaves Default and the active tiers alone; reactivating the tier brings its columns back as saved (TP-S2-R6).
- **Deleting a tier only closed work orders kept (D33; TP-S2-R8/R13; audit G3).** The delete clears `pricing_tier_id` on the work orders and Part Sales that kept the tier but aren't open, in the delete's transaction, then deletes the tier; RESTRICT stays. The usage check (grayed Delete, 409 `deleteBlocked`) and the delete use one definition of open. Tests: a tier kept only by an invoiced work order deletes, and that work order's `pricing_tier_id` becomes NULL; reversing that invoice returns the work order to Complete and a part added then prices at Default; an open work order still blocks the delete; a direct SQL delete with an open work order still fails on the foreign key.
- **Matrix audit events (D35; TP-S19-R8, TP-S19-R20).** "Rule Changed" on a grid save that changes a rule or range (either side, either view); "Matrix Changed" when the Part Sale switch turns on or off. Every category move writes three entries, from a Categories-line save and from New Matrix with categories alike: "Category Matrix Changed" on each moved category, "Categories Changed" on each matrix a category left (the General Matrix for a removed one) and on the saved matrix ("Matrix Created" for New Matrix). Tests: one entry per save on each log, with the summary TP-S19-R23 describes, and none for a save that changes nothing; a Categories-line save that adds a category from another matrix and removes one to the General Matrix writes entries on the saved matrix, the matrix left, the General Matrix and both categories; New Matrix with two categories from different matrices writes "Matrix Created", "Categories Changed" on both old matrices and "Category Matrix Changed" on both categories.
- **Verification:** static; smoke.

**Phase 9 (Appendix A P6).** Category names follow TP-S8-N3 as today (unique ignoring capitals, at least 3 characters); page 37 reserves no category name, so create, rename, the Open API and the import are unchanged (D28 withdrawn). Categories list rows carry `matrixId` for the hover (D31). A category's own page moving it (TP-S7-R9) writes the same three audit entries as a Categories-line save, through the same command handler (D35); test that path too. TP-S18-R3 needs no change here; its regression check is in Section 7.

**Phase 10 (Appendix A P7).** `pricing-summary.tax` is `{taxId, name}` (Section 5). Read it from the raw junction table `tax_company` (it has no ORM entity; see the docblock in `api/src/Tax/Domain/Tax.php`) left-joined to `tax`, as `api/src/Customer/Customers/Application/View/ViewQueryHandler.php:113-122` already does, with `tax.organization_id` bound to the client. `name` is the tax's name exactly as stored. Both are null when the customer has no tax picked, or the picked tax no longer exists, and the FE then shows "Default Tax Settings". This replaces Appendix A P7's raw `taxExemptLocal` and `taxExemptFederal`. Tests: no pick, a pick, another client's tax id (not returned). Labor Rate is the rate at the user's current location, with "Varies by location" when the customer's rate differs at another location; Shop Supplies is `kind` `none`, `own` or `locationDefault`, which the FE shows as "No shop supplies", the customer's own charge, or "Location default" (TP-S9-R12). Audit read paths per Section 5.
- **Customer audit events (D35; TP-S19-R20).** On a tier's log: "Customer Added" when a customer joins the tier on a first channel, "Customer Changed" when they stay on it but their channels change, "Customer Removed" when they leave its last channel, from Edit Customer and from Manage Customers (one summary entry per bulk save, TP-S19-R23). Tests: each of the three from both places, and the previous tier's entry on an add (Appendix A ambiguity A13).

**Phase 11–17 (Appendix B F1–F7).** Paths per Section 5; list state per user via `usePagePreferences`; breadcrumbs from `history.state`; Undo toast hosted app-wide (D21). Product round 1 answers by phase:
- **Phase 11 (F1):** the Matrices list's Categories column sorts by the number of categories, most first on the first click (TP-S6-R6). The Fixed Rules tab gets no new sorting; that stays on SV-11258 and ships separately (D2).
- **Phase 12 (F2), simulator and info tooltips (TP-S5-R1, TP-S19-R15; audit G5):** the table under the grid is titled "Price Part Simulator", with the info tooltip "Type a part cost to see each tier's price and profit. Nothing is saved." The Cost Range header has its info icon with the tooltip "A part's cost picks its row. The first range starts at $0.00; the last has no upper limit." (design 4.1, `MP02-RangeInfo.dc.html`). The Categories line under the matrix title has its info icon with "A category uses one matrix. Adding one here moves it from its current matrix." (design 5.1, `MP05-Simulator.dc.html`). TP-S19-R15's "how a price is found" explanation is the simulator's tooltip above: the design places no other one (checked in the canvas 2026-11-11). Tooltip texts are copied from the design, which is binding.
- **Phase 12 (F2):** a "Uses previous tier" cell's hover reads "Uses previous tier, 2 · Wholesale.", and when that tier also uses its previous tier, "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule." (TP-S4-R3, D29). The Price Part Simulator also shows under the archived grid, for Default and the archived tiers (TP-S4-R19); there the archived columns come in the order they were archived, earliest first, a Same-as-previous column follows the column to its left, Default for the first archived tier, and the simulator, the fill and the hover use that chain (D30). Archived tiers still never price parts. Tests: the two hover texts, a chain ending at Default ("Priced by 1 · \<Default's current name\>'s rule."), the archived chain through two archived columns archived in the opposite order to their creation, the archived simulator priced by it.
- **Phase 13 (F3):** each tab has its own Edit, Save and Cancel (TP-S3-R18), so `useMatrixEditSession` holds one session per side, not Appendix B's single page-level session across both tabs. Switching tabs with unsaved changes asks "Discard these changes?" with Keep Editing (stay on the tab) and Discard Changes (drop that tab's draft and switch) (TP-S3-R18); leaving the page asks the same question with the same buttons (TP-S19-R3). Both use F0's `DiscardChangesDialog`, whose buttons read Keep Editing and Discard Changes (PQ24). The Part Sale switch is disabled only while the Part Sale tab's own grid is in edit (Appendix B §10 item 28, made per tab): Work Order tab edits can't reach it, because switching tabs with unsaved changes asks first. Edit from the Matrices list, a tier's page or a category's page opens the Work Order Matrix tab in edit. Each save's response gives the new `rulesRevision`, so saving one tab never makes the other tab's next save stale. `validateDraft` uses the TP-S3-R6 messages listed under Phase 8. The save toast names up to three changes, then "and \<n\> more" (TP-S4-R12), for example "3 changes: Tier 5 is 28% margin; Default is 35% markup; 1 range added." A 409 `matrixChanged` keeps the draft and shows the TP-S19-E2 message inline with a Reload action. In the archived view, the simulator reflects unsaved edits to the archived columns.
- **Phase 14 (F4):** the New Tier name field and the tier page's editable title take `maxlength="50"`, so the field stops accepting characters at 50, paste included (TP-S2-R3).
- **Phase 16 (F6):** the New Category page's buttons are Save and Cancel (TP-S8-R10). The category name fields keep today's errors (TP-S8-N3; no reserved name since page 37). The Categories list hover (TP-S7-R2) lists each cost range on its own line ("$0.00 to $25.00: 35% markup"; the last, open range reads "\<start\> and up: …", as TP-S3-R16 words it) and reads "Uses previous tier, 2 · Wholesale." (or, through a chain, "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule.") for a "Uses previous tier" cell, worked out from the row's own tier columns (D29); the range lines load from the matrix's Work Order side on first hover (D31).
- **Phase 17 (F7):** the customer card's Pricing rows follow TP-S9-R12 word for word: Labor Rate with "Varies by location" when it differs at another location; Shop Supplies as "No shop supplies", the customer's own charge, or "Location default"; then Tax and the two tiers. The Tax row shows `tax.name` exactly as returned, or "Default Tax Settings" when it is null (TP-S9-R12). Move that label into one shared constant used here and by `CustomerDialog.vue`'s `local-default-tax-label` (line 260), so both screens say the same thing. The row never derives a label from the customer's exemption flags.
- **Browser-walks (as `admin` from `api/.env.local` QUICK_LOGIN_USERS):** Settings › Pricing tabs; a matrix page (view, edit, auto-fill, Mixed rules, Change All, General confirm, Default followers, archived view with its simulator, simulator, below-cost icon, switching tabs with unsaved changes, the same matrix saved from two browser sessions so the second is refused with typing kept, a save toast with more than three changes); New Tier → Set Rule → Undo; archive a tier with customers (blocked dialog → Remove Customers); Manage Customers Select All over > 50 customers; Categories list + category page + New Category + delete; Edit Customer tier fields with 1 vs 2+ active tiers; customer card Pricing section without an address, and its Tax row with a picked tax (its name) and without one ("Default Tax Settings"); a work order line priced by a tier that was then renamed (Priced by shows the new name; details read "Fleet (now Fleet Plus)"). As a role with 'Settings — Parts' but not 'See Financial Data': Settings › Pricing shows only Fixed Rules; Categories shows only the Category column.

**Phase 18 (Appendix B F10).** Delete `PricingMatrixDialog.vue`, `CategoryDialog.vue`, the `parts` Vuex pricing slots and `changePricingMatrix(data: unknown)`.
- **Release-B readiness:** before `/create-pr`, `grep -rn "pricing_rule\|PricingRule::TABLE_NAME" api/src` must show only `LegacyMatrixResync` and its command (Phase 1's static test enforces it), and the release-B ticket exists with the scope in Section 11.

### PRD wording per phase (sub-bullets pasted in Section 1)

Each phase builds these strings and cases as the PRD words them; the full text is under the requirement in Section 1.

| Phase | Requirement | What to build, in the PRD's words |
|---|---|---|
| 3 | TP-S10-R1, TP-S10-R4, TP-S10-R20 | The order and its pricing sources: "Manual", "Fixed price", "Tier, or Default when the customer is on Default". Markup: cost × (1 + markup); margin: cost ÷ (1 − margin); + $: cost plus the amount, per unit; % Off and $ Off off Default's price on the same side, $ Off never below $0.00; Same as previous tier: what the tier before it (by number) pays, following each in turn, ending at Default |
| 4 | TP-S11-R6 | Never reprice on: changes to tiers, matrices, rules or categories' matrices, Set Rule on a tier's page, Change All, the Part Sale switch and deleting a matrix; moving the customer to another tier; changing the customer |
| 5, 6 | TP-S12-R2 | Detail lines: the pricing source; the tier name; the matrix, its side (Work Order Matrix or Part Sale Matrix) and the rule (cost range and calculation); the cost used; the sell price; when it was priced; for % Off or $ Off, the Default price; where the part came from, "Inventory, bin \<bin\>" or "\<vendor\> - \<vendor bill #\>", with no line when neither applies. Focus returns to the price when they close |
| 8 | TP-S2-R8 | Not blocking a delete: a customer who was on the tier and was taken off before any part was priced; lines it priced that were later deleted. The Default tier can't be archived or deleted. Deleting a tier removes its column from every matrix |
| 8, 13 | TP-S3-R5, TP-S3-R6 | No value is negative; 0% markup or margin, + $0.00, 0% off and $0.00 off are allowed. A new matrix's name empty, under 3 or over 127 characters, or taken ignoring case: an inline error under the name. Ranges from before release with a gap or overlap block Save (TP-S1-E11) |
| 2, 8, 12, 14, 16 | TP-S4-R31 | Summary labels: one rule "35% markup", "30% margin", "Cost + $5", "10% off", "$5 off"; one type with different values "% markup", "% margin", "Cost + $", "% off", "$ off"; different types "Mixed rules". % Off and $ Off cells have no symbol picker |
| 8, 9, 10 | TP-S19-R8 | What each Audit Log entry records (D35); a deleted category is recorded with its name, matrix, QuickBooks mapping and the number of parts and lines moved to Uncategorized |
| 10, 15 | TP-S9-R4, TP-S9-R9 | Add Customers lists every customer not on the tier for at least one channel; Remove Customers lists those on it, with the count; each row shows the customer's current work order and Part Sales tiers. The Customers tab: search by customer name; a channel filter ("Work orders", "Part Sales", "Both"); customer name A to Z by default and a sortable channel column, ties broken by name; 50 a page; search, filters, sort and page kept |
| 15 | TP-S9-R18, TP-S9-N6 | The bar: "3 selected"; Select All with the number of customers in the list, while not every customer is ticked; a Work Orders and a Part Sales checkbox; the X. Empty states: 'No customer matches "…".' (a tier's Customers tab and Manage Customers); "Every customer is already on Fleet Platinum." (Add tab); "No customer is on Fleet Platinum yet." (Remove tab of an empty tier), with the tier's name for Fleet Platinum |
| 10, 17 | TP-S16-R4 | 'Customers — Create & Edit' views and changes tiers in Edit Customer and New Customer without 'Settings — Parts'; 'Customers — View' with 'View and Manage AP/AR Data' shows them read-only in the customer card's pricing section |

## 7. Testing Strategy

### Unit tests
- **Backend:** `TieredPriceCalculator` table-driven over every calculation and the shared vectors; `PartPriceResolver` cascade incl. Manual detection and the typed flags; `ReceiptRepricingPolicy` (the PRD's $2→$3 on a $4 part = $6; tier line repriced by its recorded tier after the customer moved); `SplitRepricer` keep/reprice matrix; fixed-line-total split (leftover cent on the first quantity-1 part in today's order, else labor; shares sum to the parts amount; all-$0 by quantity); `InvoicePartLineSnapshotBuilder` fixture matrix (plain, unreceived, partial receipt, cores resolved and unresolved, Part Sale core credit, environmental charge, declined line, return request, fixed total, flat and % part-line adjustments) asserting Σnet = `parts_sell`, Σcost = parts cost, every `core`, `core_credit` and `environmental_charge` row carrying its parent part's category, pricing source, tier and priced-for customer, and each part-line fee or discount in its part's `line_adjustment_cents`; domain invariants of `PricingMatrix` and `PricingTier`; `PricingTierName` (50 characters accepted, 51 refused, counted after trimming); `BelowCostDetector`; `RuleSummarizer`; audit factory budget; `parts/change` category change on received parts (Phase 4 list); price-details names when priced and now; grid save 409 `matrixChanged` and the TP-S3-R6 422 codes; Matrices list `categoryCount` sort.
- **Frontend:** engine vs shared vectors; below-cost analytic results at `c*` and `c*−1`; grid edit model (auto-fill, last-range follow, Same-as-previous fill, change count); Set Rule selection over unloaded rows; Manage Customers selection (skip counting, locked chips); price-details anchor (hover, Alt+Down, focus return); Parts table `th` count = `td` count per row in both modes and both permission states; vectors with three- and four-decimal costs and half-cent ties; one edit session per tab and the tab-switch Discard question; a save toast with more than three changes ("and \<n\> more"); the archived-view simulator, including a Same-as-previous column priced from the column to its left (Default for the first archived tier); both "Uses previous tier" hover texts (D29); the Categories hover lines; the tier name input stopping at 50; the Tax row (name verbatim, or "Default Tax Settings"); price details "Fleet (now Fleet Plus)" and Default by its current name.

### Integration tests
- Functional (backend) for every new repository/query repository with a **tenant-isolation case**; endpoint tests for every permission combination (both atoms required → 403 with one), foreign ids → 404, malformed input → 4xx, all-or-nothing writes (forced failure changes nothing).
- Invoice create/recompute/reversal → snapshot rows created/replaced/deleted.
- Migration tests for M2 against fixtures (renames, suffixes, rules → ranges parity, anomalies including a rule-less matrix with a category on it, category link rewrite, idempotent re-run), including a matrix whose first range starts above $0.00 (DQ6: 1,565 matrices; TP-S1-E12: the real start is kept and a cost below it prices by the first range's rule).
- Inventory Value SQL twin parity over every Default calculation type, using the shared vectors' half-cent ties, and a first range starting above $0.00 with a cost below it (TP-S1-E12).
- `GET /api/customers/{id}/pricing-summary` tax: no pick, a pick, tenant isolation.
- Audit fixes: `costTyped` (Phase 4/6 lists), active-view saves keeping archived cells (Phase 8), tier delete with only closed work orders and the reversed-invoice edge (Phase 8), the four D35 audit events (Phases 8 and 10), a $0.00 or empty cost (TP-S10-N1, Phase 4), sell-price previews without See Financial Data (Phase 6). Delta audit: a retyped same cost on the Parts tab and the $0.00 preview (Phase 6), the resync of a rule-less matrix (Section 4), the three entries per category move from every path (Phases 8 and 9).

### Manual testing checklist
1. Release-day: a client with untouched settings prices a new part exactly as before (except the rare half-cent ties, which now round up, TP-S10-R5); open work orders keep Default.
2. Put a customer on a tier → new work order prices by it; the open one doesn't.
3. Receive a tier-priced special-order part at a new cost → repriced by its recorded tier; a Default line keeps its margin.
4. Split a work order with a moved customer → moved lines repriced by the current tier; Manual/fixed lines keep their price.
5. Delete a category used on invoiced lines → lines move to Uncategorized; no QuickBooks re-send.
6. A user without See Financial Data sees no Priced by, no details, no Change Customer notice, and the API returns none.
7. Change the category of a received part on an open work order → repriced by the new category's matrix at the work order's tier; the same on an invoiced work order → price unchanged; a credit on that invoice uses the invoiced price.
8. Rename a tier used on lines → Priced by shows the new name and the details read "Fleet (now Fleet Plus)"; rename Default → the details show only the new name.
9. The customer card's Tax row shows the picked tax's name as named in Settings, or "Default Tax Settings".
10. An archived tier's Pricing tab → Edit → the simulator under the archived grid prices Default and the archived tiers.
11. Save the same matrix from two browser sessions → the second is refused with "\<matrix\> was changed by someone else. Reload to see their changes." and keeps its typing.
12. QuickBooks regression (TP-S18-R3): an invoice syncs each part to its line's category's item; a credit uses the inventory part's current category.
13. Open a part in the part dialog and change only its quantity → the unit price stays, a Manual price stays Manual; retype the same cost on a special-order part not yet received, in the dialog and on the Parts tab → it reprices; empty the cost → the sell price shows $0.00.
14. As a user without See Financial Data, change an inventory part's category in the inventory part dialog → no Access Denied page.

## 8. Rollback Plan

- **The previous release keeps working.** Every schema change is additive (Section 4). Old code never reads the new tables or columns; rows it writes get NULL = Default / before tiers; an old invoice reversal cascades the snapshot rows. The frozen `pricing_rule` rows and `pricing_matrix.categories` let old code price on rollback — by **release-day** rules (edits made after release are not visible to it): stale, but no errors.
- **Matrix renames** ("General Matrix", " (2)", " (old)") are plain names to old code.
- **Removals are split.** Release A stops using `pricing_rule` and `pricing_matrix.categories` everywhere except the one-shot resync, so release B can drop them while release A still serves (B's migrations run before B's tasks start) and after a rollback from B to A:
  - **Matrix delete:** M1 drops `FK_6DCEA672AA000BE7`, so `DoctrinePricingMatrixRepository::remove()` no longer deletes legacy rows first.
  - **Duplicate-part cleanup:** `DbalDuplicatePartCleanupRepository` stops reading and re-pointing `pricing_rule` in release A: drop `[PricingRule::TABLE_NAME, 'part_id', 'parent']` from `PART_REFERENCES` and its tenant-scope entry, delete `countPricingRules()` (and its interface method), `DuplicatePartRemovalResultDto::survivorPricingRuleCount` / `survivorHasConflictingPricingRules()` and the warning in `DeleteDuplicateInventoryPartCommand` (lines ~282–288). Nothing reads part-specific legacy rows (`RuleType` has only `markup_for_interval`, `PricingRulesRepository::findFixedPriceRule()` has no caller), and no foreign key points from `pricing_rule.part_id` to `part`, so a removed duplicate leaves at most a dangling id in a frozen, unread table. This replaces Appendix A §2.1's "string constant until release B".
  - **Resync:** guarded on the table and column existing; run once in release A's deploy window.
  - **Release B** (create the ticket with this PR, "Drop `pricing_rule` and `pricing_matrix.categories` (step 2 of 2)", and list it in Section 11): drops the table and the column, removes `ResyncLegacyMatricesCommand` and `LegacyMatrixResync`, the `schema_filter` and `PENDING_DROP_COLUMNS` entries, and any legacy code kept only for the resync.
- **Rolling forward again** after a rollback, while release A is current: run `ResyncLegacyMatricesCommand` (it re-copies matrices never saved in the new model; a rule-less one gets the General Matrix's current ranges, as M2 gives it, TP-S1-R9).

## 9. Performance & Security Considerations

### Performance
- **Pricing lookup (TP-S10-R22, NFR-005):** per request per client, at most three indexed queries — category→matrix map (`pc__organization_id_idx`, ~270 rows), one matrix side's ranges + cells (`pmr__matrix_id_side_start_cents_unq`, `pmtr__range_id_tier_id_unq`, ~20 + 200 rows), tiers (~20 rows) — then memoized in `PartPriceResolver` (reset between Messenger messages). Batch loads for canned lines, split, the part picker and inventory lists. Computation is O(ranges + chain). A `calculate-sell-price` call with `partNumber` (D32) adds the one catalog lookup the save already runs.
- **Tier usage counts (TP-S2-R8/R13):** `wopr__pricing_tier_id_pricing_source_idx`, `wop__pricing_tier_id_pricing_source_idx` on 1.4M / 1.2M-row tables; `wo__pricing_tier_id_status_idx` for open orders. Grey-out uses EXISTS; counts only for the tooltip.
- **Customers per tier:** `c__org_work_order_pricing_tier_part_sales_pricing_tier_idx` (covering GROUP BY); Manage Customers search is a client-bounded `LIKE` (accepted for a settings surface).
- **Categories list:** one summary query over the page's matrices — no N+1.
- **Categories list hover (TP-S7-R2, D31):** the range lines load one matrix's Work Order side on first hover (≤ 20 ranges × active tiers, through `pmr__matrix_id_side_start_cents_unq`), cached per matrix; the list stays one summary query.
- **Snapshot:** ≈ 1–1.3M rows after the reports backfill (~0.5 GB with indexes); written inside the invoice transaction from the same pricing DTO (no extra line queries); `ipl__work_place_id_invoice_created_on_invoice_id_idx` serves the reports' window.
- **Audit:** existing `ee__organization_id_entity_type_entity_id_occurred_at_id_idx`; no new index on the 8.85M-row table; payload budget (NFR-008).
- **Set Rule / Undo / category delete:** set-based statements, one transaction; category delete moves lines with set-based UPDATEs (the per-entity loop in `PartRequestModifier` is replaced).
- **Reader or writer:** every new read here is on the **writer** — the resolver runs inside write flows and TP-S10-E3 needs the configuration just saved; settings lists and details are refetched right after saves; usage counts gate deletes. The reports PR reads the snapshot from the reader. No FE refetch-after-mutation issue arises because nothing new reads the replica.
- **Known risks:** 88 test files reference the retired pricing code (churn); the snapshot reconciliation may surface existing cost-basis differences as ERROR logs (the fixture matrix is meant to catch them first); the part picker stays on the writer per SV-12153/12152.

### Security
- **Tenant scoping (NFR-002):** every new query is scoped by client (tiers, matrices, categories, company, `entity_event`) or by client + location (snapshot); line tables through `work_order.organization_id/workplace_id`. Inbound ids via scoped `#[MapEntity]` (checked by `UnscopedRepositoryLookupRatchetTest`) or constraint validators.
- **Authorization (NFR-004, TP-S16):** new atom + `ROLE_PRICING::VIEW` on every settings endpoint; customer endpoints per Section 5; `calculate-sell-price` gated; refusals return "Access restricted" (TP-S16 error handling).
- **Masking (NFR-003, TP-S16-R5, TP-S10-N2):** pricing source, Priced by, price details and the Change Customer count are absent for users without See Financial Data; "Manual" only when the user can change pricing.
- **Fleet-wide migration:** M2 + catch-up command touch every client, each statement scoped per client under `runAs()` — Golden Rule sign-off (D25).
- **Reports exception (TP-S16-R7):** the reports show cost/margin to anyone with 'Reports — Page Access' by Product decision (reports plan).

## 10. Requirement Traceability

Generated from Section 1 by story. Files: the phase's appendix section lists every file.

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| TP-S1-R1 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R9 | Phase 1 | API | Appendix A §P1; Section 4 (v35: a rule-less matrix gets a copy of the General Matrix's rules on release day; the post-deploy resync keeps it) | Planned |
| TP-S1-R10 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R11 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R2 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R3 | Phase 1 | API | Appendix A §P1 (v35: half-cent ties round up from release day, TP-S10-R5) | Planned |
| TP-S1-R3 | Phase 4 | API | Appendix A §P3; Section 6 Phase 4 (v35: received parts also reprice when their category changes, TP-S11-R3) | Planned |
| TP-S1-R6 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R7 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-R8 | Release | Docs | What's New via `/release-note` at the `.0` release; client email by Product | Planned |
| TP-S1-N1 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E1 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E2 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E3 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E9 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E11 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E12 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S1-E13 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S2-R1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R1 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R25 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R25 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R3 | Phase 8 | API | Appendix A §P5; Section 6 Phases 1 and 8 (v33: up to 50 characters after trimming, `pricing_tier.name` VARCHAR(50), 422 `tooLong`) | Planned |
| TP-S2-R3 | Phase 14 | App | Appendix B §F4; Section 6 Phase 14 (v33: the name field stops accepting characters at 50) | Planned |
| TP-S2-R15 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R15 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R17 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R17 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R29 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R29 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R18 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R18 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R5 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R6 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R6 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R26 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R26 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R30 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R30 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R7 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R7 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R12 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R12 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R8 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R13 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R13 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R14 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R14 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R28 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R28 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R20 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R20 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R22 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R22 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R23 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R23 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R24 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R24 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-R27 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-R27 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-N7 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-N7 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-N8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-N8 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-E2 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-E2 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S2-E5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S2-E5 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S3-R18 | Phase 8 | API | Appendix A §P5 (v33: one side per save, so each tab saves on its own) | Planned |
| TP-S3-R18 | Phase 12 | App | Appendix B §F2 (v33: each tab has its own Edit, Save and Cancel) | Planned |
| TP-S3-R18 | Phase 13 | App | Appendix B §F3 (v35: one edit session per tab; switching tabs with unsaved changes asks "Discard these changes?" with Keep Editing and Discard Changes; see Section 6 Phase 13) | Planned |
| TP-S3-R25 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R25 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R25 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R26 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R26 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R26 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R13 | Phase 8 | API | Appendix A §P5 (audit entries per D35) | Planned |
| TP-S3-R13 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R13 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R28 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R28 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R28 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R5 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R5 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R20 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R20 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R20 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R6 | Phase 8 | API | Appendix A §P5 (v33: 422 codes per cell for "Enter a value", "Enter an end above \<start\>", "Use at most two decimals", "Enter a margin from 0 to 99.99"; Section 5) | Planned |
| TP-S3-R6 | Phase 12 | App | Appendix B §F2 (v33: cell messages as worded in the PRD) | Planned |
| TP-S3-R6 | Phase 13 | App | Appendix B §F3 (v33: `validateDraft` uses the PRD messages; Section 6 Phase 13) | Planned |
| TP-S3-R16 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R16 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R16 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R32 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R32 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R32 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R23 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R23 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R23 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R30 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R30 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R30 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R21 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R21 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R21 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R31 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R31 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R31 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R27 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R27 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R27 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R8 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R8 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R9 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R9 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R9 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-R12 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-R12 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-R12 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-N3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-N3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-N3 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-N4 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-N4 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-N4 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-E3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-E3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-E3 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S3-E4 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S3-E4 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S3-E4 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R1 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R1 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R27 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R27 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R27 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R3 | Phase 12 | App | Appendix B §F2 (v35: "Uses previous tier, 2 · Wholesale."; through a chain, "… Priced by 2 · Wholesale's rule.", D29) | Planned |
| TP-S4-R3 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R4 | Phase 8 | API | Appendix A §P5 (v33: per-side save) | Planned |
| TP-S4-R4 | Phase 12 | App | Appendix B §F2 (v33: Edit per tab) | Planned |
| TP-S4-R4 | Phase 13 | App | Appendix B §F3 (v33: the edit bar and change count belong to the tab being edited) | Planned |
| TP-S4-R5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R5 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R5 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R28 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R28 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R28 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R31 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R31 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R31 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R29 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R29 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R29 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R7 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R7 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R7 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R26 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R26 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R26 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R10 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R10 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R10 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R12 | Phase 8 | API | Appendix A §P5 (v33: the toast is built in the browser; the API saves one side) | Planned |
| TP-S4-R12 | Phase 12 | App | Appendix B §F2 (changed-cell highlight) | Planned |
| TP-S4-R12 | Phase 13 | App | Appendix B §F3 (v33: the toast names up to three changes, then "and \<n\> more"; Section 6 Phase 13) | Planned |
| TP-S4-R20 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R20 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R20 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R15 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R15 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R15 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R30 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R30 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R30 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R16 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R16 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R16 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R22 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R22 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R22 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R18 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R18 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R18 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-R19 | Phase 8 | API | Appendix A §P5 (v36: `?view=archived` returns Default, then archived tiers by archive date, earliest first, D30; Section 5) | Planned |
| TP-S4-R19 | Phase 12 | App | Appendix B §F2 (v36: archived columns by archive date, earliest first; the Price Part Simulator shows under the archived grid; a Same-as-previous column follows the column to its left, D30; Section 6 Phase 12) | Planned |
| TP-S4-R19 | Phase 13 | App | Appendix B §F3 (v33: the archived simulator reflects unsaved archived edits) | Planned |
| TP-S4-R32 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-R32 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-R32 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-N1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-N1 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-N1 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S4-E3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S4-E3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S4-E3 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S5-R1 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R1 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-R2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R2 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-R3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-R4 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R4 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-R5 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R5 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-R6 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-R6 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S5-N1 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S5-N1 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S6-R11 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R11 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R1 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R10 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R10 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R8 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R7 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R7 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R9 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R9 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R2 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R2 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S6-R3 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S6-R6 | Phase 8 | API | Appendix A §P5 (v33: `sortBy=categoryCount`, the number of categories, most first on the first click; Section 5) | Planned |
| TP-S6-R6 | Phase 11 | App | Appendix B §F1 (v33: Categories column sorts by count, highest first on the first click) | Planned |
| TP-S7-R1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R1 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R2 | Phase 9 | API | Appendix A §P6 (v33: rows carry `matrixId`; the hover's range lines come from the matrix detail, D31) | Planned |
| TP-S7-R2 | Phase 16 | App | Appendix B §F6; Section 6 Phase 16 (v35: each cost range on its own line, "$0.00 to $25.00: 35% markup"; "Uses previous tier, 3 · Fleet. Priced by 2 · Wholesale's rule.", D29) | Planned |
| TP-S7-R4 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R4 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R6 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R6 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R13 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R13 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R15 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R15 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R14 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S7-R12 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R12 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R9 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R9 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-R11 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-R11 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S7-N1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S7-N1 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-R1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-R1 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-R10 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-R10 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-R3 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-R3 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-R4 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-R4 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-R8 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-R8 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-N3 | Phase 9 | API | Appendix A §P6 (v37: unique ignoring capitals, at least 3 characters, as today; no reserved name) | Planned |
| TP-S8-N3 | Phase 16 | App | Appendix B §F6 (v37: today's duplicate-name and length errors only) | Planned |
| TP-S8-E1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-E1 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S8-E2 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S8-E2 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S9-R1 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R1 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R1 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R2 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R2 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R2 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R3 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R3 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R3 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R31 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R31 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R31 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R30 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R30 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R30 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R12 | Phase 10 | API | Appendix A §P7; Section 6 Phase 10 (v33: `tax:{taxId, name}` from `tax_company` and `tax`) | Planned |
| TP-S9-R12 | Phase 15 | App | Appendix B §F5 (no Tax row on this surface) | Planned |
| TP-S9-R12 | Phase 17 | App | Appendix B §F7; Section 6 Phase 17 (v33: the tax's name as named in Settings, or "Default Tax Settings") | Planned |
| TP-S9-R14 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R14 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R14 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R15 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R15 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R15 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R16 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R16 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R16 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R4 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R4 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R4 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R17 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R17 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R17 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R18 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R18 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R18 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R19 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R19 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R19 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R20 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R20 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R20 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R21 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R21 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R21 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R22 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R22 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R22 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R23 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R23 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R23 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R24 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R24 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R24 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R5 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R5 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R5 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R7 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R7 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R7 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R27 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R27 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R27 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R8 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R8 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R8 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R9 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R9 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R9 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R10 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R10 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R10 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-R11 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-R11 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-R11 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-N1 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-N1 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-N1 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-N3 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-N3 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-N3 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-N6 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-N6 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-N6 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-E2 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-E2 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-E2 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-E3 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-E3 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-E3 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-E5 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-E5 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-E5 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-E7 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-E7 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-E7 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S9-E6 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S9-E6 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S9-E6 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S10-R1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R1 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R17 | Phase 3 | API | Appendix A §P2 (category → matrix) | Planned |
| TP-S10-R17 | Phase 4 | API | Appendix A §P3; Section 6 Phase 4 (v33: a typed part number matching a catalog part is priced by that part's own category, D32) | Planned |
| TP-S10-R17 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R17 | Phase 6 | App | Appendix B §F8; Section 6 Phase 6 (v33: the add-row preview passes `partNumber`, D32) | Planned |
| TP-S10-R18 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R18 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R19 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R19 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R20 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R20 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R21 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R21 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R2 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R3 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R4 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R4 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R5 | Phase 3 | API | Appendix A §P2; D23 (v33: exact half away from zero, one rounding step from the cost in cents; the SQL twin and the snapshot agree) | Planned |
| TP-S10-R5 | Phase 2 | App | Appendix B §F0; D23 (v33: BigInt engine; shared vectors with four-decimal costs and half-cent ties) | Planned |
| TP-S10-R15 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R15 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R6 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R6 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R7 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R7 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R11 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R11 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R16 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R16 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R12 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R12 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R13 | Phase 3 | API | Appendix A §P2; Section 6 Phase 3 (v33: leftover cent on a quantity-1 part, else the line's labor, as `FixedLineTotal::calculatePrices()` does today) | Planned |
| TP-S10-R13 | Phase 2 | App | Appendix B §F0 (the split is computed by the API) | Planned |
| TP-S10-R14 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R14 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-R22 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-R22 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-N1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-N1 | Phase 4 | API | Appendix A §P3; Section 6 Phase 4 (v35: a cost edited to $0.00 also sets the sell price to $0.00) | Planned |
| TP-S10-N1 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-N1 | Phase 6 | App | Appendix B §F8; Section 6 Phase 6 (v35: a cost emptied or set to $0.00 previews $0.00, or the fixed price) | Planned |
| TP-S10-N2 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-N2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E2 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E3 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E4 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E4 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E7 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E7 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E5 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E5 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E6 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E6 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S10-E8 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S10-E8 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S11-R1 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R1 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R2 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R2 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R16 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R16 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R12 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R12 | Phase 6 | App | Appendix B §F8; Section 6 Phase 6 (a retyped same cost reprices from the part dialog, the inline row, the Parts tab and the Part Sale parts table; a tab-through doesn't) | Planned |
| TP-S11-R3 | Phase 4 | API | Appendix A §P3; Section 6 Phase 4 (v33: a received part reprices on a category change too) | Planned |
| TP-S11-R3 | Phase 6 | App | Appendix B §F8 (v33: the row takes the new price from the `parts/change` response) | Planned |
| TP-S11-R4 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R4 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R5 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R5 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R6 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R6 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R7 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R7 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R14 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R14 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R8 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R8 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R9 | Phase 4 | API | Appendix A §P3; Section 6 Phase 4 (v35: parts already received also reprice when their category changes, TP-S11-R3) | Planned |
| TP-S11-R9 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R15 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R15 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-R10 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-R10 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-N1 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-N1 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-N2 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-N2 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-E2 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-E2 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-E8 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-E8 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-E7 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-E7 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-E5 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-E5 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S11-E6 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S11-E6 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R1 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R1 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R10 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R10 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R2 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R2 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R18 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R18 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R12 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R12 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R3 | Phase 5 | API | Appendix A §P4 (v33: `pricedBy.label` is the tier's current name) | Planned |
| TP-S12-R3 | Phase 6 | App | Appendix B §F8 (v33: Priced by shows the current name) | Planned |
| TP-S12-R4 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R4 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R15 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R15 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R19 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R19 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R17 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R17 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R5 | Phase 5 | API | Appendix A §P4; Section 5 (v33: details return the name when priced and the current name) | Planned |
| TP-S12-R5 | Phase 6 | App | Appendix B §F8; Section 6 Phase 6 (v33: "Fleet (now Fleet Plus)"; Default always its current name) | Planned |
| TP-S12-R6 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R6 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R7 | Phase 5 | API | Appendix A §P4 (v33: price details carry no part status) | Planned |
| TP-S12-R7 | Phase 6 | App | Appendix B §F8 (v33: the Parts and Lines tables keep today's status; Priced by and details show none) | Planned |
| TP-S12-R8 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R8 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-R9 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-R9 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-N2 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-N2 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-N3 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-N3 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S12-E1 | Phase 5 | API | Appendix A §P4 | Planned |
| TP-S12-E1 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S13-R1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S13-R1 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S13-R1 | Phase 6 | App | Appendix B §F8 | Planned |
| TP-S13-E1 | Phase 4 | API | Appendix A §P3 (Change Customer on a Part Sale) | Planned |
| TP-S13-E1 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S14-R2 | Phase 4 | API | Appendix A §P3 (v33: `linesPricedForPreviousCustomer` absent without See Financial Data) | Planned |
| TP-S14-R2 | Phase 7 | App | Appendix B §F9 (v33: no notice without See Financial Data) | Planned |
| TP-S14-R3 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S14-R3 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S14-R4 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S14-R4 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S14-R5 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S14-R5 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S14-N1 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S14-N1 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S14-E1 | Phase 4 | API | Appendix A §P3 | Planned |
| TP-S14-E1 | Phase 7 | App | Appendix B §F9 | Planned |
| TP-S15-R5 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-R5 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S15-R2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-R2 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S15-R3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-R3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S15-N3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-N3 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S15-N4 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-N4 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S15-N5 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S15-N5 | Phase 12 | App | Appendix B §F2 | Planned |
| TP-S16-R6 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R6 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R6 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R6 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-R2 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R2 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R2 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R2 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-R4 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R4 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R4 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R4 | Phase 17 | App | Appendix B §F7 | Planned |
| TP-S16-R8 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R8 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R8 | Phase 16 | App | Appendix B §F6 | Planned |
| TP-S16-R5 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R5 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R5 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-R11 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-R11 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-R11 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-R11 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-R7 | Reports PR | — | Delivered by the Sales by Tier and Sales by Category plan and PR, not this one | Reports PR |
| TP-S16-N1 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-N1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-N1 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-N1 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-N4 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-N4 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-N4 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-N4 | Phase 11 | App | Appendix B §F1 | Planned |
| TP-S16-N5 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-N5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-N5 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-N5 | Phase 15 | App | Appendix B §F5 | Planned |
| TP-S16-E1 | Phase 1 | API | Appendix A §P1 | Planned |
| TP-S16-E1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S16-E1 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S16-E1 | Phase 14 | App | Appendix B §F4 | Planned |
| TP-S17-R1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S17-R2 | Reports PR | — | Delivered by the reports PR; this PR only writes the snapshot it reads (Phase 3, D12) | Reports PR |
| TP-S17-R5 | Reports PR | — | Delivered by the reports PR; this PR only writes the snapshot it reads (Phase 3, D12) | Reports PR |
| TP-S17-R3 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S17-N1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S17-E1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-R1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-R1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S18-R3 | Phase 3 | API | No code change (v33: books by the line's category; credits and refunds by the inventory part's current category, as today); regression check in Section 7 | Planned |
| TP-S18-R3 | Phase 9 | API | No code change; category delete keeps today's QuickBooks handling (TP-S18-R5); regression check in Section 7 | Planned |
| TP-S18-R5 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-R5 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S18-R6 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-R6 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S18-R4 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-R4 | Phase 9 | API | Appendix A §P6 (v37: the Open API is unchanged) | Planned |
| TP-S18-N1 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-N1 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S18-N2 | Phase 3 | API | Appendix A §P2 | Planned |
| TP-S18-N2 | Phase 9 | API | Appendix A §P6 | Planned |
| TP-S19-R1 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R1 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R1 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R1 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R13 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R13 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R13 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R13 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R14 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R14 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R14 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R14 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R14 | Phase 14 | App | Appendix B §F4 (New Tier, tier page) | Planned |
| TP-S19-R14 | Phase 16 | App | Appendix B §F6 (New Category, category page) | Planned |
| TP-S19-R15 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R15 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R15 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R15 | Phase 12 | App | Appendix B §F2; Section 6 Phase 12 (info tooltips: Price Part Simulator, Cost Range; "how a price is found" per the canvas) | Planned |
| TP-S19-R15 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R3 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R3 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R3 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R3 | Phase 13 | App | Appendix B §F3 (v35: Keep Editing / Discard Changes) | Planned |
| TP-S19-R3 | Phase 16 | App | Appendix B §F6 (New Category page) | Planned |
| TP-S19-R5 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R5 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R5 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R5 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R6 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R6 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R6 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R6 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R6 | Phase 14 | App | Appendix B §F4 (New Tier, tier page) | Planned |
| TP-S19-R6 | Phase 16 | App | Appendix B §F6 (New Category, category page) | Planned |
| TP-S19-R7 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R7 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R7 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R7 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R10 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R10 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R10 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R10 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R8 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R8 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R8 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R8 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R12 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R12 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R12 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R12 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R19 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R19 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R19 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R19 | Phase 11 | App | Appendix B §F1 (Matrices list) | Planned |
| TP-S19-R19 | Phase 12 | App | Appendix B §F2 (matrix page) | Planned |
| TP-S19-R19 | Phase 14 | App | Appendix B §F4 (Tiers list, tier row and page) | Planned |
| TP-S19-R19 | Phase 16 | App | Appendix B §F6 (Categories list, category page) | Planned |
| TP-S19-R20 | Phase 8 | API | Appendix A §P5; Section 6 Phase 8 (D35: three entries per category move, Categories line and New Matrix) | Planned |
| TP-S19-R20 | Phase 9 | API | Appendix A §P6; Section 6 Phase 9 (D35: the same three entries from a category's own page) | Planned |
| TP-S19-R20 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R20 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R20 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R21 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R21 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R21 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R21 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R22 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R22 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R22 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R22 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R23 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R23 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R23 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R23 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R18 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R18 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R18 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R18 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-R9 | Phase 8 | API | Appendix A §P5 | Planned |
| TP-S19-R9 | Phase 10 | API | Appendix A §P7 | Planned |
| TP-S19-R9 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-R9 | Phase 13 | App | Appendix B §F3 | Planned |
| TP-S19-E2 | Phase 8 | API | Appendix A §P5 (v33: 409 `matrixChanged` "\<matrix\> was changed by someone else. Reload to see their changes."; Section 5) | Planned |
| TP-S19-E2 | Phase 10 | API | Appendix A §P7 (409 conflicts name the conflict) | Planned |
| TP-S19-E2 | Phase 2 | App | Appendix B §F0 | Planned |
| TP-S19-E2 | Phase 13 | App | Appendix B §F3 (v33: a refused save keeps everything typed and shows the message inline with Reload) | Planned |
| NFR-001 | Phase 3 | API | Appendix A §P2 | Planned |
| NFR-002 | Phase 1 | API | Appendix A §P1 | Planned |
| NFR-002 | Phase 3 | API | Appendix A §P2 | Planned |
| NFR-002 | Phase 8 | API | Appendix A §P5 | Planned |
| NFR-002 | Phase 9 | API | Appendix A §P6 | Planned |
| NFR-002 | Phase 10 | API | Appendix A §P7 | Planned |
| NFR-003 | Phase 5 | API | Appendix A §P4 | Planned |
| NFR-003 | Phase 6 | App | Appendix B §F8 | Planned |
| NFR-004 | Phase 1 | API | Appendix A §P1 | Planned |
| NFR-004 | Phase 8 | API | Appendix A §P5 | Planned |
| NFR-005 | Phase 3 | API | Appendix A §P2 | Planned |
| NFR-006 | Phase 2 | App | Appendix B §F0; D23 (Product confirmed, PQ19) | Planned |
| NFR-006 | Phase 3 | API | Appendix A §P2; D23 (Product confirmed, PQ19) | Planned |
| NFR-007 | Phase 3 | API | Appendix A §P2; Section 6 Phase 3 (core, core credit and environmental rows and single-part fees follow the part, reports PRD page 18 S1-R3/S1-R9) | Planned |
| NFR-008 | Phase 8 | API | Appendix A §P5 | Planned |
| NFR-009 | Phase 1 | API | Appendix A §P1; Section 6 Phase 1 and Section 8 (release A stops using `pricing_rule`) | Planned |
| NFR-009 | Phase 18 | App | Section 6 Phase 18 (release-B readiness check) | Planned |
| NFR-010 | Phase 8 | API | Appendix A §P5 | Planned |
| NFR-010 | Phase 10 | API | Appendix A §P7 | Planned |
| NFR-010 | Phase 11 | App | Appendix B §F1 | Planned |
| NFR-010 | Phase 15 | App | Appendix B §F5 | Planned |
| NFR-011 | Phase 4 | API | Appendix A §P3 | Planned |
| NFR-011 | Phase 6 | App | Appendix B §F8 | Planned |

## 11. Verification Tickets

Created 2026-11-12 under epic SV-11692, all assigned to Stefan Vukovic (Product Area: Parts, label `tiered-pricing`), each linked to its stories with "Relates". Each ticket's description lists the requirement IDs it covers and its verification checklist. Phase 2 has no screen of its own, so its checks sit in the Phases 2 and 12 ticket.

| Ticket | Phase(s) | Summary | Linked stories |
|---|---|---|---|
| [SV-12665](https://shopview.atlassian.net/browse/SV-12665) | 1 | Verify: release-day migration, Default tier, General Matrix rename and the new permission atom (Phase 1) | SV-11693, SV-11705 |
| [SV-12666](https://shopview.atlassian.net/browse/SV-12666) | 3 | Verify: tier-aware price resolver, exact rounding, fixed line totals and the invoice part-line snapshot (Phase 3) | SV-11699, SV-11701, SV-11702, SV-11706, SV-11707 |
| [SV-12667](https://shopview.atlassian.net/browse/SV-12667) | 4 | Verify: every add, edit, receive, split and Change Customer path prices by the work order's tier (Phase 4) | SV-11693, SV-11699, SV-11700, SV-11702, SV-11703 |
| [SV-12668](https://shopview.atlassian.net/browse/SV-12668) | 5 | Verify: lines record what priced them, and the API withholds it without See Financial Data (Phase 5) | SV-11699, SV-11701 |
| [SV-12669](https://shopview.atlassian.net/browse/SV-12669) | 6 | Verify: Priced by column, price details, Manual icon, tier-aware add paths and the receive notice (Phase 6) | SV-11697, SV-11699, SV-11700, SV-11701, SV-11702, SV-11705, SV-11709 |
| [SV-12670](https://shopview.atlassian.net/browse/SV-12670) | 7 | Verify: Change Customer dialog pricing copy, amber tier note and lines-priced notice (Phase 7) | SV-11702, SV-11703 |
| [SV-12671](https://shopview.atlassian.net/browse/SV-12671) | 8 | Verify: tiers and matrices API, including grid saves, Set Rule, Undo, tier delete and audit entries (Phase 8) | SV-11693, SV-11694, SV-11695, SV-12456, SV-11696, SV-11705, SV-11709 |
| [SV-12672](https://shopview.atlassian.net/browse/SV-12672) | 9 | Verify: categories API, category moves, category delete and category audit entries (Phase 9) | SV-12458, SV-11704, SV-11707, SV-11709 |
| [SV-12673](https://shopview.atlassian.net/browse/SV-12673) | 10 | Verify: customer tier API, Manage Customers bulk saves and the pricing Audit Log reads (Phase 10) | SV-11697, SV-11705, SV-11709 |
| [SV-12674](https://shopview.atlassian.net/browse/SV-12674) | 11 | Verify: Settings › Pricing tabs, the Parts menu order and the Matrices list (Phase 11) | SV-11695, SV-11696, SV-12458, SV-11705, SV-11709 |
| [SV-12675](https://shopview.atlassian.net/browse/SV-12675) | 2, 12 | Verify: pricing engine, matrix page in view, Price Part Simulator and below-cost warning (Phases 2 and 12) | SV-11695, SV-12456, SV-12457, SV-11699, SV-11708, SV-11709 |
| [SV-12676](https://shopview.atlassian.net/browse/SV-12676) | 13 | Verify: grid editing, New Matrix, save questions, archived-view editing and the discard guard (Phase 13) | SV-11693, SV-11695, SV-12456, SV-12458, SV-11709 |
| [SV-12677](https://shopview.atlassian.net/browse/SV-12677) | 14 | Verify: Tiers list, tier page, archive, delete, reactivate and Set Rule with Undo (Phase 14) | SV-11694, SV-11705, SV-11709 |
| [SV-12678](https://shopview.atlassian.net/browse/SV-12678) | 15 | Verify: a tier's Customers tab and Manage Customers add and remove (Phase 15) | SV-11694, SV-11697, SV-11705 |
| [SV-12679](https://shopview.atlassian.net/browse/SV-12679) | 16 | Verify: Categories list, category page, New Category, name rules and category delete (Phase 16) | SV-12458, SV-11704, SV-11705, SV-11709 |
| [SV-12680](https://shopview.atlassian.net/browse/SV-12680) | 17 | Verify: customer tier fields in New and Edit Customer and the customer card's Pricing section (Phase 17) | SV-11697, SV-11705, SV-11709 |
| [SV-12681](https://shopview.atlassian.net/browse/SV-12681) | 18 | Verify: legacy matrix and category dialogs removed and old pricing routes gone (Phase 18) | SV-11694, SV-11695, SV-12456, SV-12457, SV-11697, SV-11705, SV-11709 |
| [SV-12682](https://shopview.atlassian.net/browse/SV-12682) | release B | Drop `pricing_rule` and `pricing_matrix.categories` (step 2 of 2) | SV-11693 |

The release-B ticket "Drop `pricing_rule` and `pricing_matrix.categories` (step 2 of 2)" is [SV-12682](https://shopview.atlassian.net/browse/SV-12682); link it from this PR's description and the `PENDING_DROP_COLUMNS` comment. Scope: drop the table and the column; remove `ResyncLegacyMatricesCommand`, `LegacyMatrixResync`, the `schema_filter` and `PENDING_DROP_COLUMNS` entries and any legacy code kept only for the resync. Release A already uses neither store outside the resync (Section 8), so the drop is safe while release A serves and after a rollback to it.

When all these tickets are marked Done, the feature is ready for QA.

---

## Appendix A — Backend design (be-planner, 2026-11-11)

> **Read with Sections 3, 5 and 9, which win on any conflict.** Endpoint paths here are superseded by Section 5 (`/api/pricing/...` namespace, camelCase rule types, per-side grid save `PUT /api/pricing/matrices/{id}/sides/{side}/rules`, `pricedBy:{source,label}`).
> **Decision ids:** this appendix's §4 "Decisions needed" numbers its own recommendations D1–D13 (cited in the text as "decision Dn"); elsewhere "Dn" means the plan decisions D4–D12 the planner was given. Mapping of the planner's D1–D13 to the plan: D1→D14, D2→D15, D3→D23 (exact math, user-confirmed, Product confirmed in PQ19), D4→**overridden by D23** (simulator and below-cost computed in the browser; with PQ19 confirmed, the `evaluate` endpoint is not built), D5→D16, D6→D26, D7→D17, D8→D10 (PQ9: today's leftover-cent rule), D9→D27, D10→D18, D11→D25, D12→Section 9 (writer), D13→D18.
> **Product-visible ambiguities** in its §4 were routed to Product as PQ7 (A2), PQ8 (A3), PQ9 (A5), PQ10 (A6), PQ11 (A8), PQ19 (A1); A4 posted as FYI; A7 is explicit in TP-S11-R5 (build as written); A9 is moot (no duplicates in prod, DQ3); A10 is settled by the reports PRD (page 18, S1-R3 and S1-R9): core, core credit and environmental rows and single-part fees follow the part (Section 6 Phase 3); A11 is settled by TP-S1-R9 (page 35, PQ26; Section 4); A13 follows TP-S19-R8.
> **Audit fixes (2026-11-11) also supersede this appendix:** cost reprices only with `costTyped` (D19, Section 6 Phase 4); a grid save writes only the columns its view shows, so §5.2's "Tiers absent from `tiers` = Same as previous" is replaced by D36; a tier delete clears the kept tier on work orders that aren't open (D33); `calculate-sell-price` is non-ejecting and skipped without See Financial Data (D34); audit event triggers per D35; `PricingRulesApplier` is referenced from 16 files with 40 static calls, not 11 call sites. Delta audit (2026-11-12): `LegacyMatrixResync` copies the General Matrix's current ranges into a rule-less matrix instead of its empty legacy set (Section 4); category moves write D35's three entries from every path. Release A stops using `pricing_rule` outside the guarded resync: M1 drops `FK_6DCEA672AA000BE7`, the duplicate cleanup leaves the table, and release B removes the resync with the table (Section 8).
> **Product round 1 (PRD page version 33) answered PQ1–PQ19; where this appendix differs, Sections 3, 5 and 6 supersede it:** PQ2 takes Branch A (a received part reprices on a category change; Phase 4); PQ3's reservation was withdrawn in page 37, so P6's Branch B (no reservation) applies (D28 withdrawn); PQ5 makes `pricing_tier.name` VARCHAR(50), not 100; PQ6 makes `pricing-summary.tax` `{taxId, name}`, not raw exemption flags; PQ9 puts the leftover cent on the first quantity-1 part in today's order, else labor, with truncated unit prices, not §2.4 steps 3–4 (Phase 3); PQ17 and PQ22 put a simulator under the archived grid, whose Same-as-previous columns follow the column to their left (D30); PQ19 drops the `evaluate` endpoint; PQ10, PQ11 and PQ13 fix the 409 and 422 bodies and the `categoryCount` sort (Section 5); A1–A3, A5, A6 and A8 are answered by PQ19, PQ7, PQ8, PQ9, PQ10 and PQ11.

### Tiered Pricing: backend (`api/`) implementation plan

This is a read-only plan: no code was edited. Paths are relative to ``. "Verified" means I read the code in this session; anything I didn't verify is marked. PRD ids are written `TP-Sx-…`.

---

#### Before the phases: what the code check changed

Three findings change the inputs you gave me. One more risk needs checking before P3.

1. **The new exact math moves about 0.08% of prices by one cent on release day.**
   - I measured it with PHP 8.5.3, script at `(local scratch file)`.
   - Today's formula `round(cost*(1+markup)/100, 2, HalfAwayFromZero)` in `PricingRulesApplier.php:67-79` is floating-point.
   - Across 6,000,000 sampled (cost, markup) pairs it differs from exact half-away-from-zero in 4,615 cases. Example: 15% markup on $1.70 gives $1.95 today; exact math gives $1.96.
   - The SQL twin (`InventoryValueSellExpression`, exact DECIMAL) already disagrees with PHP on these ties.
   - So exact integer math (TP-S10-R5) changes those prices, against TP-S1-R3 "no price changes". This goes to Product (ambiguity A1).
2. **Widening `entity_event.payload` to MEDIUMTEXT is rollback-safe but not operationally safe.**
   - MySQL 8 treats TEXT→MEDIUMTEXT as a data-type change. That is `ALGORITHM=COPY` with no concurrent writes, on an 8.85M-row table every work-order history write hits.
   - I recommend no widening (decision D5).
3. **`FixedLineTotal` already splits by cost, but $0-cost lines split by part count, not quantity.**
   - The `1 === $margin` branch does fire: integer division that comes out exact returns int 1.
   - On that branch every part gets `partsPricePortion / partsCount`, whatever its quantity.
   - When it can't place a leftover cent on a quantity-1 part, it moves the cent into labor (`FixedLineTotal.php:93-127`).
   - D10 fixes both.
4. **Risk to check before P3: the PO receive screen posts its own sell price.**
   - `AcceptDeliveryCommandHandler.php:243` takes the sell price from the client.
   - `ReceiveWorkOrderPartsFromVendorSubscriber.php:66-90` creates the work order part at that price, bypassing any server rule.
   - TP-S11-R9 needs the server to decide. Whether the PO receive screens send a computed price, a prefill or nothing must be checked with the FE planner before P3.

---

#### Goal

Replace the static, untenanted `PricingRulesApplier` with one org-keyed, tier-aware resolver.

- Add tiers, two-sided matrices, per-column rules and a single category→matrix link.
- Record on every part line what priced it.
- Snapshot each invoiced part line.
- Expose the settings, customer, price-details and Audit Log APIs, all permission-enforced on the server.
- Release day changes nothing until a client sets something up (apart from A1).

#### Bounded contexts touched

| Context | Owns in this PR |
|---|---|
| `Sales` | New module **`Sales/Pricing`** (D10): `PricingTier` and `PricingMatrix` roots, the rule math, the resolver port, settings APIs, Set Rule and Undo, and the matrix and tier Audit Log. `Sales/PricingRules` is retired. |
| `VehicleService/WorkOrders` | The tier a work order keeps, the pricing record on lines, every pricing path, price details and Priced by, split repricing, the Change Customer count, the per-line pricing query ports |
| `Customer/Customers` | Two customer tier fields on `company`, Manage Customers, customer-card pricing, the tier-usage port |
| `PartsCatalogue/PartsCategories` | The single category→matrix link (D5), moving categories between matrices, the settings categories list, category delete changes, category audit |
| `Invoicing` | The invoice part-line snapshot (D11/D12), its reconciliation, and moving those rows on category delete |
| `Inventory` | Read-only Default-price sites move to the resolver; the fixed-price decision |
| `Reporting` | The `InventoryValueSellExpression` SQL twin and its parameter binding |
| `EntityEvent` | Three new entity types |
| `IAM` / `Auth` | The new atom, its bundle mapping, the role hierarchy |
| `Shared` | Read-your-writes exclusions, the pending-drop list, `schema_filter`, manually managed foreign keys |

---

### 1. Final phase list

Seven phases, one commit each, in dependency order.

| Phase | Depends on | Covers |
|---|---|---|
| P1 Foundation | none | All schema, domain models, release-day migration, new-client setup, permission atom, audit types |
| P2 Resolver and recording core | P1 | One resolver, retire the static applier, calculate-sell-price, InventoryValue parity, fixed-line-total split, invoice part-line snapshot |
| P3 Every pricing path | P2 | Tier kept on work orders, line pricing paths, receiving, split, Change Customer, add-row prefill |
| P4 What priced a line | P3 | Priced by on lists, price details, masking |
| P5 Tiers and matrices settings API | P1, P2 | Tier management, Set Rule and Undo, matrix management, simulator and below-cost, matrix and tier audit writes |
| P6 Categories settings API | P5 | Categories list and page, matrix picker, delete changes, category audit |
| P7 Customers, Manage Customers, Audit Log reads | P1, P5 | Customer tiers, customer card, tier customers tab, bulk add and remove, all six Audit Log reads |

---

#### P1 Foundation: schema, domain models, release-day migration

**Covers:** TP-S1 (all), the data side of TP-S2-R15/R18, TP-S3-R5/R16/R20/R21/R23/R28/R31, TP-S9-R1/R2, TP-S10-R14, TP-S12-R4/R15/R19, D5, D6, D8, D9, the D7 entity types.

##### 1.1 Migrations

Each file is generated separately with `bin/console doctrine:migrations:generate` (never a hand-typed version). Migrations are idempotent and guard on `INFORMATION_SCHEMA`; no `skipIf()`.

###### M1: schema only

Nothing here breaks the previous release: all new tables, nullable columns or columns with defaults, plus indexes.

```sql
-- Tiers (Sales/Pricing). Default is a real row (D6); numbering is derived from position over active tiers.
CREATE TABLE pricing_tier (
  id BINARY(16) NOT NULL, organization_id BINARY(16) NOT NULL,
  name VARCHAR(100) NOT NULL,            -- domain caps at the PQ5 limit (PENDING; proposal 50); a wider column can be narrowed in the VO only
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  position INT UNSIGNED NOT NULL,        -- creation order; reactivate = MAX+1 (TP-S2-R6)
  archived_at DATETIME DEFAULT NULL,
  version INT NOT NULL DEFAULT 1,        -- Doctrine optimistic lock
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BINARY(16) DEFAULT NULL, updated_by BINARY(16) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY pt__organization_id_name_unq (organization_id, name),        -- ci collation = case-insensitive (TP-S2-R3)
  UNIQUE KEY pt__organization_id_position_unq (organization_id, position),
  KEY pt__organization_id_archived_at_position_idx (organization_id, archived_at, position)
);

-- Matrix: keep the table and the is_default column (old code reads it). Mapped as isGeneral.
ALTER TABLE pricing_matrix
  ADD part_sale_side_enabled TINYINT(1) NOT NULL DEFAULT 0,
  ADD rules_revision INT NOT NULL DEFAULT 0,   -- bumped on every rule change; Undo and conflict checks (TP-S2-E5, TP-S19-E2)
  ADD version INT NOT NULL DEFAULT 1,
  ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD created_by BINARY(16) DEFAULT NULL, ADD updated_by BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;

-- One set of ranges per side, shared by every column. The Default column lives on the range (always present).
CREATE TABLE pricing_matrix_range (
  id BINARY(16) NOT NULL, matrix_id BINARY(16) NOT NULL,
  side VARCHAR(16) NOT NULL,                  -- work_order | part_sale
  start_cents INT UNSIGNED NOT NULL, end_cents INT UNSIGNED DEFAULT NULL,   -- NULL = last, open range
  default_calculation VARCHAR(16) NOT NULL,   -- plus_amount | markup | margin (TP-S4-N1)
  default_value INT UNSIGNED NOT NULL,        -- cents for plus_amount; hundredths of a percent for markup/margin
  default_follows_above TINYINT(1) NOT NULL DEFAULT 0,   -- TP-S3-R23 (last range only)
  PRIMARY KEY (id),
  UNIQUE KEY pmr__matrix_id_side_start_cents_unq (matrix_id, side, start_cents),
  CONSTRAINT pricing_matrix_range__matrix_id_fk FOREIGN KEY (matrix_id) REFERENCES pricing_matrix (id) ON DELETE CASCADE
);

-- Tier cells. A tier with NO cells on a side = "Same as previous tier" (so a new tier needs no rows, TP-S2-R18).
CREATE TABLE pricing_matrix_tier_rule (
  id BINARY(16) NOT NULL, range_id BINARY(16) NOT NULL, tier_id BINARY(16) NOT NULL,
  calculation VARCHAR(16) NOT NULL,           -- percent_off | amount_off | plus_amount | markup | margin
  value INT UNSIGNED NOT NULL, follows_above TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY pmtr__range_id_tier_id_unq (range_id, tier_id),
  KEY pmtr__tier_id_idx (tier_id),
  CONSTRAINT pricing_matrix_tier_rule__range_id_fk FOREIGN KEY (range_id) REFERENCES pricing_matrix_range (id) ON DELETE CASCADE,
  CONSTRAINT pricing_matrix_tier_rule__tier_id_fk FOREIGN KEY (tier_id) REFERENCES pricing_tier (id)   -- RESTRICT; MANUALLY_MANAGED
);

-- Set Rule journal for Undo (TP-S2-R27, TP-S2-E5).
CREATE TABLE pricing_tier_rule_change (
  id BINARY(16) NOT NULL, organization_id BINARY(16) NOT NULL, tier_id BINARY(16) NOT NULL,
  calculation VARCHAR(16) NOT NULL, value INT UNSIGNED NOT NULL,
  payload JSON NOT NULL,      -- [{matrixId, side, rulesRevisionAfter, previous:[{rangeId,calc,value,followsAbove}] | null}]
  created_by BINARY(16) NOT NULL, created_at DATETIME NOT NULL, undone_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id), KEY ptrc__tier_id_created_at_idx (tier_id, created_at)
);

-- Customer tiers (D6): NULL = Default; never stores the Default tier's id.
ALTER TABLE company ADD work_order_pricing_tier_id BINARY(16) DEFAULT NULL,
                    ADD part_sales_pricing_tier_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;
CREATE INDEX c__work_order_pricing_tier_id_idx ON company (work_order_pricing_tier_id) ALGORITHM=INPLACE LOCK=NONE;
CREATE INDEX c__part_sales_pricing_tier_id_idx ON company (part_sales_pricing_tier_id) ALGORITHM=INPLACE LOCK=NONE;
CREATE INDEX c__org_work_order_pricing_tier_part_sales_pricing_tier_idx
       ON company (organization_id, work_order_pricing_tier_id, part_sales_pricing_tier_id) ALGORITHM=INPLACE LOCK=NONE;

-- The tier a work order / Part Sale keeps (D6). NULL = Default (every row open on release day).
ALTER TABLE work_order ADD pricing_tier_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;
CREATE INDEX wo__pricing_tier_id_status_idx ON work_order (pricing_tier_id, status) ALGORITHM=INPLACE LOCK=NONE;

-- Line pricing record (D9). NULL pricing_source = "before tiers".
ALTER TABLE work_order_part_request
  ADD pricing_source VARCHAR(16) DEFAULT NULL,    -- tier | default | fixed_price | fixed_line_total | manual
  ADD pricing_tier_id BINARY(16) DEFAULT NULL,    -- only when source IN (tier, default); real tier id (Default's too)
  ADD priced_for_company_id BINARY(16) DEFAULT NULL,
  ADD pricing_details JSON DEFAULT NULL, ALGORITHM=INSTANT;
CREATE INDEX wopr__pricing_tier_id_pricing_source_idx ON work_order_part_request (pricing_tier_id, pricing_source) ALGORITHM=INPLACE LOCK=NONE;
ALTER TABLE work_order_part (same four columns), ALGORITHM=INSTANT;
CREATE INDEX wop__pricing_tier_id_pricing_source_idx ON work_order_part (pricing_tier_id, pricing_source) ALGORITHM=INPLACE LOCK=NONE;

-- Invoice part-line snapshot (D11), Invoicing context, child of the Invoice aggregate.
CREATE TABLE invoice_part_line (
  id BINARY(16) NOT NULL, invoice_id BINARY(16) NOT NULL,
  organization_id BINARY(16) NOT NULL, work_place_id BINARY(16) NOT NULL,
  invoice_created_on DATETIME NOT NULL,   -- invoice.created_on is immutable (Invoice.php has only getCreatedOn)
  sales_type VARCHAR(8) NOT NULL,         -- service | parts (work_order.type)
  company_id BINARY(16) DEFAULT NULL,     -- billed customer (invoice.company_id, nullable = walk-in)
  work_order_line_id BINARY(16) NOT NULL, part_request_id BINARY(16) NOT NULL,
  work_order_part_id BINARY(16) DEFAULT NULL,   -- NULL for a not-yet-received request row
  source_row_id BINARY(16) NOT NULL,            -- WorkOrderPartPricingDto::getId()
  row_kind VARCHAR(24) NOT NULL,                -- part | core | core_credit | environmental_charge; non-part rows follow their parent part (reports PRD page 18 S1-R3)
  part_category_id BINARY(16) DEFAULT NULL,     -- the LINE's category at invoicing; core/core_credit/environmental_charge rows copy the parent part's
  pricing_source VARCHAR(16) DEFAULT NULL, pricing_tier_id BINARY(16) DEFAULT NULL, priced_for_company_id BINARY(16) DEFAULT NULL,  -- non-part rows copy the parent part request's values
  quantity DECIMAL(10,2) NOT NULL,
  gross_sell_cents BIGINT NOT NULL,             -- as billed; on a fixed-total line = its share (TP-S10-R13)
  line_adjustment_cents BIGINT NOT NULL DEFAULT 0,  -- part_line fee/discount emissions for a single part, on that part's `part` row (reports PRD page 18 S1-R3/S1-R9)
  net_sell_cents BIGINT NOT NULL,               -- SUM = invoice.parts_sell
  cost_cents BIGINT NOT NULL,                   -- SUM = invoice.parts_cost
  on_fixed_line_total TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY ipl__invoice_id_source_row_id_unq (invoice_id, source_row_id),
  KEY ipl__work_place_id_invoice_created_on_invoice_id_idx (work_place_id, invoice_created_on, invoice_id),
  KEY ipl__work_order_part_id_idx (work_order_part_id),   -- credits: credit_memo_line_item.originating_invoice_line_id
  KEY ipl__part_category_id_idx (part_category_id),       -- category delete moves rows to Uncategorized
  CONSTRAINT invoice_part_line__invoice_id_fk FOREIGN KEY (invoice_id) REFERENCES invoice (id) ON DELETE CASCADE  -- reversal hard-deletes
);
```

**Foreign keys on existing large tables** (decision D7):
- `company.{work_order,part_sales}_pricing_tier_id`, `work_order.pricing_tier_id` and `work_order_part{,_request}.pricing_tier_id` → `pricing_tier(id)`, all RESTRICT.
- Added online with `SET SESSION foreign_key_checks = 0` plus `ALGORITHM=INPLACE, LOCK=NONE`, exactly as `migrations/Version20261001150000.php` (SV-6468) does.
- Every new column is NULL, so no row can violate them.
- All hand-written foreign keys go into `MANUALLY_MANAGED_FOREIGN_KEYS`, with their backing indexes declared in XML.

**Snapshot sizing:**
- Rows ≈ invoiced part rows. Production has 1.21M `work_order_part`, 1.43M `work_order_part_request` and 308k invoices, so roughly 1–1.3M rows once the reports PR backfills, at about 220 B per row plus three secondary indexes: about 0.5 GB.
- No covering index: a year at the largest location is tens of thousands of rows, so primary-key lookups are cheap.
- A covering variant would need new entries in the abbreviation table in `database.md`, so leave it to the reports PR's EXPLAIN.

**Rollback safety, written into each migration's docblock:**
- Old code never names the new tables or columns.
- Every new column is nullable or has a default.
- Old inserts into `company`, `work_order` and lines get NULL, which means Default or "before tiers".
- An old reversal deletes the invoice, and the database cascade removes its snapshot rows.

###### M2: release-day data (TP-S1)

PHP in `postUp()`, a loop per organization. Every statement is scoped by `organization_id` or is row-local.

1. Insert a Default `pricing_tier` (`position=1`, `is_default=1`, name "Default") for every `organization_detail` row that has none (TP-S1-R2/R10).
2. Names, per organization:
   - A non-General matrix whose `LOWER(TRIM(name)) = 'general matrix'` gets " (old)" (TP-S1-E13; production has one).
   - Case-insensitive duplicates: every matrix after the first, ordered `is_default DESC, id ASC`, gets " (2)", " (3)" and so on until the name is free (TP-S1-E9; production has none, still implemented).
   - Then the `is_default=1` matrix is renamed "General Matrix" (TP-S1-R1).
3. Rules, per matrix: every `pricing_rule` of type `markup_for_interval`, ordered by `min_cost`, becomes a `pricing_matrix_range` row with side `work_order`, `start=min_cost` (the real start is kept, TP-S1-E12), `end=max_cost`, and `end=NULL` on the last range.
   - The Default cell is `markup`, value = `round(markup_factor*10000)`. The DECIMAL(9,4) factor is exactly a two-decimal percent.
   - The last range gets `default_follows_above=1` when its value equals the range above (TP-S3-E4).
4. Anomalies keep today's prices. Each is counted by a read-only production query before release; the counts go in the PR.
   - **A non-default matrix with no rules** is priced by the default matrix today (`PricingRulesApplier.php:57-60`). Copy the General Matrix's ranges into it: same prices; it now shows rules (ambiguity A11).
   - **A gap or overlap** between ranges: copy as-is. Saving is blocked by TP-S3-R6, and the resolver follows a deterministic rule (P2).
   - **A client with no default matrix, or a default matrix with no rules**, fails with a `RuntimeException` today (`PricingRulesApplier.php:51-64`). Create a General Matrix with the seeded brackets from `DefaultPricingMatrixCreator.php:15-72`. This turns an error into a price; logged (A11).
5. The category link (D5). Today's PHP pricing truth is `pricing_matrix.categories` (the applier at `PricingRulesApplier.php:88-97`). Where `part_category.pricing_matrix_id` disagrees with it, rewrite `pricing_matrix_id` from `categories`.
   - If two matrices list the same category, the first by `id ASC` wins, mirroring the applier's `findAll()` order.
   - An id pointing at another client's or a missing matrix becomes NULL.
   - **Uncategorized is not normalized**: it keeps the General Matrix's id. NULL and the General id both mean "on the General Matrix" to the new code. This keeps the Open API `PartCategoryOutputDto.pricing_matrix_id` byte-identical (TP-S18-R4).

Customers, work orders and lines need no backfill: NULL means Default or before tiers.

Volumes are small (1,987 matrices, 10.5k rules, 11.6k categories). This migration is fleet-wide, so it needs the Golden Rule sign-off (decision D11).

###### M3: unique matrix names, after M2

`CREATE UNIQUE INDEX pm__organization_id_name_unq ON pricing_matrix (organization_id, name) ALGORITHM=INPLACE LOCK=NONE`.

- Safe for old code: both `AddPricingMatrixCommandHandler::checkName()` and `ChangePricingMatrixCommandHandler::checkName()` (line 39, `existsByNameAndOrganizationExcludingMatrix`) refuse a duplicate under the case-insensitive collation.
- No case-insensitive duplicates exist after M2.

###### Two-release retirement (release A = this PR)

- Unmap `PricingRule` and add `pricing_rule` to `schema_filter` in `api/config/packages/doctrine.yaml`.
- Add `pricing_matrix.categories` to `PENDING_DROP_COLUMNS` in `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`.
- M1 drops the legacy foreign key `FK_6DCEA672AA000BE7` on `pricing_rule.matrix_id` (it has no ON DELETE), so `DoctrinePricingMatrixRepository::remove()` never touches `pricing_rule` (Section 8).
- **Create the release-B ticket with this PR:** "Drop `pricing_rule` and `pricing_matrix.categories` (step 2 of 2)". It drops the table and the column and removes the `schema_filter` and `PENDING_DROP_COLUMNS` entries, `ResyncLegacyMatricesCommand`, `LegacyMatrixResync` and any legacy code kept only for the resync (Section 11).
- Production keeps these two stores **frozen** (decision D1). A rollback prices by release-day rules: no errors, but stale.

###### Post-deploy catch-up command (old tasks keep serving for minutes after M2)

- `UI/CLI/ResyncLegacyMatricesCommand` is a thin shell over `Application/Service/LegacyMatrixResync`.
- For matrices with `rules_revision = 0` (never saved in the new model) whose `pricing_rule` rows differ from the copied ranges, it re-copies. It also re-applies the category-link fix in step 5.
- Idempotent, one transaction per client inside `OrganizationDecorator::runAs()`.
- Run once after the production deploy.

##### 1.2 Domain model (new module `api/src/Sales/Pricing/`)

```
Domain/Model/  PricingTier, PricingTierId, PricingTierName (VO: trim, 1..PQ5 limit, reserved names TP-S2-R3),
               PricingMatrix (rewritten; moved from Sales/PricingRules/Domain), PricingMatrixId, MatrixRange (child),
               TierRule (child cell), Rule (VO: RuleCalculation + int value, validates TP-S3-R6 bounds),
               RuleCalculation (enum), MatrixSide (enum), PricingChannel (enum work_order|part_sale),
               PricingSource (enum), GridSpec (input VO for a side save), PricingChangeSet (diff VO returned for audit)
Domain/Repository/ PricingTierRepositoryInterface, PricingMatrixRepositoryInterface,
                   PricingTierNameUniqueness, PricingMatrixNameUniqueness (policy ports)
Domain/Error/  TierNameTakenError, TierNameReservedError, ArchivedTierNameError, DefaultTierImmutableError,
               TierHasCustomersError(409), TierInUseError(409), GeneralMatrixNotDeletableError, StaleMatrixError(409, ConflictError),
               ArchivedTierInGridError(409), InvalidGridError(422 with cell addresses)
Infrastructure/Doctrine/*.orm.xml   (register the module's mapping dir in config/packages/doctrine.yaml)
Infrastructure/Persistence/Repository/Doctrine/{DoctrinePricingTierRepository,DoctrinePricingMatrixRepository}
Infrastructure/Persistence/Policy/{DbalPricingTierNameUniqueness,DbalPricingMatrixNameUniqueness}
```

Invariants owned by `PricingMatrix`:
- One set of ranges per side. The first range starts at 0 once saved (TP-S3-R16; release-day starts are kept until saved).
- The last range is open-ended and ends strictly increase.
- Every range has a Default rule, From cost only.
- A tier column on a side has cells in every range or in none.
- An Off-default column uses one calculation in every range (TP-S4-R31).
- The General Matrix can't be deleted.
- Rule changes bump `rules_revision`; the matrix has a version field.

`PricingTier` invariants: Default can't be archived or deleted; renaming checks uniqueness and reserved names.

**Typed IDs:** `PricingTierId` and `PricingMatrixId` are new `final … extends Uuid`. PartsCatalogue's existing embeddable `PricingMatrixId` copy stays; replacing it is an SV-12051 ticket.

##### 1.3 Other P1 changes

- `api/src/VehicleService/WorkOrders/Domain/WorkOrder.php` and `WorkOrder.orm.xml`: `pricingTierId` (nullable `binary_uuid`), optional trailing constructor parameter, `getPricingTierId(): ?PricingTierId`.
- `api/src/VehicleService/WorkOrders/Domain/PartRequest/PartPricingRecord.php`: a value object, embedded with no column prefix in both `PartRequest.orm.xml` and `Part/Part.orm.xml`, `NullableEmbeddable`. Methods `PartRequest::applyPrice(PartPricingRecord, int $sellCents)` and `Part::copyPricingFrom(PartRequest)`. No public record setter.
- `api/src/Customer/Customers/Domain/Company.php` and `Company.orm.xml`: two tier fields plus `assignPricingTier(PricingChannel, ?PricingTierId)`, which normalizes the Default id to NULL. Constructor parameters are trailing and optional; there are six construction sites (`grep "new Company("`).
- `api/src/Invoicing/Invoice/Domain/InvoicePartLine.php` (child entity) and `Invoice.orm.xml` one-to-many with orphan removal plus `on-delete="CASCADE"`.
- `api/src/EntityEvent/Domain/EntityEventType.php`: `PRICING_MATRIX='pricing_matrix'`, `PRICING_TIER='pricing_tier'`, `PART_CATEGORY='part_category'`, also added to `getLabel()`. Old readers filter by type, so the new rows are invisible to them.

**Permissions (D8):**
- Add atom `ROLE_PARTS_SETTINGS::MANAGE` to `api/src/IAM/AccessControl/Domain/PermissionEnum.php`, with `ROLE_PARTS_SETTINGS::*` in `api/config/packages/security.yaml`.
- Add the atom to the `settingsParts` entry in `api/src/Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php:690-701`.
- A seed migration copies the shape of `migrations/Version20260928120001.php`: an idempotent `INSERT … WHERE NOT EXISTS` into `v2_be_permission` and `v2_fe_permission_be_permission`, with a `down()`.
- Roles get the atom through the bundle when their token is issued; no per-role grants.
- Check whether the atom-drift guard (`IntentionalAtomChanges`) needs an "added by design" entry. I did not check this.

**New-client setup:**
- Add `CreateDefaultPricingTierOnOrganizationCreatedSubscriber` on `OrganizationCreatedEvent`, the same event `CreateCounterSaleCompanyOnOrganizationCreateSubscriber` uses.
- Rewrite `DefaultPricingMatrixCreator` to build the General Matrix in the new model, with the same brackets as Default markup ranges.
- Uncategorized keeps the General Matrix's id, as today.

**Tests (P1):**
- Unit: `PricingTierName` (trim, case, every reserved name with its message), `Rule` bounds (0–99.99 for % Off and Margin, ≥0 for the others, at most two decimals), `PricingMatrix` invariants (each TP-S3-R6 case, follows-above, single-type Off column, General not deletable), `PricingTier` archive, reactivate and rename.
- Functional, `MigrationsTest`-style against fixtures: M2 renames, " (2)" and " (old)", rules→ranges parity, gaps, rule-less matrices, category-link fix, Default tier per client, idempotent re-run.
- Repository query tests for both repositories, each with a tenant-isolation case.
- `LegacyMatrixResync` unit test.
- Seed-migration test, cloned from the existing `PartSaleHistoryPermissionSeedMigrationTest`.

**Gates:** static checks, the migration gate (`doctrine:migrations:migrate`), and `doctrine:migrations:diff` reports "No changes detected". After `cache:clear`, run `bin/smoke-test.sh --warmup` then `bin/smoke-test.sh`.

---

#### P2 Resolver and recording core

**Covers:** TP-S10 (all), TP-S12-R4/R15/R18/R19, TP-S13-R1 math, D4, D10, D11, D12, the cache fix, InventoryValue parity, calculate-sell-price.

##### 2.1 Resolver

```
Sales/Pricing/Domain/Service/TieredPriceCalculator.php        pure: (PricingConfigurationSnapshot, PriceInput) -> PriceResolution
Sales/Pricing/Application/Port/PartPriceResolverInterface.php  PUBLISHED port (+ DTOs PriceRequest, PriceResolution, DefaultPriceRequest)
Sales/Pricing/Application/Service/PartPriceResolver.php        loads config per org (memo, ResetInterface), runs the cascade
Sales/Pricing/Application/Query/Configuration/PricingConfigurationQueryRepositoryInterface.php
Sales/Pricing/Infrastructure/Persistence/Query/Dbal/DbalPricingConfigurationQueryRepository.php   (writer)
```

The cascade (TP-S10-R1) and the math (TP-S10-R4/R5/R15/R20; integer only, exact half away from zero):

```php
public function resolve(PriceRequest $r): PriceResolution
{
    if ($r->onFixedLineTotal) { return PriceResolution::fixedLineTotal($r->currentSellCents); }      // TP-S10-R13
    $calculated = $this->calculated($r);                                                             // fixed price, else tier
    if ($r->typed !== null && $r->canChangePricing) {                                                // TP-S10-R1 #1, TP-S11-R5
        $typed = $r->typed->toSellCents($r->costCents);                                              // a margin is typed as basis points
        return $typed === $calculated->sellCents ? $calculated
            : PriceResolution::manual($typed, $r->actingUserId, $r->typed, $calculated);
    }
    return $calculated;
}
private function calculated(PriceRequest $r): PriceResolution
{
    if ($r->fixedSellPriceCents !== null) { return PriceResolution::fixedPrice($r->fixedSellPriceCents); }
    $cfg  = $this->configFor($r->organizationId);                      // memo keyed by org id
    $tier = $cfg->tierOrDefault($r->tierId);                           // archived tiers included (TP-S10-R14)
    if ($r->costCents === null || $r->costCents <= 0) {                // TP-S10-N1
        return PriceResolution::noCost($tier, $r);
    }
    $matrix = $cfg->matrixForCategory($r->categoryId);                 // NULL / general id / unknown -> General (TP-S10-R17/R21)
    $side   = $r->channel === PricingChannel::PartSale && $matrix->partSaleSideEnabled()
            ? MatrixSide::PartSale : MatrixSide::WorkOrder;            // TP-S10-R18
    return $this->calculator->price($matrix, $side, $tier, $r->costCents, $cfg->tierChain());
}
```

```php
// TieredPriceCalculator::sell(): exact rational rounding, shared by PHP and the SQL twin
private static function roundDiv(int $num, int $den): int { return intdiv(2 * $num + $den, 2 * $den); } // num, den > 0
// markup:       roundDiv(cost * (10000 + v), 10000)
// margin:       roundDiv(cost * 10000, 10000 - v)
// plus_amount:  cost + v
// percent_off:  roundDiv(D * (10000 - v), 10000), where D = the already-rounded Default price on the same side (TP-S10-R15)
// amount_off:   max(0, D - v)
// same-as-previous: the nearest ACTIVE tier with a lower position, recursively, ending at Default (TP-S10-R20, TP-S10-E8)
// range pick:   ranges by start; the first whose end is NULL or >= cost; cost below the first start -> first range
//               (replicates today's applier for contiguous and overlapping ranges; a gap cost uses the next range where today throws)
```

`PriceResolution` carries everything TP-S12-R2/R18/R19 needs:
- `sellCents`, `source`, `tierId` (the work order's tier, TP-S12-R19), `ruleTierId` (the tier whose rule was used).
- `matrixId` and `matrixName`, `side`, range start and end, `calculation` and `value`, `costCents`.
- `defaultPriceCents` for % Off and $ Off, `basis` (`rule|no_cost|canned_saved_price|kept_margin_on_receipt|manual`).

**Cache fix:**
- Delete the static class and the 11 `loadMatrices()` copies.
- `PartPriceResolver` holds an `array<orgId, Snapshot>` memo and implements `ResetInterface`, so it is reset between Messenger messages.
- Loading is lazy per (client, matrix): one query for the category→matrix map, one for that matrix's ranges and cells, one for the tier list.
- `snapshotForCategories(list)` is the batch form used by canned lines and split.
- **No Redis.** TP-S10-E3 needs the saved configuration at the moment of pricing, and three to four indexed queries are well under TP-S10-R22's 0.3 s (§3).
- Remove the static resets at `api/tests/Functional/FunctionalTestCase.php:32-47` and `api/tests/TestExtension.php:86-98`.

**Read-only sites switch to `PartPriceResolverInterface::defaultSellPrices(list<DefaultPriceRequest>)`:**
- Default column, work-order side, fixed price first.
- "Inventory and catalog screens keep the fixed or Default price."
- Files: `Inventory/Parts/Application/HTTP/View/ViewQueryHandler.php`, `.../ListWorkplaces/ListWorkplacesQueryHandler.php`, `.../ListWithoutFixedRulesAsOptions/ListingQueryHandler.php`, `.../Service/Part/PartListResultFactory.php`, `.../Domain/Service/History/{PartHistoryDataProvider,CataloguePartUpdatedHistoryPayloadHydrator}.php`, `PartsCatalogue/CataloguePart/Infrastructure/Persistence/Query/Dbal/DbalCataloguePartFetcher.php`, `Inventory/Parts/Application/Handler/ChangePartCommandHandler.php:139,411-425`.

**`PricingRuleOverrider`:**
- Replaced by `Inventory/Parts/Domain/Part::applyFixedSellPrice(?int $submitted, int $defaultCents)`.
- Callers: `CreateFixedPriceCommandHandler`, `RemoveFixedPriceCommandHandler`, `SpecialPartsToInventoryCommandHandler:294`, `ChangePartCommandHandler:143-148`.
- `Inventory/Parts/Application/CLI/PopulatePartSellPrices.php`: update or delete. `DbalDuplicatePartCleanupRepository`: stop reading and re-pointing `pricing_rule` in release A; delete `countPricingRules()` and its result field (Section 8).

##### 2.2 `calculate-sell-price` (TP-S16-R5)

- Move it to `Sales/Pricing/UI/HTTP/CalculateSellPrice/` as `GET /api/pricing/calculate-sell-price`; the old path is removed and the FE moves with it.
- Gate: `#[IsGranted(ROLE_PRICING_VIEW)]` plus an `or` expression on `ROLE_WORK_ORDER::VIEW` / `ROLE_PART::VIEW`.
- Parameters: `categoryId`, `cost`, optional `inventoryPartId` (scoped lookup) and optional `workOrderId`.
  - With `workOrderId`, the work order is resolved through `#[MapEntity(IN_CURRENT_WORKPLACE)]`; its kept tier and channel price the request.
  - Without it, the Default price.
- Response: `{sellPrice, pricingSource, tierName}`.

##### 2.3 InventoryValue SQL twin

`api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/InventoryValueSellExpression.php` is rewritten as a Default-column, work-order-side pick over `pricing_matrix_range`:

```sql
(SELECT CASE r.default_calculation
   WHEN 'markup'      THEN (2*c*(10000+r.default_value) + 10000) DIV 20000
   WHEN 'margin'      THEN (2*c*10000 + (10000-r.default_value)) DIV (2*(10000-r.default_value))
   WHEN 'plus_amount' THEN c + r.default_value END
 FROM pricing_matrix_range r
 WHERE r.matrix_id = <matrix> AND r.side = 'work_order' AND (r.end_cents IS NULL OR r.end_cents >= c)
 ORDER BY r.start_cents ASC LIMIT 1)
```

- `c` is `p.purchase_price`.
- Integer `DIV` makes PHP and SQL identical by construction.
- Use the `pmr__matrix_id_side_start_cents_unq` index.
- The General Matrix id is bound once.
- `DbalInventoryValueFetcher.php:814-890` and `DbalInventoryValueSnapshotRepository` drop the lo/hi bound parameters.
- `InventoryValueSellExpressionParityTest` is extended to every calculation type plus mixed columns and the release-day first range above $0.
- Connections are unchanged: the live report reads the replica, the nightly capture reads the writer.

##### 2.4 Fixed line total (D10)

Rework `api/src/VehicleService/WorkOrders/Domain/Line/FixedLineTotal.php` and `FixedLineTotalPart.php` into one routine with two outputs: a per-part `shareCents` and the unit price shown and billed.

1. Weight each part by `round(cost × qty)`; if every weight is 0, weight by quantity (TP-S10-R13; today it splits by part count).
2. `share_i = floor(P·w_i/Σw)` for every part except the last; the last part takes the rest. Order: line part order, then id.
3. `unit_i = round(share_i/qty_i)`.
4. If `Σ unit×qty ≠ P` (only possible when quantity ≠ 1), the residual goes to the last quantity-1 part, else to labor, as today. Then `share_i := unit_i×qty_i`, so the recorded share always equals what the invoice billed (decision D8 and ambiguity A5).

The callers keep their signatures: `WorkOrderPartsAndLinesHydrator:85-92,457,489`, `PartsByLinesProvider:634-650`, `Statistics/StatisticsDetails/Data.php:209-226`.

##### 2.5 Invoice part-line snapshot (D11/D12)

- `Invoicing/Invoice/Application/Service/InvoicePartLineSnapshotBuilder.php` builds rows from the same `WorkOrderPricingDto`.
- Extract `WorkOrderLinePricingDto::billablePartRows()`: it skips return requests and declined lines and keeps core credits. Both `getTotalPartsPrice()` and the builder use it, so the included set is identical by construction.
- Per row, `gross = FixedDecimal2(sell)->multiply(qty)` in cents, the same expression as `getTotalPartsPrice()` (SV-8747).
- Part-line fee and discount emissions are attributed by the adjustment's `target_id` to the matching part's `part` row, as `line_adjustment_cents` (part or request id; the implementer checks the target type in `WorkOrderAdjustmentResolver`). Emissions come from `AdjustmentEmissionCalculator::emittedCentsById()`, post-floor, the same source `bucket()` uses.
- `core`, `core_credit` and `environmental_charge` rows copy `part_category_id`, `pricing_source`, `pricing_tier_id` and `priced_for_company_id` from their parent part request, so the reports put them in the part's row and category (reports PRD page 18 S1-R3, S1-R9). Their gross, net and cost stay their own.
- Per row cost is `round(DTO cost × qty)` (decision D9).
- Category, source, tier and priced-for come from a batch VehicleService port, `VehicleService/WorkOrders/Application/Query/PartLinePricing/PartLinePricingQueryRepositoryInterface::forWorkOrder(WorkOrderId): array<rowId, PartLinePricingDto>`, implemented as `DbalPartLinePricingQueryRepository` (writer; it runs in the invoice transaction).
- `InvoiceFinancialSnapshotService::capture()` (line 107) calls `$invoice->capturePartLines($rows)`, which replaces the collection. Recompute paths call `capture()` too (`InvoiceBuilder.php:313-324`: create plus `UpdateTotalWhen*`), so rows follow any pending recompute.
- Then `reportUnreconciledPartLines()` compares `Σnet` with `parts_sell` and `Σcost` with `parts_cost`. On a mismatch it logs at ERROR (`invoice_part_line_snapshot_unreconciled`, with invoice id and both deltas) and never throws.
- Void keeps the rows (reports join `invoice` with `NonVoidInvoicePredicate`); reversal cascades.
- The reports PR's backfill can reuse the builder.

**Tests (P2):**
- Unit: `TieredPriceCalculator`, table-driven for every calculation, the TP-S10-R15 example ($10.005 → $10.01 → 10% off = $9.01), $ Off floored at 0, chains of Same-as-previous across archived tiers (TP-S10-E8), side selection, the release-day first range above 0, range boundaries (TP-S3-E3), the mixed column, no cost.
- Golden vectors JSON at `api/tests/Fixtures/Pricing/golden-vectors.json`, shared with the FE if it keeps any local math.
- Unit: `PartPriceResolver` cascade and Manual detection (equal typed price is not Manual), with the memo reset.
- `FixedLineTotal`: all-$0 split by quantity, leftover on the last part, quantity-1 absorption, labor fallback, Σ share = P.
- `InvoicePartLineSnapshotBuilder` fixture matrix: plain part, unreceived request, partial receipt, core resolved and unresolved, Part Sale core credit, environmental charge, declined line, return request, fixed-total line, flat and % part-line adjustments.
  - Assert `Σnet == parts_sell` and `Σcost == WorkOrderStats::getPartsCost()`. Any case that fails gets explicit handling in the builder.
  - Assert every `core`, `core_credit` and `environmental_charge` row carries its parent part's category, pricing source, tier and priced-for customer, and each part-line fee or discount lands in its part's `line_adjustment_cents`.
- Functional: `DbalPricingConfigurationQueryRepository`, `DbalPartLinePricingQueryRepository` (tenant isolation each), InventoryValue parity, an end-to-end invoice-create test asserting snapshot rows, recompute replaces them, reversal deletes them.
- Endpoint: calculate-sell-price returns 403 without See Financial Data, a work order in another location is rejected, malformed ids give 4xx.

**Gates:** static checks, schema-sync check, smoke test.

---

#### P3 Every pricing path through the resolver

**Covers:** TP-S10-R14, TP-S11 (all), TP-S13, TP-S14-R2/R3, the TP-S11-R7 confirmations, coordinator item 1 (add-row prefill).

##### 3.1 Tier kept at creation (TP-S10-R14)

- Customer port: `Customer/Customers/Application/Query/PricingTier/CustomerPricingTierQueryRepositoryInterface::forCompany(CompanyId)` and `forCompanies(list)`, implemented as `DbalCustomerPricingTierQueryRepository` (writer).
- Set the tier at four places:
  - `ServiceWorkOrderOpener::open()`, which covers creating a work order and Maintenance's `CreateWorkOrderForEnrolledServiceCommandHandler`: the customer's work-order tier.
  - `PartSale/Create/CreateCommandHandler`: the customer's Part Sales tier.
  - `SplitWorkOrderCommandHandler:229` and `PartSaleSplitter:90`: the customer's current tier (TP-S11-E6).
  - `PayedWorkOrderReopenedSubscriber:43`: the customer's current tier (ambiguity A4).
- The sandbox seeder keeps NULL.
- Change Customer leaves the tier alone (TP-S14-R3).

##### 3.2 Line pricing

`VehicleService/WorkOrders/Application/Service/Part/PartRequestPricer.php` builds a `PriceRequest` from the work order (tier, channel), the line (fixed total), the inventory part (fixed price), the category, the cost, typed values and the acting user. It calls the port and maps the result to `PartPricingRecord`. It replaces `Domain/PartRequest/PricingCalculator.php`, a legacy Domain class that imported `OrganizationDecorator`; the class is deleted once all callers move.

| Path | Change |
|---|---|
| `MakePartRequestCommandHandler:91-97` (inline row, catalog search, Quick Add = `InlinePartRow.vue`, part dialog, Tech View, inspections and ShopCoach through `WorkOrdersBuildLineWriter`) | Through the pricer; then `$partRequest->applyPrice($record, $sellCents)`. |
| `UpdatePartRequestDataResolver::resolveSellPrice():438-523` | Fixed total → unchanged. Typed price or margin → Manual only if it differs (TP-S11-R5). Cost, category or replaced part → reprice by the work order's tier and record again (TP-S11-R2/R3/R8/R16). Quantity → no change (TP-S11-R4). **A cleared sell price restores the calculated one** (TP-S11-R5; today it writes $0, ambiguity A7). Cost edited to $0.00 or emptied → $0.00, recorded under the work order's tier (TP-S10-N1, page 35; PQ25); today's SV-10035 keep-the-stored-price fallback stays only for a recompute that genuinely can't price (Section 6 Phase 4). **Close a gap:** re-entering the same cost on a received work-order request passes `UpdatePartRequestValidator::validateNotFullyReceived()` today and would reprice. Only reprice when the cost is editable (TP-S11-R12). |
| `AddPartsToLineAfterCreatedFromCannedLine:166-172,547-558` | Every canned part goes through the pricer with the work order's tier, with two exceptions. (1) The work order's tier is Default and the part is catalog or special-order: keep the saved price, record `default` with basis `canned_saved_price` plus the canned line id and name. (2) The part has no cost: saved price, record the work order's tier, basis `canned_saved_price` (TP-S11-E8). Batch-load configuration for all categories. |
| `Application/Part/Change/ChangeCommandHandler:172-192` (`POST /api/work-orders/parts/change`, staged and received parts) | A typed sell price that differs from the stored one → Manual record. **PQ2, PENDING.** **Branch A (reprice):** a category change runs the pricer at the line's recorded cost with the work order's tier, even for users without See Financial Data (TP-S16-N4), and pushes to minted parts. **Branch B (as today):** the category changes, price and record stay, and this path is listed as the TP-S11-R3 exception. |
| `SpecialPartsGetsReceived::resolveCostAndSellPrice():304-395` | Delegates to a new pure `Domain/PartRequest/ReceiptRepricingPolicy` (TP-S11-R9): first cost → price by the work order's tier, **also when the record basis is `canned_saved_price`**, even though the stored sell price is non-zero (TP-S11-E8). Tier source at a different cost → reprice by the **recorded** tier and recorded customer. Default, before tiers, canned saved price on Default, or Manual → keep the margin with today's `repriceForChangedCost()`, record source unchanged, basis `kept_margin_on_receipt`. Fixed price or fixed total → unchanged. Legacy class: the "delegate" rung. |
| PO receive: `AcceptDeliveryCommandHandler:243` → `ReceiveWorkOrderPartsFromVendorSubscriber:66-90` | **Check before coding** what the FE posts as `sell_price`. Target: work-order-linked items go through `ReceiptRepricingPolicy`, and a client price counts only when flagged typed (Manual). |
| `PartRequestReceivedListener:36-145` (minting work order parts) | `copyPricingFrom($partRequest)`. |
| Price pushed from request to parts: `PartsManager::updatePartsForPartRequest():590-605`, `SpecialPartsGetsReceived::applySellPriceToReceivedParts():~612` | Copy the record along with the sell price. |
| `UpdatePartRequestFromOrderItemSubscriber:37-42` | Unchanged (TP-S11-R10). |
| Split work order / Part Sale (TP-S11-E6) | New `Application/Service/Part/SplitRepricer`, called explicitly in `SplitWorkOrderCommandHandler` after `WorkOrderSplitted` (inside the transaction, line 121). `SplitPartSaleCommandHandler` gets an outer `Transactional` so the splitter's own begin and commit become a savepoint, then calls the repricer. For every moved request whose source is not Manual, Fixed price or Fixed line total and whose basis is not `canned_saved_price`: reprice by the new work order's tier at the line's cost, received or not, and push to parts. One batch configuration load, no N+1. |
| Moving parts between Part Sales (`PartSaleMover`) | No reprice (TP-S11-R6); the record keeps priced-for. |
| Change Customer (`ChangeCustomer/ChangeCommandHandler`) | Change nothing. Return `linesPricedForPreviousCustomer: {count, tierName|null}` from `PartLinePricingQueryRepositoryInterface::countPricedForCompany(WorkOrderId, CompanyId)` (source in tier or default; one tier name only when every line shares it). **Absent without `ROLE_PRICING::VIEW`** (ambiguity A3). |
| Estimate approval, `CannedLineAppender::appendCopy()` | No change; verified to create no part lines. |

##### 3.3 Add-row prefill (coordinator item 1)

- **Server-side intent.** `MakePartRequestRequestDto` and `UpdatePartRequestRequestDto` take `sellPriceTyped: ?bool` and `marginTyped: ?bool`. The pricer treats a sent sell price or margin as typed only when the flag is `true`.
  - An absent flag keeps today's meaning (typed), so browsers still running the old FE behave as now.
  - A prefill or recalculated value then never becomes Manual, even if it is stale.
- **Tier-aware prefill.** `ListInventoryPartsAsOptionsWithRemainingCatalogueParts/ListingController` takes an optional `workOrderId`, checked with a scoped lookup in the current workplace. A foreign id gives 404.
  - The handler prices `sell_price` with the work order's tier and channel through `defaultSellPrices` / `resolve` in a batch.
  - Without a work order, it returns the Default price (the inventory screens).
  - `calculate-sell-price` takes `workOrderId` too (§2.2).

**Tests (P3):**
- Unit for every handler and pricer branch: Manual equal versus different, the typed flags, cleared price, fixed total, fixed price wins over tier, archived kept tier, Part Sale side.
- `ReceiptRepricingPolicy`: the PRD's $2→$3 on a $4 part = $6, and a tier line repriced by its recorded tier after the customer moved.
- `SplitRepricer` keep and reprice matrix.
- Canned line exceptions.
- Functional:
  - The make-request endpoint with a tier customer prices by tier and records it.
  - Change Customer returns the count, masked without See Financial Data.
  - Split reprices the moved lines and leaves the source lines alone.
  - The picker with a foreign `workOrderId` gives 404.
  - Malformed-input tests on the new parameters.

**Regression checks for P3** (shared code): Tech View add, part dialog create and edit, inspection and ShopCoach build, receive modal (all three surfaces; SV-10082 first-cost derive; SV-9965 keep margin), PO receive, canned lines including Maintenance, split work order and split Part Sale (`SplitDesynced*` repair untouched), Change Customer on work orders and Part Sales (deposit block, Counter Sale asset removal).

**Gates:** static checks, smoke test, browser walk after the FE half lands.

---

#### P4 What priced a line (TP-S12, TP-S10-N2)

- **Priced by on lists.** Add `pricedBy: {source, tierName, tierCurrentName, isManual}` per part row in:
  - `PartsByLinesProvider` (Parts tab)
  - `LinesDetailProvider` (Lines tab; prices open details, no column)
  - `PartRequestLineRowProvider`
  - the Part Sale parts table provider (which one is not verified; it likely shares `PartsByLinesProvider`).
  - The record columns sit on rows already selected, so no extra queries.
  - **Absent** (not zeroed) when `!canSeePricing`. Follow the `ReceiveModalOutputDto` convention, not the zeroing convention (masked-pricing echo class).
  - `tierName` is the recorded name and `tierCurrentName` the current one (ambiguity A2).
  - The source is `before_tiers` when it is NULL (TP-S12-R6).
- **Price details.** `GET /api/work-orders/{workOrderId}/part-requests/{partRequestId}/price-details`.
  - Permissions: `#[IsGranted(ROLE_WORK_ORDER_VIEW)]` and `#[IsGranted(ROLE_PRICING_VIEW)]`.
  - Lookups: `#[MapEntity(IN_CURRENT_WORKPLACE)]` on the work order, and the part request checked to belong to it (both links).
  - Query: `PartLinePricingQueryRepositoryInterface::detailsFor()`.
  - Response:

```jsonc
{ "data": { "source":"tier", "tierId":"…", "tierName":"Fleet", "tierCurrentName":"Fleet",
  "sameAsPreviousTierName":"Wholesale", "matrix":{"id":"…","name":"Brakes"}, "side":"work_order",
  "rule":{"startCents":0,"endCents":10000,"calculation":"percent_off","value":1000},
  "costCents":4003, "sellCents":4002, "defaultPriceCents":5003, "pricedAt":"2026-…Z",
  "pricedFor":{"companyId":"…","name":"Acme","isCurrentCustomer":false},
  "customerTierNow":{"name":"Wholesale"} | null, "typedBy":{"userId":"…","name":"…"} | null,
  "cannedLine":{"name":"…"} | null, "fixedLineTotal":{"totalCents":45000,"partsCents":21000} | null,
  "origin":{"kind":"inventory","bin":"A-3"} | {"kind":"vendor","vendorName":"…","vendorBillNumber":"…"} | null } }
```

  - The values come from the record's JSON, joined with the current tier name, the work order's company and that company's current tier for the channel (TP-S12-R12/R17).
  - The part's origin reuses whatever query feeds the part-number hover today (not verified where; find it in `PartsByLinesProvider`).

**Tests (P4):**
- Functional endpoint test: 403 without See Financial Data, a foreign work order or part request is rejected, the response contract, a before-tiers line.
- Provider tests: `pricedBy` is absent when masked.

---

#### P5 Tiers and matrices settings API

**Covers:** TP-S2, TP-S3, TP-S4, TP-S5, TP-S6, TP-S15, TP-S19-R8/R20/R23 (matrix and tier writes), TP-S19-E2.

##### 5.1 Permissions and conventions

- Every endpoint carries two attributes: `#[IsGranted(PermissionEnum::ROLE_PARTS_SETTINGS_MANAGE)]` and `#[IsGranted(PermissionEnum::ROLE_PRICING_VIEW)]`.
- Controllers live in `Sales/Pricing/UI/HTTP/{Tier,Matrix,Evaluate}/`, with RequestDtos in `DTO/`.
- Lookups are scoped by client (`#[MapEntity]` on a repository whose `findById` is scoped, checked against `UnscopedRepositoryLookupRatchetTest`).
- Responses use camelCase and the internal envelope.

##### 5.2 Endpoints

| Method and path | Purpose | Notes |
|---|---|---|
| `GET /api/pricing-tiers?status=active\|archived&page&rowsPerPage≤50` | Tiers list (TP-S2-R1/R14/R25) | Row: `{id, number|null, name, isDefault, status, customers:{total,workOrders,partSales}, matrices:{withOwnRules, activeTotal}}`. Active by position, then archived A–Z. Counts: one Customer-port `GROUP BY` and one cell-flag query. |
| `GET /api/pricing-tiers/options` | Tier pickers (TP-S9-R30) | Active tiers `{id, number, name}` plus `activeCount`. Permission: `ROLE_CUSTOMER::CREATE_AND_EDIT` or the settings atom (no See Financial Data needed, TP-S16-R4). |
| `POST /api/pricing-tiers` `{name}` | Create; position = max+1 (TP-S2-R17/R29) | Lock the Default tier row `FOR UPDATE` as the client's position lock. 201 `{id, number}`. |
| `GET /api/pricing-tiers/{id}` / `PATCH {name}` | Detail and rename (TP-S2-R5/R28) | Duplicate name → 409 "An archived tier is called …" or reserved-name 422. |
| `GET /api/pricing-tiers/{id}/usage` | For the archive, delete and greyed-delete flows (TP-S2-R7/R13/R30, TP-S16-E1) | `{customers:{count, list:[{companyId,name,channels}]|null}, openWorkOrderCount, pricedLineCount, followers:[tierName], canDelete, deleteBlockedReason}`. Customer names only with `ROLE_CUSTOMER::VIEW`. Ports: `Customer…TierUsage` and `VehicleService/WorkOrders/Application/Query/PricingTierUsage/PricingTierUsageQueryRepositoryInterface` (uses `wo__pricing_tier_id_status_idx` and `wopr__pricing_tier_id_pricing_source_idx`). |
| `POST /api/pricing-tiers/{id}/archive`, `POST …/reactivate`, `DELETE /api/pricing-tiers/{id}` | TP-S2-R6/R7/R8/R26 | Re-check usage under the tier row lock; 409 with the reason. Delete removes the tier's cells with a set-based statement, writes a "Tier Deleted" audit entry on each affected matrix and the tier log, then removes the tier. The foreign keys back up the check. |
| `GET /api/pricing-tiers/{id}/matrices?page` | The tier's Pricing tab (TP-S2-R20) | General first, then A–Z. Per matrix: categories, plus a work-order and Part Sale summary for this tier (`{kind:'uses_previous'|'single'|'type_only'|'mixed', calculation, value}`, TP-S4-R31). |
| `POST /api/pricing-tiers/{id}/rule-preview` `{matrixIds|allMatrices:true, rule}` | Set Rule question (TP-S2-R23) | `{changeCount, inactiveCount}`. Writes nothing; add to `ReadYourWritesPinSubscriber::EXCLUDED_ROUTES`. |
| `POST /api/pricing-tiers/{id}/rule-changes` (same body) | Set Rule (TP-S2-R22/R24/R27, TP-S2-N7/N8) | One transaction. Set-based `PricingMatrixRepositoryInterface::setTierRule()` per matrix side (work order, plus Part Sale when on), bump `rules_revision`, journal the previous cells, audit one entry per matrix plus one on the tier. 201 `{changeId, changedMatrixCount}`. Default → 422. |
| `POST /api/pricing-tiers/{id}/rule-changes/{changeId}/undo` | Undo (TP-S2-R27, TP-S2-E5) | Refused with 409 naming the matrix if any matrix's `rules_revision` differs from the recorded value after Set Rule. Restore set-based, audit "Tier Rule Undone", one Undo per change. |
| `GET /api/pricing-matrices?search&status&sortBy=name\|categories&descending&page&rowsPerPage≤50` | Matrices list (TP-S6) | General first. Page query plus three batch queries for the page (first three category names and the count, tiers with own rules on the work-order side, Default summary). Search uses `EXISTS` on category names. |
| `GET /api/pricing-matrices/{id}?view=active\|archived` | Matrix page (TP-S3-R18, TP-S4-R1/R19) | Both sides, active or archived tier columns, categories (General: count only), `rulesRevision`. |
| `POST /api/pricing-matrices` `{name, workOrderGrid, categories:[{id, expectedMatrixId}]}` | New Matrix (TP-S3-R30, TP-S7-R11) | Category moves through the PartsCatalogue command (P6) in the same transaction. |
| `PATCH /api/pricing-matrices/{id}` `{name}` | Rename on blur (TP-S3-R18) | |
| `PUT /api/pricing-matrices/{id}/sides/{side}/grid` `{expectedRulesRevision, view, ranges:[{endCents|null, default:{calculation,value,followsAbove}, tiers:{"<tierId>":{…}}}]}` | Grid save (TP-S4-R12/R22/R32, TP-S3-R6/R16/R20/R23) | 422 with cell addresses for TP-S3-R6. 409 when stale or when an archived tier sits in the active view (TP-S19-E2). Tiers absent from `tiers` = Same as previous. Change All and the General confirmation need no server flag; the shared matrix simply saves. |
| `PUT /api/pricing-matrices/{id}/categories` `{categories:[{id, expectedMatrixId}]}` | Categories line (TP-S3-R13, TP-S3-N4) | Removed categories go to General (NULL). |
| `POST` / `DELETE /api/pricing-matrices/{id}/part-sale-side` | Part Sale switch (TP-S3-R21/R27/R31) | On copies the work-order side, all tier cells included; off deletes the Part Sale side. |
| `POST /api/pricing-matrices/{id}/duplicate` | TP-S3-R8 | "(copy)" / "(copy n)", both sides, no categories. |
| `DELETE /api/pricing-matrices/{id}` | TP-S3-R9, TP-S3-N3 | Categories go to General; legacy `pricing_rule` rows are deleted. |
| `POST /api/pricing-matrices/evaluate` `{side, grid, costCents?}` | Simulator plus below-cost warnings (TP-S5, TP-S15) | Stateless, uses the same `TieredPriceCalculator` and `BelowCostDetector` (decision D4). `{simulation:{default:{sellCents,profitCents}, tiers:{…}}, belowCost:[{rangeIndex, tierId|null, lowestCostCents}]}`. Excluded from read-your-writes. |

##### 5.3 Domain services in P5

- `BelowCostDetector` (TP-S15-R5): only Off-default cells can sell below cost. The last range is checked up to `max(10×start, $10,000)`. Search costs within the range using the integer formula, so the PRD example ($40.03 for Cost + $10 / 20% off) is exact. Equal to cost does not warn.
- `TierFollowerResolver` (TP-S2-R30, TP-S4-R30).
- `RuleSummarizer` (TP-S4-R31).

##### 5.4 Audit writes (D7)

- `Sales/Pricing/Application/Audit/PricingAuditEntryFactory` writes through `EntityEventWriter` (no flush, inside the handler's transaction).
- Workplace = `WorkplaceDecoratorInterface` (the header location). Missing → `AuditWorkplaceRequiredError` 409, refused before anything is written, as in the existing precedent. Decision D6 covers the Open API.
- Payload: compact JSON `{v:1, summary, changes:[…], tierNames, omitted?}` with a 60,000-byte budget and a truncation marker (decision D5).
- Event names follow TP-S19-R20. One entry per save (TP-S19-R23).

**Tests (P5):**
- Unit for every aggregate method and handler (mocked ports): Set Rule change count, Undo refused after a save, Same-as-previous chain after archive (TP-S2-E2), reactivate goes last, reserved names, conflicts.
- `BelowCostDetector` with the PRD example; `RuleSummarizer`; the audit factory budget.
- Functional query tests, each with tenant isolation: tiers list, matrices list (search, sort, status, General first), tier Pricing tab, usage ports.
- Endpoint tests:
  - Both atoms required: 403 with only one of them.
  - A foreign tier or matrix id gives 404.
  - Grid 422 and 409.
  - Set Rule all-or-nothing (force a failure, nothing changes).
  - Malformed input.

**Gates:** static checks, smoke test.

---

#### P6 Categories settings API (TP-S7, TP-S8, D5)

- **Moving categories between matrices.** PartsCatalogue command `AssignPartCategoriesToPricingMatrixCommand(?PricingMatrixId $target, list<{categoryId, expectedCurrentMatrixId}>)`, handled by `AssignPartCategoriesToPricingMatrixCommandHandler`.
  - It calls `PartCategory::moveToPricingMatrix($target, $expected)`. A mismatch throws a 409 conflict naming the category (TP-S19-E2). Uncategorized refuses (TP-S8-R4).
  - It replaces the subscribers `CategoryPricingMatrixIdUpdater`, `PricingMatrixChangedSubscriber`, `PricingMatrixRemovedSubscriber` and `Sales/.../RemoveCategoryFromPricingMatricesSubscriber`, all deleted.
  - `UncategorizedDeduplicator.php:426` stops reading `pricing_matrix.categories`.
- **Endpoints:**
  - `GET /api/part-categories/settings?search&sortBy=category|matrix&descending&page`: gated by the settings atom only. Pricing columns are present only with `ROLE_PRICING::VIEW` (TP-S16-R11).
    - Uncategorized first.
    - Implementation: page query plus **one** summary query for all matrices on the page (`GROUP BY r.matrix_id, c.tier_id` with `COUNT(DISTINCT calculation)` and `COUNT(DISTINCT value)`), plus the active tiers. No N+1 (TP-S7-R1/R2).
  - `GET /api/part-categories/{id}/settings`: the category page (TP-S7-R6/R13/R15) with the matrix, how many categories it prices and the other category names.
  - `PUT /api/part-categories/{id}/pricing-matrix {pricingMatrixId|null, expectedCurrentMatrixId}`: settings atom plus See Financial Data (TP-S7-R9).
  - Category creation (TP-S8-R10) extends `POST /api/parts-catalogue/add-category` with an optional `pricingMatrixId`. A non-null value without `ROLE_PRICING::VIEW` gives 403. The current create permission stays "as today". The Open API keeps creating with NULL, which means General.
- **Delete (TP-S8-R8, TP-S8-E1/E2).** The "used in one or more products" block exists only in the FE (`app/src/components/ts/parts/dialogs/CategoryDialog.vue`); the BE handler never blocked.
  - Rework `UpdatePartsCategoryOnCategoryDeletedEventSubscriber` into set-based, client-scoped repository `UPDATE`s that return affected counts. It covers catalog parts, part requests (via the work order's client), canned-line parts, order items and delivery items.
  - Replace the per-entity loop in `PartRequestModifier::updatePartRequestsCategory():57-82` with a set-based statement. That loop barely ran before, because the FE blocked deleting used categories; now it would run on large categories.
  - Add an Invoicing listener `MovePartLinesToUncategorizedOnCategoryDeletedListener` doing a set-based update of `invoice_part_line.part_category_id` (TP-S8-E1: past lines report as Uncategorized).
  - Trying to delete Uncategorized returns 409 instead of a silent no-op.
  - Audit "Category Deleted" with name, matrix, QuickBooks mapping and moved counts (TP-S19-R8). The AccountingHub `part_category_deactivated` event is unchanged (TP-S18-R6), so there is no contract bump.
- **Category audit** for create, rename, matrix change, Tax Exempt and QuickBooks mapping: in `PartCategoryCreator` (the single creation path) and the `Change/ChangeCommandHandler`.
- **PQ3, PENDING.** Branch A: `UniqueCategoryName` / `PartCategory` refuse "Credits not tied to a part" (case-insensitive, 422 including the Open API), and a pre-release count of existing categories with that name. Branch B: no reservation.

**Tests (P6):** command handler unit tests (conflict, Uncategorized), functional tests for the settings list (masking, one summary query, tenant isolation), delete moving every kind including invoice lines and their counts, endpoint 403 for a matrix without See Financial Data.

**Regression checks:** category create in the inventory part dialog, the Open API create (output `pricing_matrix_id` byte-identical), Uncategorized deduplication, QuickBooks mapping cascade, AccountingHub events.

---

#### P7 Customers, Manage Customers, Audit Log reads (TP-S9, TP-S16-R4, TP-S19-R19..R23)

##### Endpoints (Customer context, `Customer/Customers/UI/HTTP/PricingTier/`)

| Method and path | Permission | Notes |
|---|---|---|
| `/api/customers/create`, `/api/customers/change` take optional `workOrderPricingTierId`, `partSalesPricingTierId` | Existing (`ROLE_CUSTOMER::CREATE_AND_EDIT`) | A missing key means unchanged, so old FE builds are safe. Ids must be active tiers of the client, else 422 (TP-S9-R1). A change writes "Customer Added" / "Customer Removed" on the new and old tier logs. |
| `GET /api/customers/{companyId}/pricing-tiers` | `ROLE_CUSTOMER::CREATE_AND_EDIT` or (`ROLE_CUSTOMER::VIEW` and `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW`) | For Edit Customer. `isSystemDefault` drives the Counter Sale tooltip (TP-S9-R8). |
| `GET /api/customers/{companyId}/pricing-summary` | `ROLE_CUSTOMER::VIEW` and `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW` (the latter only from `seeApArData`, verified) | Labor rate at the current location plus "varies by location" (source: `Organization/LabourTypes/.../CompanyLabourType`, not verified), shop supplies, raw `taxExemptLocal` and `taxExemptFederal` (**PQ6, PENDING**; the FE maps them), tiers when more than one is active (TP-S9-R12/R15/R16). |
| `GET /api/pricing-tiers/{tierId}/customers?search&channel&sortBy=name\|channel&descending&page` | Settings atom, See Financial Data, `ROLE_CUSTOMER::VIEW` | TP-S9-R9. |
| `GET /api/pricing-tiers/{tierId}/manage-customers?tab=add\|remove&search&page` plus `…/summary` | Settings atom, See Financial Data, `ROLE_CUSTOMER::CREATE_AND_EDIT` | Search covers the customer name and the current tier names (two `LEFT JOIN`s on `pricing_tier`, with Default's name for NULL) (TP-S9-R10, TP-S19-R18). The summary gives tab counts and per-channel "already on" counts for skip messages (TP-S9-E5/E7). |
| `POST /api/pricing-tiers/{tierId}/customer-assignments` `{mode:'add'\|'remove', explicit:[{companyId, channels}], allMatching:{search, channels, excludedIds, overrides}?}` | Same as above | One transaction, all-or-nothing (TP-S9-E6). Set-based client-scoped `UPDATE`s through `CompanyRepository` intent methods; every explicit id is checked against the client and one foreign id fails the whole request. Archived tiers are refused. Remove means Default (TP-S9-R22). Audit: one summary entry on the tier, plus one per previous tier losing customers through an add (ambiguity A13); customer ids go into `entity_event_ref` (decision D5). |

**Audit Log reads** (TP-S19-R19/R21/R23):
- Six endpoints: `GET /api/{pricing-matrices|pricing-tiers|part-categories}[/{id}]/audit-log?search&page`.
- Permission: settings atom plus See Financial Data.
- `Sales/Pricing/Infrastructure/Persistence/Query/Dbal/DbalPricingAuditLogQueryRepository`.
  - Scoped by client only, with no workplace predicate (as `WorkOrderHistoryResolver:218-221`).
  - Per entity: the existing index `ee__organization_id_entity_type_entity_id_occurred_at_id_idx`. Per list: a range on (organization, entity type) plus a sort over that client's pricing events only (bounded, no new index on the 8.85M-row table).
  - Search is chunked after hydration, as `WorkOrderHistoryResolver::searchPage():78-108`.
  - Page size 50, newest first.
  - Customer names resolved from refs, with a "Deleted customer" fallback.
- Response: `{entries:[{id, eventName, entityType, entityId, entityName, userName, occurredAt, details:[{label, old, new}]}], pagination}`. The FE dialog has to accept this shape; it does not reuse `WorkOrderHistoryDto`.

**Tests (P7):**
- Functional query tests with tenant isolation: tier customers, Manage Customers search including tier names, the summary, audit reads.
- Endpoint tests: each permission combination (TP-S16-N5: settings without customer edit → 403 on the assignment), bulk all-or-nothing, foreign company id rejects the whole request, Select All over more than one page (1,284 customers).
- Unit: assignment handler and audit factory.

**Gates:** static checks, smoke test.

---

#### Implementation order and pinning

- Order: P1 → P2 → P3 → P4; P5 after P1 and P2; P6 after P5; P7 after P1 and P5.
- Each phase commit leaves the suite green.
- A sibling of `ReportFetchersReadReplicaTest` pins the writer decisions below.

#### Reads: replica or writer

| Read path | Choice | Reason |
|---|---|---|
| Resolver configuration loads | writer | Runs inside write flows (pricing), and TP-S10-E3 needs the configuration just saved |
| Picker and calculate-sell-price in work-order context | writer | Touched heavy picker; stays on the writer per SV-12153/SV-12152 (`PartListResultFactory.php:190-197`); a pick is followed by a write |
| Tiers, Matrices, tier Pricing tab, Categories settings lists | writer | Small settings lists per client; the FE refetches right after saves; the replica gains nothing |
| Tier Customers tab and Manage Customers search | writer (decision D12) | Refetched right after the bulk save; the only realistic replica candidate later |
| Tier usage counts (S2-R8/R13) | writer | They gate a delete and must not be stale |
| Price details, Priced by on Parts and Lines tabs | writer | Work-order pages, edited and read together |
| Audit Log reads | writer | Opened right after a save; small, indexed |
| Invoice part-line snapshot writer and its port | writer | Inside the invoice transaction |
| Inventory Value live and capture | reader and writer, unchanged | Touched; connections stay as they are |
| Sales by Tier / Category reads | reports PR | Same shape as SBC, which is on the reader |

---

### 2. Engineering confirmations the PRD asks for

#### TP-S11-R7: every path, one by one

| Path | Code | Verdict |
|---|---|---|
| Add a part on the inline row, catalog search, Quick Add | `POST /api/work-orders/part/make-request` → `MakePartRequestCommandHandler:91-97`. Quick Add is `InlinePartRow.vue`, which holds "Sell price cannot be negative." | TP-S10-R1 (P3) |
| Part request modal create and edit | make-request / `change-request` → `UpdatePartRequestDataResolver::resolveSellPrice():438` | TP-S10-R1 |
| Technician add (Tech View, phone part request) | Same endpoints; Tech View is a view mode (`useViewMode.ts`) with `changePricing=false`; no separate phone path exists in `api/src` | TP-S10-R1; never Manual (TP-S16-N4) |
| Canned lines, including Maintenance `append()` | `AddPartsToLineAfterCreatedFromCannedLine` | TP-S10-R1 with the PRD's two exceptions (Default + catalog/special-order saved price; no cost) |
| Maintenance `appendCopy()` (other location) | `CannedLineAppender.php:138-185` | **Exception: creates no part lines** (line 180) |
| Inspections, ShopCoach | `WorkOrdersBuildLineWriter::requestParts():133-171` → make-request | TP-S10-R1; usually no cost → $0 under the work order's tier (TP-S10-N1) |
| Received / staged part edit | `POST /api/work-orders/parts/change` | Typed price → Manual; **category change: PQ2, PENDING** (Branch B makes it an exception) |
| Receive modal (first cost or new cost) | `SpecialPartsGetsReceived` | TP-S11-R9 policy |
| PO receive | `AcceptDelivery` → `ReceiveWorkOrderPartsFromVendorSubscriber` | **Check first**: the client posts the sell price |
| Order item or vendor invoice cost | `UpdatePartRequestFromOrderItemSubscriber` | No reprice, as today (TP-S11-R10) |
| Split work order / Part Sale | Split handler, `PartSaleSplitter` | Repriced by the new work order's tier (TP-S11-E6) |
| Move between Part Sales | `PartSaleMover` | No reprice (TP-S11-R6) |
| Estimate approval | `ChangeStatus` / `Approvals` | No sell-price code (TP-S11-R14 holds) |
| Open API | Only `GET` for work-order parts and lines; `POST /api/v1/invoices` invoices an existing work order; no Part Sale routes | Creates no lines. It **does** write parts (`POST`/`PATCH /api/v1/parts` → fixed price uses the Default price) and categories (`POST`, NULL = General). |
| Imported invoices | `ImportCommandHandler:752-757` → `work_order_part_imported` | They **do** carry part lines, in a separate read-only table with no cost, category or matrix. Out of reach, so the PRD's conclusion holds even though its wording is imprecise. |

#### TP-S11-R12: can cost be re-entered on received parts?

Confirmed, with one gap.

- `UpdatePartRequestValidator::validateNotFullyReceived()` (`api/src/VehicleService/WorkOrders/Application/Service/Part/Request/UpdatePartRequestValidator.php:181-209`) refuses a **changed** cost on a received request on work orders.
- Part Sales are exempt until invoiced (`:191-196`, `validatePartSaleNotInvoiced():211-216`).
- `parts/change` accepts no cost at all.
- Found parts get a NULL cost (`PricingCalculator::cost()`).
- **The gap:** the same cost re-entered on a received work-order request passes validation and today reaches the reprice branch (`UpdatePartRequestDataResolver.php:488`). P3 closes it.
- **Not verified:** whether the server refuses a cost edit on inventory-sourced requests (the FE disables it).

#### TP-S19-R12: what is recorded today for matrices, tiers and categories

- **`entity_event`: nothing.** The `EntityEventType` list is closed and has no matrix, rule or category type.
- **Legacy `audit_log`** (separate database, 90-day purge, no read API in core): records category create, change and delete and matrix change and remove generically, but **skips `add_pricing_matrix`** (`LogCommandBus.php:355-363`).
- `part_category` has last-writer stamps only. `pricing_matrix` and `pricing_rule` have no stamps.

#### Section 6 assumptions

- **"The Open API writes nothing to work orders"**: holds, with the parts and category writes noted above.
- **"Imported invoices carry no part lines"**: wrong as worded (they do, in `work_order_part_imported`), but the conclusion holds because those lines can't be reached.
- **"No gaps on release day"** (TP-S1-E11): the code validates overlaps and gaps larger than one cent, but the handler skips category checks for empty input and has no domain invariant. Run a read-only gap and overlap count before release (M2 step 4).

---

### 3. Performance and security

#### TP-S10-R22 (about 0.3 s at 270 categories × 10 tiers × 20 ranges)

- One pricing call is at most three indexed queries per request, then memoized:
  - category→matrix map by client: about 270 rows on `pc__organization_id_idx`
  - one matrix side's ranges and cells: about 20 + 200 rows on `pmr__…_unq` and `pmtr__range_id_tier_id_unq`
  - tiers: about 20 rows
- The computation is O(ranges + chain), in microseconds.
- Batch flows (canned lines, split, picker, inventory lists) load every matrix they need in one query.
- No N+1 anywhere.

#### Indexes behind each new read

| Read | Index |
|---|---|
| TP-S2-R13 saved lines priced by a tier | `wopr__pricing_tier_id_pricing_source_idx`, `wop__…` |
| Open work orders keeping a tier | `wo__pricing_tier_id_status_idx` |
| Tier customer counts | `c__org_work_order_pricing_tier_part_sales_pricing_tier_idx` (covering `GROUP BY`); per tier `c__work_order_pricing_tier_id_idx` / `c__part_sales_pricing_tier_id_idx` |
| Manage Customers search | Client-scoped scan with `LIKE '%…%'` over that client's customers (accepted for a settings surface; the replica doesn't fix a bad query, but this one is bounded per client) |
| Categories list | `pc__organization_id_idx` plus the summary over `pmr`/`pmtr` |
| Matrices list | `pm__organization_id_idx` / `pm__organization_id_name_unq` |
| Audit | Existing `ee__organization_id_entity_type_entity_id_occurred_at_id_idx` |
| Snapshot | Window `ipl__work_place_id_invoice_created_on_invoice_id_idx`, credits `ipl__work_order_part_id_idx`, delete moves `ipl__part_category_id_idx` |

#### Tenant scoping

- Every new query repository scopes by client: tiers, matrices, categories, company, `entity_event`.
- Line tables are reached through `work_order.organization_id` / `workplace_id`; the snapshot is scoped by client and location.
- Every inbound id (tier, matrix, category, company, work order, part request, change id) is resolved through a scoped repository or a constraint validator. Collections fail whole on any foreign id.
- Every repository and query repository gets a tenant-isolation test.
- Pricing data is masked as **absent**, not zeroed, for users without See Financial Data. The `sellPriceTyped` flag and "Manual only when the user can change pricing" close the masked-pricing echo bug class.

---

### 4. Decisions, risks, product-visible ambiguities

#### Decisions needed (recommendation first)

**D1 Legacy rules and category list after release.**
- Recommend freezing `pricing_rule` and `pricing_matrix.categories` (stop reading and writing; drop in release B) plus the post-deploy catch-up command.
- Alternative: keep writing Default work-order-side rules back to `pricing_rule`. It can't represent + $ or mixed rules, keeps the old validations alive, and D5 already freezes the categories, so it buys little.
- Cost of freezing: a rollback prices by release-day rules (stale but no errors).

**D2 Pricing record storage.**
- Recommend columns for what is grouped, counted or filtered (`pricing_source`, `pricing_tier_id`, `priced_for_company_id`) and a JSON column for display-only details.
- Reason: TP-S2-R8 counts and the snapshot copy need indexed columns; about ten sparse detail fields on two tables of 1.2–1.4M rows don't.
- Alternatives: all columns (wide, a migration per new detail) or all JSON (unindexable counts).

**D3 Rounding.**
- Recommend exact integer math in PHP and SQL alike: TP-S10-R5 literal, matches the SQL twin.
- Cost: about 0.08% of sampled matrix prices move by one cent at half-cent ties (A1).
- Alternative: replicate the float math, a known-wrong formula frozen forever.

**D4 Simulator and below-cost math.**
- Recommend the stateless BE `evaluate` endpoint, called with a debounce: one implementation of the math.
- Alternative: FE-local math checked against `golden-vectors.json`, a third copy that can drift.

**D5 `entity_event` payload size.**
- Recommend no MEDIUMTEXT widening: a COPY rebuild with no concurrent writes on 8.85M rows during deploy.
- Instead: compact diffs with a 60 KB budget and truncation marker; customer lists in `entity_event_ref`.
- Size: realistic maximum 10 tiers × 20 ranges ≈ 15 KB.
- Alternative: a side table for oversized details.
- Check the COPY claim with `ALGORITHM=INPLACE` on a staging clone; MySQL refusing it confirms.

**D6 Audit workplace for writes without a header location** (Open API category create, CLI).
- Recommend the acting user's home location. If none, write nothing and log a WARNING; never block the Open API.
- Alternative: a 409, which would break `POST /api/v1/part-categories`.

**D7 Foreign keys on large tables.**
- Recommend RESTRICT keys added online with key checks off (SV-6468 precedent); they back up the TP-S2-R7/R8 checks.
- Alternative: index-only plus the domain checks.

**D8 Fixed-line-total residual.**
- Recommend recorded share = billed unit × quantity, so snapshots reconcile to the cent.
- The pure TP-S10-R13 split differs only when no quantity-1 part can absorb a leftover cent.

**D9 Snapshot cost basis.**
- Recommend per-row cost from the pricing DTO, proven equal to `WorkOrderStats::getPartsCost()` by the P2 fixture matrix.
- Fallback for any failing case: a per-part SQL mirror of `LinesStatsFetcher`'s conditions in a new query repository.

**D10 Module.**
- Recommend a new `Sales/Pricing` with the canonical layout, and delete `Sales/PricingRules`.
- Alternative: extend the legacy flat layout.

**D11 Golden Rule exemption.**
- M2 and the catch-up command touch every client.
- Statements are scoped per client and run under `runAs()`, but this still needs the "Golden Rule Exemptions" block and a developer sign-off, as other fleet-wide data migrations had.

**D12 Replica for Manage Customers and the tier Customers tab.**
- Recommend the writer now.
- Alternative: the replica, relying on the 2-second read-your-writes pin.

**D13 Set Rule and Undo as set-based writes.**
- Recommend set-based: up to about 270 matrices × 2 sides; no per-aggregate invariant beyond "one rule in every range".
- Alternative: loading every aggregate (tens of thousands of cell entities in one unit of work).

#### Risks

- **Large test churn**: 88 test files reference `PricingRules`, the applier or the pricing tables.
- **PO receive sell price** (item 4 at the top) must be resolved before P3.
- **Snapshot reconciliation** may surface existing cost-basis differences (cores, partial receipts) as ERROR logs; the P2 fixture matrix is meant to catch them first.
- **Old code during the deploy window**: matrix edits are lost from the new tables (covered by the catch-up command). Customers, work orders and lines written by old code get NULL = Default or before tiers (correct).
- **Archive and assignment race**: a tier could be archived while a customer is being assigned to it. Small window, backed by the foreign key; noted, not engineered away.
- **Category delete set-based moves**: managed entities in that request go stale (document it; clear the identity map after commit).
- **FE breakage**: `app/src/api/parts/index.ts:388-419` and `app/src/api/sales/index.ts:18` call removed routes; this needs the matched FE change in the same PR.
- **SV-11258** has no commits yet. Recommend folding it into this PR, since the Matrices and Categories lists ship with server-side sort and search, and marking it superseded (a Jira action for you).

#### Product-visible ambiguities (for Product, not engineering)

- **A1 (TP-S1-R3 vs TP-S10-R5):** about one in 1,300 matrix prices moves by one cent at half-cent ties under exact rounding.
- **A2 (TP-S12-R5 vs TP-S4-R15/S12-R15):** for a renamed non-Default tier, should Priced by and the details show the recorded name or the current one? The API returns both.
- **A3 (TP-S14-R2 vs TP-S16-R5):** should a user without See Financial Data see the "n lines priced for the previous customer" notice? Recommend withholding it.
- **A4:** a work order re-created by `PayedWorkOrderReopenedSubscriber` (adding a line to a paid work order): the customer's current tier (recommended) or the source work order's tier?
- **A5 (TP-S10-R13):** where a leftover cent lands when no quantity-1 part exists (labor, as today).
- **A6:** a stale grid save gets 409 "Saved by someone else". TP-S19-E2 lists only name, category and archived-tier conflicts.
- **A7 (TP-S11-R5):** clearing a sell price restores the calculated price; today it writes $0.
- **A8:** the Matrices list "Categories" sort: by count (TP-S19-R22 suggests highest first) or by name?
- **A9 (TP-S1-E9):** which duplicate keeps the plain name (proposed: General first, then id order).
- **A10 (settled):** the reports PRD (page 18, S1-R3 and S1-R9) puts a part's core and environmental charges, and any fee or discount attached to that single part, in the part's row and category. The snapshot does this: non-part rows copy the parent part's category and pricing fields, and part-line adjustments sit on the part's row (Section 6 Phase 3).
- **A11:** release-day data anomalies: rule-less matrices get the General Matrix's ranges; clients with no default matrix get the seeded General Matrix (today they error).
- **A13 (TP-S19-R23):** a bulk add also writes an entry on each previous tier's log.
- **Pending (please route to Product):**
  - PQ2: category change on a received part.
  - PQ3: reserved category name.
  - PQ5: tier name length; the column is 100, the domain caps at the answer (proposal 50).
  - PQ6: Tax row mapping; the API returns the raw flags.

#### Definition-of-Done gates by phase

| Phase | Gates |
|---|---|
| P1 | Static checks (cs-fix, phpstan on the changed files, pest), migration gate, `doctrine:migrations:diff` reports "No changes detected" |
| P2–P7 | Static checks plus `bin/smoke-test.sh` |
| After the FE half lands | Browser walk |
| PR description | Per migration: why the previous release still works; "step 1 of 2" plus the release-B ticket link; the "Golden Rule Exemptions" block for D11 |

---

## Appendix B — Frontend design (fe-planner, 2026-11-11)

> **Read with Sections 3, 5 and 9, which win on any conflict.** The API contract in §5 below is superseded by Section 5 of the plan. §2.6's "separate small CI PR" is dropped (D22). Trade-offs: T1 (a), T2 (a), T3 → per tab (PQ15), **T4 overridden** (Undo toast hosted app-wide, D21), T5 (a), T6 BigInt, T7 lazy, T8 extend `QueryState`, T9 (a), T10 → D22, T11 query, T12 picker close (D21).
> **§10 ambiguities resolved:** 1→PQ3, 2→PQ5, 3→PQ6, 4→D21 (nearest typed range above), 5→literal TP-S4-R4 (a new range counts once; a type change and a cell count separately), 6→PQ14, 7→PQ15, 8→D21, 9→PQ13, 10→D21 (both places), 11→D21 ("Before tiers"), 12→TP-S7-R1 has no QuickBooks column, TP-S8-R10 New Category has the field, 13→PQ7, 14→PQ12, 15→PQ16, 16/19/20/21/24/27→follow the named design screens at implementation, 17→D21, 18→PQ17, 22→PQ11, 23→light the nav item of the breadcrumb root, 25→"Priced by", as the PRD writes it (D21), 26→TP-S12-R2 as written, 28→the Part Sale switch is disabled while a grid is in edit, 29→PQ18, 30→DOM order, 31→`/release-note` at the `.0` release, 32→D21.
> **Product round 1 (PRD page version 33) answered every PQ above; where this appendix differs, Sections 3, 5 and 6 supersede it:** F3's single page-level edit session across both tabs becomes one session per tab with a Discard question on tab switch (PQ15); F3's "Simulator in this view: ⏸" becomes a simulator under the archived grid (PQ17, D30); C-G's `tax` is `{taxId, name}` and F7's Tax row shows the tax's name or "Default Tax Settings" (PQ6); §8 risk 2 and §10 item 29 are answered (PQ18, D32); §10 item 1 (PQ3) is moot since page 37 reserves no category name; the remaining §10 items routed to Product (1–3, 6, 7, 9, 13–15, 18, 22) are answered as Section 1 → Clarifications records.
> **Audit fixes (2026-11-11) also supersede this appendix:** F8's add paths send `costTyped` too, and the inline row reprices on a retyped same cost (Section 6 Phase 6); every `calculate-sell-price` caller, `InventoryPartDialog.vue` included, skips it without See Financial Data and the endpoint is non-ejecting (D34); the column label is "Priced by"; both of F3's "Discard these changes?" questions read Keep Editing / Discard Changes (TP-S3-R18, TP-S19-R3, PQ24), so F0's `DiscardChangesDialog` buttons change too; §10 item 28 disables the Part Sale switch only while the Part Sale tab is in edit.

### Tiered Pricing: frontend plan (app/)

**Basis:** PRD v32 (ids cited as `TP-Sx-…`), the FE and BE research files, and my own checks of the code on `develop` @ 3cea6a5f99. I could not open the design canvas, so the plan works only from its screen titles. Every API shape below is **a contract to reconcile with BE**. The orchestrator's three additions are folded in: the add-part prefill fix (§1.2, F8), the pending Product answers PQ5 and PQ6 (§10), and the production scale numbers (§8).

---

#### 0. Goal

Ship the whole Tiered Pricing frontend in one PR, as ordered phases with one commit per phase:
- **Settings › Pricing** becomes Tiers / Matrices / Fixed Rules, with real pages for a tier, a matrix and a category, plus breadcrumbs.
- **The tier grid** is built along with the simulator and the below-cost warning. Both are computed in the browser and pinned to the backend resolver by shared test vectors.
- **Customer screens:** tier fields in Edit/New Customer, a Pricing section on the customer card, and Manage Customers.
- **Work order and Part Sale lines:** the Priced by column, the price details popover and the Manual icon.
- **Smaller changes:** Change Customer copy and notices, the receive notice text, and Audit Log dialogs.
- **Legacy removal:** `PricingMatrixDialog.vue`, `CategoryDialog.vue` and the `parts` Vuex pricing slots go.

---

#### 1. Facts I found beyond the research file (they change the plan)

##### 1.1 Work order Parts tab: a column takes five coordinated edits, not four
The research file lists four edits. There is a fifth: `lineDescriptionColspan` at `app/src/components/ts/work-orders/WorkOrderPartRequests.vue:1721-1727` hard-codes the cell count (`9`, `+3` for financial, `+1` for margin). It must add 1 when Priced by is visible, or every work-order line header row breaks.

##### 1.2 Adding a part would save the Default price as Manual (orchestrator item 1, confirmed)
- `InlinePartRow.vue:2423` prefills `draft.sellPrice = option.sell_price`.
- `InlinePartRow.vue:941-982` previews with `calculate-sell-price {category_id, cost}` only.
- `buildPayload` at `InlinePartRow.vue:1827` **always** sends `payload.sell_price`.
- `PartDialog.vue:1361` and `:1492-1498` do the same.

With tiers, the line would show the Default price while adding and then be recorded as Manual (`TP-S11-R5`).

Related contract gaps:
- `FetchPartsOptionsParams` (`api/work-orders/WorkOrdersModel.ts:~2412`) has no work-order context.
- `SalesCalculateSellPricePayload` (`api/sales/SalesModel.ts`) is `{category_id, cost}` only.

##### 1.3 The purchase-order receive pages preview the sell price the old way
`resolveSellPreview` in `components/ts/parts/receive/MultiVendorReceiveModel.ts:131-230` is a client copy of the backend's `SpecialPartsGetsReceived::resolveCostAndSellPrice()`. It is consumed in `useReceiveView.ts:1001-1071`, and `sellPriceQueryOptions(categoryId, costCents)` lives at `api/sales/queries.ts:36`.

For a tier-priced line received at a new cost, it previews "keep margin". `TP-S11-R9` says such a line is priced again by its recorded tier. The preview must follow the backend's change. This is in `TP-S11-R9` scope, which the task list did not name.

##### 1.4 The receive notice constant should change for all three surfaces
`COST_MARGIN_NOTICE` (`MultiVendorReceiveModel.ts:114-115`) is shared by:
- the work-order receive modal (`ReceivePartsModal.vue:18-24`),
- `PurchaseOrderReceive.vue:111`,
- `MultiVendorReceive.vue:69`.

Both purchase-order pages receive work-order purchase-order rows and rewrite their sell price (the SV-11006 comment at `:124`). So "to keep the margin" is false for a tier-priced line on any of the three. **Change the single constant.**

Three unit specs assert the old string: `ReceivePartsModal.spec.ts:5687`, `PurchaseOrderReceive.spec.ts:5071`, `MultiVendorReceive.spec.ts:5153`.

##### 1.5 Existing shared components do not say what the PRD says
- **`QueryState.vue`** says "Unable to load {subject}." with "Retry", and has 82 consumers. The PRD needs "Ooooops! An error occurred" with "Try again" (`TP-S19-R10`), and a skeleton (`TP-S19-R7`).
- **`FilteredTableEmptyState.vue`** has fixed copy ("No X found" / "Clear all filters"). The PRD needs `'No matrices match the search "…".'` with "Clear Search", and so on.
- **`BulkBar.vue`** always renders "{count} selected". The Set Rule bar needs "2 matrices" (`TP-S2-R22`).

##### 1.6 Quasar Notify cannot pause, but there is a precedent
`schedule-next/UndoToastHost.vue` with `useUndoableScheduleMutation.ts:110-165` is a custom toast that pauses on hover and focus, built because Notify's timeout can't be paused. `TP-S2-R27` (20 seconds, pauses on pointer or focus) needs the same thing.

##### 1.7 A per-user list-state store already exists
`composables/usePagePreferences.ts` stores per-user state at `GET/PUT /api/users/me/preferences/{pageKey}`. Page keys are free-form `^[a-z0-9-]{1,64}$` (`api/src/IAM/Preferences/UI/HTTP/GetPagePreferenceController.php:26`), so **no backend change is needed** to remember filters, sort and page per user. The accounting lists already use it.

##### 1.8 Other usable precedents and leftovers
- **`HoverCard.vue` and `useHoverCardTrigger.ts`** handle hover, focus, Enter/Space and tap, with a bottom sheet on phones. Its trigger is a `role=button` span, so it **cannot wrap the editable sell-price input**. Reuse the composable; build a dedicated anchor for inputs.
- **Phone width:** `TP-§5` defines a phone as narrower than 768 px. `useScreen` has no 768 breakpoint; `HoverCard` uses `ltSm` (600). `WorkOrderPartRequests` already uses `@media (max-width: 767.98px)`.
- **Dead prop:** `FixedRuleDialog.vue:163,183` declares a `defaultMatrix: Record<string, unknown>` prop and never reads it.
- **SV-11258** (Pricing/Categories sorting) has no code or branch on develop, so fold it into the Matrices list (`TP-S6`).

---

#### 2. Architecture decisions

##### 2.1 Folder layout
- **API:** a new domain `app/src/api/pricing/`
  - `index.ts` (`pricingApi`), `Model.ts`, `keys.ts`, `queries.ts`, `invalidation.ts` (the maintenance precedent), `tests/`.
  - Re-exported from `app/src/api/index.ts`.
  - Category create/update/delete stay in `api/parts` because they use the existing `parts-catalogue` endpoints.
- **Components:** a new feature tree `app/src/components/ts/pricing/`
  - `engine/`, `grid/`, `matrices/`, `tiers/`, `categories/`, `lines/`, `customers/`, `fixed-rules/`, `shared/`, plus `Model.ts` for component-local types (GR#4).
- **Tab hosts keep their paths:** `components/ts/parts/Pricing.vue` and `components/ts/parts/Categories.vue` are rewritten in place, because `pages/Administration.vue:132-137` imports them.

##### 2.2 Routing
Copy the `MaintenanceSchedules` precedent (`router/routes.ts:1195-1230` plus `MaintenanceSchedules.vue:1-7, 290-298`).

`routes.ts:1066-1083`: `Categories` and `Pricing` change from `component: EmptyTabView` to `component: RouterView`, each with children:

```ts
{ path: 'pricing', name: 'Pricing', component: RouterView,
  meta: { requiredPermissions: ['settingsParts'], title: 'Pricing' },
  children: [
    { path: 'tiers/new', name: 'PricingTierNew', component: () => import('@/components/ts/pricing/tiers/TierPage.vue'),
      meta: { requiredCheck: canManagePricing, title: 'New Tier' } },
    { path: 'tiers/:tierId', name: 'PricingTier', props: true, component: () => import('@/components/ts/pricing/tiers/TierPage.vue'),
      meta: { requiredCheck: canManagePricing, title: 'Tier' } },
    { path: 'matrices/new', name: 'PricingMatrixNew', component: () => import('@/components/ts/pricing/matrices/MatrixPage.vue'),
      props: (r) => ({ matrixId: null, preselectCategoryId: typeof r.query.categoryId === 'string' ? r.query.categoryId : null, view: 'active' }),
      meta: { requiredCheck: canManagePricing, title: 'New Matrix' } },
    { path: 'matrices/:matrixId', name: 'PricingMatrix', component: () => import('@/components/ts/pricing/matrices/MatrixPage.vue'),
      props: (r) => ({ matrixId: getRouteParam(r.params.matrixId), preselectCategoryId: null, view: r.query.view === 'archived' ? 'archived' : 'active' }),
      meta: { requiredCheck: canManagePricing, title: 'Matrix' } },
  ] },
{ path: 'categories', name: 'Categories', component: RouterView,
  meta: { requiredPermissions: ['settingsParts'], title: 'Categories' },
  children: [
    { path: 'new', name: 'CategoryNew', component: () => import('@/components/ts/pricing/categories/NewCategoryPage.vue'), meta: { requiredPermissions: ['settingsParts'], title: 'New Category' } },
    { path: ':categoryId', name: 'Category', props: true, component: () => import('@/components/ts/pricing/categories/CategoryPage.vue'), meta: { requiredPermissions: ['settingsParts'], title: 'Category' } },
  ] },
// canManagePricing = () => permissionService.has('settingsParts') && permissionService.seeFinancialData()   (TP-S16-R5)
```

Supporting changes:
- `pages/Administration.vue:222-254`: map the new route names to `'pricing'` and `'categories'`.
- `Pricing.vue` and `Categories.vue` render `<router-view>` instead of the list when the route is a child (the `isEditorRoute` pattern).
- Inclusive matching in `AdminLeftMenuNav` keeps Pricing or Categories lit (see the comment at `AdminLeftMenuNav.vue:17-20`).
- The Pricing tabs live in the URL as `?tab=tiers|matrices|fixed-rules`, written with `replaceQuery`. The tier page uses `?tab=pricing|customers`.

##### 2.3 Where the breadcrumb comes from
Store the origin in **`history.state`**, not in the URL. `TP-S3-R26` says a link or bookmark shows the default trail, and history state gives exactly that.

```ts
router.push({ name: 'PricingMatrix', params: { matrixId },
  state: { pricingOrigin: { kind: 'tier', tierId, tierName }, startInEdit: true, focusTierId: tierId } })
```

Read it from `router.options.history.state` (typed `HistoryState`) with a type guard in `pricing/shared/pricingOrigin.ts`. That avoids `unknown`/`as` (GR#10).

##### 2.4 State
- **Server state:** TanStack Query only (no new Vuex).
- **List state** (search, filters, sort, page): one `usePagePreferences` document per list, through a small `pricing/shared/usePricingListState.ts`.
- **Page keys:** `settings-pricing-tiers`, `settings-pricing-matrices`, `settings-categories`, and `settings-tier-customers`. The last stores `{tierId, …}` and applies only when the tier matches.

##### 2.5 Pricing engine
Pure TypeScript in `pricing/engine/`, using **BigInt integer arithmetic** throughout. Values are sent as integers in hundredths: cents for `$` rules, hundredths of a percent for `%` rules.

##### 2.6 Shared test vectors
- **Location:** `app/src/components/ts/pricing/engine/vectors/tier-pricing-vectors.json`.
- **Frontend:** Vitest imports it as a JSON module (precedent: `whatsnew/composables/useDocumentMeta.ts:1`). Strings map onto unions through exhaustive `switch` mappers, so no `as` is needed.
- **Backend:** PHP reads the same file, as `api/tests/Unit/ReleaseNotes/Infrastructure/Seed/BundledReleaseNoteFrontendParityTest.php` already reads `app/`.
- **CI:** frontend CI triggers on `app/**`. Backend CI's `tests` filter (`.github/workflows/be-ci.yml:138-162`) needs one line for this file, the same way it already lists `app/src/config/releaseNotes/releases/**`.
  - Because it is a `.github/` change, ship it as a **separate small CI PR** (the root `AGENTS.md` "Changing CI" rules).
  - Until it lands, a vectors-only edit runs no backend tests.

---

#### 3. Phases (dependency order, one commit each)

Backend dependencies are named by contract group (§5): **C-B** tiers, **C-C** matrices, **C-D** tier↔matrix and Set Rule, **C-E** tier customers, **C-F** category pricing, **C-G** customer tiers, **C-H** line pricing, **C-I** Change Customer, **C-J** Audit Log.

Every phase adds default MSW handlers in a new `app/src/testing/pricingHandlers.ts`, spread into `src/testing/handlers.ts` (the "stubs are code" rule). That lets frontend phases build before the backend lands.

**Static gates for every phase:** `npx eslint --max-warnings=0 <files>`, `npx vitest related --run <files>` (with the team's worker cap), and `npx vue-tsc --noEmit`.

**Login for every browser-walk:** the `admin` quick-login user. For `TP-S16`, also a locally created role with 'Settings — Parts' but without 'See Financial Data'; quick-login has no such user.

---

##### F0. Foundations
**Backend needs:** the vectors file format agreed (C-A). No endpoints.

**Requirements:** `TP-S5-R3`, `TP-S10-R3..R5`, `TP-S10-R15`, `TP-S3-E3`, `TP-S15-R5`, `TP-S15-N3..N5`, `TP-S4-R31`, `TP-S19-R3`, `TP-S19-R7`, `TP-S19-R10`, `TP-S2-R27` (host only).

**Create:**
- `api/pricing/{index,Model,keys,queries,invalidation}.ts`
  - Model gets every contract type in §5.
  - index, keys and queries grow per phase.
- `components/ts/pricing/engine/`:
  - `money.ts`: rounding and string-to-cents parsing.
  - `price.ts`: `fromCostPrice`, `tierCellPrice`, `rangeIndexFor`, `priceSide`.
  - `belowCost.ts`.
  - `summarize.ts`: column → `RuleSummary`.
  - `format.ts`: short labels ("10% off", "Cost + $5.50", "35% markup"…), summary labels, below-cost tooltip, money format. The Default name is passed in (`TP-S4-R15`).
  - `followers.ts`: tiers that price from Default (`TP-S4-R30`).
  - `Model.ts`.
  - `vectors/tier-pricing-vectors.json`.
  - `tests/{price,belowCost,summarize,format,vectors}.spec.ts`.
- `components/ts/shared/Breadcrumbs.vue`: wraps `q-breadcrumbs`. Props `items: {label, to?, testId}[]`; the last item is plain text with `aria-current="page"`; long names are truncated with `TruncatedTextTooltip`.
- `components/ts/shared/skeletons/{TableSkeleton,GridSkeleton,PageHeaderSkeleton}.vue`: built on `q-skeleton`, props for rows and columns.
- `components/ts/shared/toasts/{PausableToastHost.vue,usePausableToasts.ts}`:
  - generalises the schedule `UndoToastHost` (do not refactor the schedule one);
  - `show({message, caption, timeoutMs, actions: [{label, testId, handler}], testId}) → {dismiss}`;
  - pause and resume on mouseenter/mouseleave and focusin/focusout;
  - `role="status"` and `aria-live="polite"`.
- `components/ts/shared/dialogs/DiscardChangesDialog.vue`: a `BaseDialog` titled "Discard these changes?" with buttons Keep Editing / Discard Changes (TP-S19-R3, page 35).
- `composables/useUnsavedChangesGuard.ts`: wraps `onBeforeRouteLeave`, `onBeforeRouteUpdate` and `beforeunload`, copied from `MaintenanceScheduleEditor.vue:684-748`. Exposes `{isDialogOpen, confirmLeave, resolve}` so Cancel buttons can reuse it.
- `pricing/shared/`:
  - `usePricingAccess.ts`: reactive `canManagePricing`, `canSeeTierCustomers` (+ customers view), `canManageTierCustomers` (+ customers edit), `canSeeFinancial`, built on `usePermissions()`.
  - `usePricingListState.ts`.
  - `pricingOrigin.ts`.
  - `ListEmptyState.vue`: message, optional action label and action event, test ids.
  - `RuleSummaryText.vue`: label plus the full sentence on hover.
  - `PricingAuditLogDialog.vue`.

**Modify (additive, small blast radius):**

| File | Change | Consumers to regression-check |
|---|---|---|
| `shared/QueryState.vue` | optional `errorMessage`, `retryLabel` props and a `#loading` slot; defaults unchanged | 82 |
| `shared/BulkBar.vue` | `#count` slot defaulting to today's markup | `work-order-lines/BulkActionBar.vue`, `parts/inventory/InventoryBulkStatusBar.vue` |
| `shared/EditableTitle.vue` | `maxlength?: number` passed to the inner `Input` (for PQ5) | 3 |
| `composables/useScreen.ts` | `isPhoneWidth = computed(() => Screen.width < 768)` | — |

**Tests:**
- Vectors spec runs every price, summary and below-cost case.
- Property tests: From cost and Default never sell below cost; `$ Off` below-cost costs form a prefix of the range.
- Unit tests for `Breadcrumbs`, `PausableToastHost` (pause, resume, timeout, action), `useUnsavedChangesGuard`, and `BulkBar` (#count slot, default unchanged).

**DoD:** static gates; compile gate. No browser-walk yet (no route renders).

---

##### F1. Settings › Pricing shell, nav order, Fixed Rules, Matrices list
**Backend needs:** C-C list, options, duplicate, delete; C-J (matrices list log); C-B tier options for tooltips.

**Requirements:** `TP-S6-R1..R11`, `TP-S6-R3`, `TP-S6-R6`, `TP-S7-R14`, `TP-S16-R11`, `TP-S16-N1` (as today), `TP-S3-N3`, `TP-S3-R8`, `TP-S3-R9`, `TP-S19-R7`, `TP-S19-R10`, `TP-S19-R19` (list), `TP-S19-R22`.

**Modify:**
- `components/ts/parts/Pricing.vue` becomes the shell:
  - child route → `<router-view>`; otherwise the tabs.
  - Tabs: `tab_pricing_tiers`, `tab_pricing_matrices`, and `route_tab_fixed_rules` (id kept).
  - Without See Financial Data, only Fixed Rules shows (`TP-S16-R11`).
  - Mounts `PausableToastHost`.
  - Keeps the Administration default `<slot>`.
- **Create** `pricing/fixed-rules/FixedRulesTab.vue`: today's fixed-rules panel moved verbatim (Vuex fetch, `FixedRuleDialog`). `usePageSearchUrlSync('administration-pricing')` is gated to this tab. Drop the dead `default-matrix` prop.
- `AdminLeftMenuNav.vue:229-276`: reorder to Categories, Pricing, Bin Locations (`TP-S7-R14`). Ids unchanged.
- `routes.ts` and `Administration.vue` per §2.2. Tier and category children point at stubs until F3/F4/F6, or land with those phases.
- `components/work-orders/history/AuditLogDialog.vue`:
  - `subject` gains `'pricing'`, which drops the snapshot and Line columns (`TP-S19-R19`);
  - `buildDetailItems` (`:626`) gains an early pricing branch that renders `row.summary` and `row.changes[]` as "label: old → new";
  - add `changes?: {label: string; oldValue: string | null; newValue: string | null}[]` and `summary?: string | null` to `WorkOrderAuditHistoryEntry` (`api/work-orders/WorkOrdersModel.ts:2803`).

**Create:**
- `pricing/matrices/MatricesTab.vue`:
  - A paged `Table` (`:disable-virtual-scroll`, bottom pagination, rows-per-page `[50]`, `@request`).
  - Columns: Matrix (sortable), Status badge with the Inactive tooltip, Categories (≤3 then "+N" with hover, or "—"; sortable), Tiers ("All" or "1, 2, 4" with names on hover), Work Order Matrix (Default's summary), Part Sale Matrix (On/Off), Edit, ⋯ (Duplicate, Delete).
  - The General Matrix is first, with `DefaultBadge`, and its Delete is disabled with a tooltip.
  - Search via `PageSearchInput`; Status filter via `FilterBar` (single select).
  - New Matrix button; list ⋯ menu with Audit Log.
  - Empty states per `TP-S6-R3`. Load error via `QueryState` (new copy) inside the table area, keeping the list state.
  - Number columns use `sortOrder: 'da'`.
- `pricing/matrices/DeleteMatrixDialog.vue`: a `BaseDialog` that names the categories (`TP-S3-R9`).
- Queries: `useMatricesListQuery(params)` with `placeholderData: keepPreviousData`, `useMatrixOptionsQuery`, `useDuplicateMatrixMutation` (then push to the copy's page), `useDeleteMatrixMutation`.

**Delete:** `components/ts/parts/tests/Pricing.spec.ts`; rewrite it as `Pricing.spec.ts` plus `MatricesTab.spec.ts`.

**Tests:**
- Shell: tab visibility by permission, `?tab` restore, child route renders the router-view.
- `MatricesTab`: columns, empty states, the General row, disabled Delete tooltip, Duplicate navigates, a load error shows Try again and keeps the search.
- `AuditLogDialog`: the pricing subject hides Line and snapshot and renders changes.
- `AdminLeftMenuNav`: order.

**DoD:** compile; browser-walk `/administration/pricing?tab=matrices` (admin) and the restricted role (only Fixed Rules shows).

---

##### F2. Matrix page in view, simulator and below-cost warning
**Backend needs:** C-C detail (`view=active|archived`), rename, categories, Part Sale side on/off; C-B tier options; C-J matrix log.

**Requirements:** `TP-S3-R18`, `TP-S3-R13`, `TP-S3-R26`, `TP-S3-R28`, `TP-S3-R21`, `TP-S3-R31`, `TP-S3-R27`, `TP-S3-N4`, `TP-S4-R1`, `TP-S4-R3`, `TP-S4-R27`, `TP-S4-R28` (view: Mixed rules), `TP-S4-R31`, `TP-S5-R1..R6`, `TP-S5-N1`, `TP-S15-R2..R5`, `TP-S15-N3..N5`.

**Component tree:**
```
MatrixPage.vue
├─ Breadcrumbs (origin from history state, else Settings › Pricing › Matrices › <matrix>)
├─ MatrixHeader.vue
│   EditableTitle (saves on blur/Enter; inline errors; Esc cancels), "Inactive" plain text,
│   ⋯ MatrixMenu (Audit Log; Duplicate/Delete where the design shows them),
│   Edit button / edit bar (F3)
├─ MatrixCategoriesLine.vue
│   names, or "All categories without a matrix (n)" for the General Matrix;
│   picker MatrixCategoriesPicker.vue: multi-select with search and Select all, "Now: <matrix>",
│   no Uncategorized; disabled for the General Matrix (TP-S3-N4)
├─ q-tabs: Work Order Matrix | Part Sale Matrix
└─ per side: PartSaleSwitch.vue (PS tab: switch + info tooltip; off = no grid)
             TierGrid.vue (mode="view")
             PricePartSimulator.vue
```

**Create:**
- `pricing/grid/`:
  - `TierGrid.vue`: a semantic `<table>`; Cost Range is sticky; Default column, then active tiers by number with number and name (cut short with "…" and a full-name hover); the cells' short labels; "Uses previous tier"; below-cost icons with screen-reader name and tooltip.
  - `TierGridHeaderCell.vue`, `TierGridCell.vue`.
  - `useGridColumnWidth.ts`: a ResizeObserver clamps `(width − costColumn) / n` to the range 128–176 px, sets `--tier-col-w` through a dynamic `:style`, and the grid's max width is 1,760 px (`TP-S4-R27`).
  - `GridSkeleton` use.
  - `Model.ts`.
- `PricePartSimulator.vue`: one `CurrencyInput` starting at 100.00. Columns line up with the grid through the same CSS variable. It prices the resolved side (the draft while editing, after F3). Each column shows the price and "$12.50 profit" (negative with a minus sign), and the below-cost icon with "Below cost.". Invalid input shows an error and "—" everywhere.
- `TurnOffPartSaleDialog.vue`.
- Queries: `useMatrixQuery(id, view)`, `useTierOptionsQuery()`, `useRenameMatrixMutation` (sets the detail cache from the response), `useSetMatrixCategoriesMutation`, `useEnablePartSaleSideMutation`, `useDisablePartSaleSideMutation`.
- Name errors map from 422 codes (`required`, `tooShort`, `tooLong`, `taken`) to inline text. The old name is kept on error (`TP-S3-R18`).

**Tests:**
- `TierGrid` view: labels, Mixed rules header, warning icon and tooltip text from the engine.
- Simulator: $100 default, updates while typing, 0 or empty shows "—" and an error, below-cost icon.
- Header: rename success and taken error.
- Categories picker: "Now:", Select all, General disabled.
- `PartSaleSwitch`: on saves immediately; off asks first.

**DoD:** compile; browser-walk `/administration/pricing/matrices/<id>` (admin), open from the Matrices list, check the breadcrumb, both tabs, the simulator, and the switch on and off.

---

##### F3. Grid edit, New Matrix, save flows, archived view, discard guard
**Backend needs:** C-C `PUT …/rules` (with versions and 409 conflicts), `POST /matrices`, the archived view.

**Requirements:** `TP-S3-R5`, `TP-S3-R6`, `TP-S3-R12`, `TP-S3-R16`, `TP-S3-R20`, `TP-S3-R23`, `TP-S3-R25`, `TP-S3-R30`, `TP-S3-R32`, `TP-S4-R4`, `TP-S4-R5`, `TP-S4-R7`, `TP-S4-R10`, `TP-S4-R12`, `TP-S4-R16`, `TP-S4-R18..R20`, `TP-S4-R22`, `TP-S4-R26`, `TP-S4-R28..R30`, `TP-S4-R32`, `TP-S4-N1`, `TP-S4-E3`, `TP-S15-R3`, `TP-S19-R3`, `TP-S19-R6`, `TP-S19-R14`, `TP-S19-E2`, `TP-S1-E12`.

**Create (in `pricing/grid/`):**
- `gridDraft.ts` (pure functions): `buildDraft(detail)`, `resolveSide(draft, tierOrder)`, `typeCell`, `pickColumnType` (clears values and sets `lastFollows = true`), `pickCellType` (`TP-S4-R28`), `addRange` (before the last), `removeRange` (merges into the range above), `setRangeEnd`, `countChanges`, `describeChanges` (for the toast), `validateDraft` (returns `GridError[]` with coordinates and messages), `toSaveInput`, `changedCellKeys`.
- `useGridDraft.ts`: reactive wrapper around one page-level session covering both sides.
- `RulePicker.vue`: a `Select` with group headers "Off <Default name> price" and "From cost", plus "Previous tier" for tiers. Default lists only From cost (`TP-S4-N1`). The current value reads "Mixed rules" but it is never an option.
- `CellSymbolPicker.vue`: the per-cell symbol picker; Alt+Down opens it.
- `RangeEndInput.vue`.
- `useGridKeyboard.ts`: intercepts Tab and Shift+Tab inside body cells only (down a column; last row → first row of the next column; the range-end column works the same way). Header pickers stay in DOM tab order before the body (`TP-S4-R29`, `TP-S19-R6`).

**Create (in `pricing/matrices/`):**
- `useMatrixEditSession.ts`: Edit (also from `history.state.startInEdit`), the change count, Cancel through the discard guard, Save orchestration (below), the changed-cell highlight that stays until leaving the page (`TP-S4-R20`), and a conflict banner (`banner_grid_conflict`) that keeps the draft.
- Dialogs: `ChangeAllDialog.vue` (`TP-S4-R16`), `SaveGeneralMatrixDialog.vue` (`TP-S4-R18`), `ChangeDefaultPricesDialog.vue` (`TP-S4-R30`; the follower list joins the other two dialogs).

**New Matrix** (`TP-S3-R30`): the head shows Cancel and Create Matrix; one range from $0.00; empty Default; every tier on Previous tier. A `?categoryId` query pre-picks a category (`TP-S7-R11`).

**Archived view** (`?view=archived`, `TP-S4-R19`, `TP-S4-R32`):
- Default plus archived tiers; only the archived columns are editable.
- The notice ("Archived tiers don't price parts. …") uses `WarningBanner`.
- Default's column shows its tooltip.
- Saving skips every dialog.
- Simulator in this view: ⏸ (§10, item 18).

**Save orchestration:**
```
validate → if errors: highlight + message (Save blocked)
followers = defaultRulesChanged(draft, baseline) ? tiersPricingFromDefault(resolved) : []   // per side, union of names
view === 'archived' → save
isGeneral → SaveGeneralMatrixDialog(n, followers)
categories.length > 1 → ChangeAllDialog(categories, followers)
followers.length → ChangeDefaultPricesDialog(followers)
else → save
save: useSaveMatrixRulesMutation → setQueryData(detail) from response (read-replica rule) + invalidate lists
      → toast "<matrix> saved" / describeChanges(...) / "Parts already on work orders keep their prices."
      → back to view
```

**Tests** (`gridDraft.spec.ts` is the core and is table-driven):
- auto-fill follows the nearest entered range;
- the last range follows the range above; typing a different value breaks the follow, typing it back restores it;
- Previous tier fill and conversion;
- change count (changed then reverted = 0; auto-fill not counted; range add, remove and end move; column type change);
- every `TP-S3-R6` validation;
- `toSaveInput` includes gray values;
- followers (`TP-S4-R30`);
- archived view rules.

Component tests:
- `TierGrid` edit: typing auto-fills gray; Tab order; Alt+Down opens the symbol picker; Add/Remove range.
- `MatrixPage`: Save routes to the right dialog; a 409 keeps the draft; Cancel with changes asks.
- `useUnsavedChangesGuard` with a router mock.

**DoD:** compile; browser-walk: edit and save a single-category matrix, a shared matrix, and the General Matrix; New Matrix; discard on leave; archived view (needs an archived tier, so verify after F4).

---

##### F4. Tiers list, tier page, archive/delete/reactivate, Set Rule with Undo
**Backend needs:** C-B, C-D, C-J.

**Requirements:** `TP-S2-R1`, `TP-S2-R3`, `TP-S2-R5..R8`, `TP-S2-R12..R15`, `TP-S2-R17`, `TP-S2-R18`, `TP-S2-R20`, `TP-S2-R22..R30`, `TP-S2-N7`, `TP-S2-N8`, `TP-S2-E2`, `TP-S2-E5`, `TP-S16-E1`, `TP-S19-R6` (Enter creates), `TP-S19-R14`.

**Create (in `pricing/tiers/`):**
- **`TiersTab.vue`:**
  - Paged list, 50 per page; Status filter (`FilterBar`, defaults to Active).
  - Columns: `#` (plain text), Name (`DefaultBadge` only when Default has been renamed), Customers (distinct count, with the channel split on hover), Matrices ("All" or "4/5"), Status, ⋯.
  - Empty state "No archived tiers yet."; New Tier; list ⋯ menu with Audit Log.
  - Row click goes to `PricingTier`.
- **`TierMenu.vue`:** shared by the row and the page.
  - Active tier: Archive, Delete, Audit Log.
  - Archived tier: Reactivate, Delete, Audit Log.
  - Delete is grayed with the `TP-S2-R13` tooltip from `row.deleteBlock`.
  - Default tier: no Archive or Delete.
  - `useAsyncAction` latches on the menu items (async-actions.md §4).
- **`TierPage.vue`:**
  - Breadcrumbs; `EditableTitle` with `maxlength` ⏸ PQ5.
  - New mode: an `Input` with autofocus, the hint "New tiers go last, as Tier <n>.", Cancel and Create Tier, and Enter submits. Create replaces the route with the new tier's page and shows the `TP-S2-R29` toast.
  - "Archived" as plain text; tabs Pricing and Customers.
- **`TierPricingTab.vue`:**
  - `useInfiniteQuery` on tier matrices, General first; columns Matrix, Categories, Work Order Matrix, Part Sale Matrix ("Same as work orders").
  - Checkboxes and Set Rule only for an existing non-Default tier (`TP-S2-R17`, `TP-S2-N8`).
  - Row Edit pushes `PricingMatrix` with state `{pricingOrigin: tier, startInEdit: true, focusTierId}`. For an archived tier it adds `?view=archived`.
- **`SetRuleBar.vue`:** `BulkBar` with the `#count` slot ("2 matrices"), sticky; label "Set <tier> to"; `RulePicker` without Previous tier, starting on % Off; value input; Set Rule; the `TP-S2-N7` messages beside the bar.
- **`SetRuleConfirmDialog.vue`.**
- **`useMatrixSelection.ts`:** see §4.4.
- **`useSetRule.ts`:**
  1. preview; if nothing changes, show "already uses" and stop;
  2. confirm;
  3. set; clear the checks; show a pausable toast for 20 s with Undo;
  4. Undo shows "Undone…", or on 409 the error toast "Can't undo: <matrix> …".
- **`TierRemovalDialogs.vue`:**
  - First calls the removal check.
  - With customers: the blocked dialog lists customers with their channels (or the `TP-S16-E1` count message), has a secondary Close, and shows the "Remove Customers" link only with Customers — Create & Edit. The link opens Manage Customers on the Remove tab (F5).
  - Without customers: Archive or Delete confirm with the followers list and the last line.
  - Reactivate needs no confirm and shows the `TP-S2-R26` toast.

**Queries:** `useTiersListQuery`, `useTierQuery`, `useTierMatricesInfiniteQuery(tierId | 'new')`, `useTierRemovalCheckQuery` (enabled on demand), and mutations Create, Rename, Archive, Reactivate, Delete, PreviewSetRule, SetRule, UndoSetRule. Rename and create set the detail cache from the response.

**Tests:**
- `useMatrixSelection` (§4.4 cases).
- `useSetRule`: the no-change toast, the confirm counts copy, success toast and Undo, Undo refused.
- `TierMenu`: grayed Delete tooltips, both reasons, and the saved-lines reason wins.
- Removal dialogs: blocked with and without customers view; followers list.
- `TierPage`: new mode creates on Enter, the hint shows the right `<n>`, reserved and archived-name errors.
- `TiersTab`: Default badge only once renamed; archived rows A–Z after active ones.

**DoD:** browser-walk the full tier lifecycle on `/administration/pricing?tab=tiers` (admin).

---

##### F5. Tier Customers tab and Manage Customers
**Backend needs:** C-E.

**Requirements:** `TP-S9-R4`, `TP-S9-R5`, `TP-S9-R9`, `TP-S9-R10`, `TP-S9-R17..R24`, `TP-S9-N1`, `TP-S9-N3`, `TP-S9-N6`, `TP-S9-E2`, `TP-S9-E5..E7`, `TP-S16-N5`, `TP-S2-R6` (archived: no Manage, Reactivate Tier).

**Create (in `pricing/tiers/`):**
- **`TierCustomersTab.vue`:** paged, 50 per page; search; channel `FilterBar` (Work orders, Part Sales, Both); sort by name A–Z with a sortable channel column; remembered state; no row actions. Shows Manage Customers when allowed; on an archived tier shows Reactivate Tier instead.
- **`ManageCustomersDialog.vue`:**
  - `BaseFormDialog`, `size="xl"`, sticky header, title "Manage Customers on <tier>".
  - Tabs Add and Remove, each with a title tooltip and a count.
  - The dark `BulkBar` sits above the search: "3 selected", Select All (n), Work Orders and Part Sales checkboxes (`q-checkbox` with `null` meaning mixed), and X.
  - Infinite list (50 per page, inside the dialog); per-row `CustomerChannelChips.vue` with locked chips.
  - Footer summary and skip line; the `#action-buttons` button reads "Add n Customers", or a red "Remove n Customers" on the Remove tab.
  - The save spinner comes from `:async-submit`; the dialog stays open with picks kept on error.
- **`useCustomerPicks.ts`:** see §4.5.
- The `TP-S2-R12` link opens this dialog with `initialTab='remove'`.

**Queries:** `useTierCustomersQuery` (paged), `useTierCandidatesInfiniteQuery(tierId, tab, search)` (returns rows plus a meta breakdown), and `useManageTierCustomersMutation`, which invalidates the tier customers, the tiers list (counts), the candidates and the customer summaries.

**Tests:** `useCustomerPicks` (§4.5 cases); the dialog: tab switch clears picks, the no-channel error, the footer copy, a failed save keeps picks; `TierCustomersTab`: filter, sort, empty copy.

**DoD:** browser-walk Manage Customers add and remove, including Select All on a large list (admin).

---

##### F6. Categories list, category page, New Category, delete
**Backend needs:** C-F, the existing `parts-catalogue` endpoints with delete never blocked (`TP-S8-R8`), C-J.

**Requirements:** `TP-S7-R1`, `TP-S7-R2`, `TP-S7-R4`, `TP-S7-R6`, `TP-S7-R9`, `TP-S7-R11..R13`, `TP-S7-R15`, `TP-S7-N1`, `TP-S8-R1`, `TP-S8-R3`, `TP-S8-R4`, `TP-S8-R8`, `TP-S8-R10`, `TP-S8-N3`, `TP-S16-R8`, `TP-S16-R11`.

**Modify:** `components/ts/parts/Categories.vue` is rewritten as a host with a `<router-view>` child and a list:
- Infinite query (it "loads as the work order list does"); Uncategorized first.
- Columns: Category, Pricing Matrix (`DefaultBadge` for General), Default, and one column per active tier using `RuleSummaryText` (Work Order side). The pricing columns show only with See Financial Data.
- Search and sort (Category or Pricing Matrix), remembered; empty state copy.
- New Category (keep the literal `new_category_button`); list ⋯ menu with Audit Log.
- Row click goes to `Category`; keep `category_row_{id}`.
- The QuickBooks column: ⏸ (§10, item 12).

**Create (in `pricing/categories/`):**
- **`CategoryPage.vue`:**
  - Breadcrumbs; `EditableTitle` (saves on change); Pricing Matrix `Select` (`CategoryMatrixPicker.vue`, toast per `TP-S7-R9`).
  - QuickBooks Products and Services (only when connected; reuse the default-resolution logic from `CategoryDialog.vue:227-260`, moved to `categories/quickBooksDefault.ts`); Tax Exempt `q-toggle`; New Matrix (goes to `PricingMatrixNew?categoryId=`).
  - ⋯ menu with Delete and Audit Log.
  - The line "The <matrix> matrix also prices n other categories: …".
  - Read-only `TierGrid` with no simulator.
  - Edit, or a grayed Edit with tooltip plus the "Go to the <matrix> matrix" link. Both push `PricingMatrix` with state `{pricingOrigin: category, startInEdit: true}`.
  - Uncategorized is read-only (`TP-S8-R4`).
  - Without See Financial Data: no matrix field and no grid.
- **`NewCategoryPage.vue`:** name (autofocus), Pricing Matrix (General by default), QuickBooks ⏸, Tax Exempt, read-only grid of the picked matrix, Save and Cancel (TP-S8-R10), discard guard (`TP-S19-R3`).
- **`DeleteCategoryDialog.vue`:** the `TP-S8-R8` copy and a red Delete.

**Queries:**
- `usePricingCategoriesInfiniteQuery`, `useCategoryPricingQuery(id)`, `useCategoryOptionsQuery` (for the matrix Categories picker in F2), `useSetCategoryMatrixMutation`.
- In `api/parts/queries.ts`: `useCreateCategoryMutation`, `useUpdateCategoryMutation`, `useDeleteCategoryMutation`, which invalidate `partsKeys.categories` and the pricing keys.

**Delete:** `components/ts/parts/dialogs/CategoryDialog.vue` and its spec. `Categories.spec.ts` is rewritten.

**Tests:** the list (permission-gated columns, Uncategorized first, empty state); `CategoryPage` (field saves, matrix change toast, Edit gating and link, Uncategorized read-only, delete navigates to the list); `NewCategoryPage` (create, cancel, guard).

**DoD:** browser-walk `/administration/categories` and a category on a shared matrix (admin), plus the restricted role.

---

##### F7. Customer tier fields and the customer card Pricing section
**Backend needs:** C-G.

**Requirements:** `TP-S9-R1..R3`, `TP-S9-R7`, `TP-S9-R8`, `TP-S9-R12`, `TP-S9-R14..R16`, `TP-S9-R30`, `TP-S9-R31`, `TP-S16-R4`, `TP-S19-R18` (picker search).

**Create:**
- `pricing/customers/TierSelect.vue`: GR#7 `modelValue` / `update:modelValue`; options "4 · Fleet"; a whole number typed matches that tier number exactly and lists it first, then name-contains matches.
- `pricing/customers/CustomerPricingSection.vue`:
  - Heading "Pricing"; Labor Rate plus "Varies by location"; Shop Supplies; Tax ⏸ PQ6; Work Order Tier and Part Sales Tier only when there is more than one active tier.
  - Skeleton while loading; inline error with Try again.

**Modify:**
- `components/ts/customers/CustomerDialog.vue`:
  - insert the two `TierSelect`s after the shop-supplies warning badge (`:207-225`) and before Notes (`:226`);
  - shown when the user can edit customers and there is more than one active tier, in both create and edit modes;
  - the Counter Sale tooltip shows when `company.is_system_default`;
  - the caption from `TP-S9-R7` (placement ⏸);
  - payload (`:790-860`) adds the tier ids only when the fields are shown.
- `components/ts/customers/CustomerLeftSection.vue`: mount `CustomerPricingSection` **after** the address `v-if` block (`:33-95`) and before the separator, gated by `seeApArData()`. This shows it without an address (`TP-S9-R16`) and leaves the other rows as they are.
- `components/ts/customers/CustomerModel.ts` `Company`: add `work_order_tier`, `part_sales_tier`, `is_system_default`.
- The company update mutation's `onSuccess` invalidates `pricingKeys.customerSummary(id)`.

**Tests:** `TierSelect` search ordering; `CustomerDialog`: fields hidden with only Default, shown in create mode, tooltip only for the system default customer, payload; `CustomerPricingSection`: permission gate, no address, "Varies by location".

**DoD:** browser-walk the customer page and Edit Customer, and the phone width for Edit Customer (`TP-S9` is mobile-optimized).

---

##### F8. Lines: Priced by, price details, Manual icon, add paths, receive
**Backend needs:** C-H.

**Requirements:** `TP-S12-R1..R4`, `TP-S12-R6`, `TP-S12-R8..R10`, `TP-S12-R12`, `TP-S12-R17`, `TP-S12-R18`, `TP-S12-N2`, `TP-S12-E1`, `TP-S12` error handling, `TP-S13-R1`, `TP-S10-N2`, `TP-S11-R5`, `TP-S11-R7`, `TP-S11-R9` (preview), `TP-S11-R15`, `TP-S10-R22`, `TP-S19-R5`.

**Create (in `pricing/lines/`):**
- `usePriceDetailsPopover.ts`: provide/inject; one popover per table; `open(anchorEl, ids, returnFocusEl, via)`; built on `useHoverCardTrigger`.
- `PriceDetailsPopover.vue`: `q-menu` with `:target`, `no-parent-event`, `no-focus`; lazy `usePriceDetailsQuery`; spinner; error "Ooooops! An error occurred" with Try again.
- `PriceDetailsAnchor.vue` (input mode) and `PriceDetailsTextTrigger.vue` (focusable span).
- `PricedByCell.vue`.
- `ManualPriceIcon.vue`: a gray icon with `aria-label="Price typed by hand: see details"`.
- `priceDetailsCopy.ts`: structured details → lines, using the PRD strings.

**Modify:**
- **`WorkOrderPartRequests.vue`** (both modes):
  1. Add `{name: 'priced_by', label: 'Priced by'}` to `BY_LINES_COLUMNS` right after `sell_price` (`:1021-1108`).
  2. Add `'priced_by'` to `financialColumnNames` (`:1380`) and hide the column at phone width in `visibleColumns` (`:1445-1463`).
  3. Insert a `<q-td>` after the sell-price cell (`:493-525`) with the same `v-if`.
  4. Add `--ps-w-priced_by` and `th.ps-col--priced_by` (around `:3515-3527` and `:3707`).
  5. `lineDescriptionColspan` +1 (`:1721`).
  6. Wrap the sell-price `CurrencyInput` in `PriceDetailsAnchor` and add `ManualPriceIcon`.
  7. `applyUpdateResponse` (`:2455`) copies `pricingSource` and `pricedByLabel` and invalidates `priceDetails(id)`.
  8. History snapshots render no source and no trigger.
- **`components/ts/work-orders/Model.ts:783` `PartRequestRow`:** add `pricing_source?`, `priced_by_label?`.
- **`work-order-lines/WorkOrderLineParts.vue:401-415`:** a text trigger plus the Manual icon **inside the existing cell**. `PART_ROW_FINANCIAL_CELL_COUNT` (`constants.ts:120`) stays 3, so add no cell. The part request id is `part.id` for requested rows and `part.part_request_id` for staged rows.
- **Add paths** (orchestrator item 1):
  - `InlinePartRow.vue`: `recalculateSellPrice` sends `work_order_id: props.workOrderId`.
  - The parts-options read passes `workOrderId` (add it to `FetchPartsOptionsParams` and `workOrderKeys.partsOptions`), so the prefill is the work order's tier price.
  - Track a `sellPriceTyped` flag set by the user's own input on the sell-price field; `buildPayload` (`:1827`) sends `sell_price` only when it is true.
  - `PartDialog.vue`: the same three changes for `make-request` and `change-request` (`:1361`, `:1492`). `parts/change` (`:1375`) keeps sending, because that endpoint needs a numeric value.
  - `api/sales/SalesModel.ts`: `work_order_id?: string`.
  - `api/sales/keys.ts` and `queries.ts`: `sellPriceQueryOptions` is keyed on the full payload.
- **Receive preview:**
  - `MultiVendorReceiveModel.ts`: `SellPreviewRow` gains `pricingSource` and `partRequestId`.
  - A **priced** request with a reported cost edit and `pricingSource === 'tier'` → `{kind: 'matrix', partRequestId, costCents}`.
  - The unpriced first-cost branch prices by part request too, so the work order's tier applies.
  - `useReceiveView.ts` passes `part_request_id`.
  - The comment's "keep the branches in step" rule now names the backend's `TP-S11-R9` branch.
- **`COST_MARGIN_NOTICE`** text becomes "Updating the cost also updates the sell price." Update the three specs.
- **Tests stay in step:** `PartRequestRow`, `UpdatePartRequestResponse` (`api/work-orders/WorkOrdersModel.ts:2139`) and the Lines part types; update the MSW by-lines handlers.

**Tests:**
- `WorkOrderPartRequests`: column order in both modes; header and body aligned (count `th` = `td`); hidden without See Financial Data and at phone width; the Manual icon's accessible name; Alt+Down opens details; history mode shows nothing.
- `PriceDetailsPopover`: each details variant's copy; spinner; error and retry; focus returns.
- `InlinePartRow`: an untouched prefill is not sent; a typed one is; the preview carries `work_order_id`.
- `PartDialog`: the same.
- `MultiVendorReceiveModel`: a tier row gives the matrix preview; Default gives derived.
- Receive notice text.

**DoD:** browser-walk a work order's Parts and Lines tabs, a Part Sale, and the inline add (admin). Do a tech walk if the tech role lacks See Financial Data; I did not verify the tech role's permissions. Smoke-test the backend.

---

##### F9. Change Customer dialog
**Backend needs:** C-I.

**Requirements:** `TP-S14-R2..R5`, `TP-S14-E1`, `TP-S13-E1`.

**Modify `work-orders/dialogs/ChangeWorkOrderCustomerDialog.vue`:**
- `COPY` (`:104-117`) gains a `pricing` sentence per order type, rendered under the gray caption.
- An amber note (`WarningBanner.vue`, which is orange) shows when the new customer's tier for the channel differs from the order's tier. Read it from the `customers/company` response already fetched in `handleCustomerChange` (`:237`) against `workOrder.pricing_tier`.
- `handleSubmit` reads `linesPricedForPreviousCustomer` from the mutation and, when the count is above 0, shows the notice after close (placement ⏸, §10 item 16).
- Debt in the same file: replace `as WorkOrder` at `:180` and `:252` with a status-discriminated guard, and type the `fetchWorkOrder` inject (`:157-160`) without `as` (GR#10).

**Also modify:** `api/work-orders/queries.ts:2183`, whose mutation return type becomes `ChangeWorkOrderCustomerResult`; and `WorkOrdersModel.ts`, which adds `pricing_tier` to `WorkOrder`.

**Tests:** copy for both order types; amber note only when the tier differs; the notice count, both variants.

**DoD:** browser-walk Change Customer on a work order and on a Part Sale.

---

##### F10. Remove legacy code
**Delete:**
- `app/src/components/parts/PricingMatrixDialog.vue` and `tests/PricingMatrixDialog.spec.ts`.
- `parts` Vuex: `Pricing` state slots (`store/ts/parts/state.ts:23-28`, `292-297`), the `dialogs.pricingMatrix` flag (`:95`, `:123`), the actions `fetchPricingMatrices`, `createPricingMatrix`, `changePricingMatrix`, `deletePricingMatrix`, `createCategory`, `updateCategory`, `deleteCategory`, `isEditingMatrix`, `editMatrix`, `duplicateMatrix`, `isDuplicatingMatrix` (`actions.ts:190-226`, `464-548`, `648-663`), and their mutations.
- `partsApi` matrix methods (`api/parts/index.ts:385-426`, except the fixed-rule ones) and the types `PricingMatrix`, `PricingRule`, `ChangePricingRuleRequest`, `CreatePricingMatrixRequest`, `CreatePricingRuleRequest` (`PartsModel.ts:727-787`), once each has zero references.

Run the zero-reference check from `docs/patterns/vuex-module-removal.md`, including its false-positive trap. Leave `dialogs.category` and `fixedRule` unless they also have zero references.

---

#### 4. Code for the hard parts

##### 4.1 Engine: money, price lookup, `Same as previous tier`
```ts
// pricing/engine/money.ts
export const TEN_K = 10_000n;
/** floor(n/d + 1/2) — half away from zero for n ≥ 0 (PHP RoundingMode::HalfAwayFromZero). */
export const roundHalfAwayRatio = (n: bigint, d: bigint): bigint => (2n * n + d) / (2n * d);

/** "10.005" → 1001n (TP-S3-E3). Truncating to thousandths before rounding is exact for half-away. */
export const parseCostCents = (input: string): bigint | null => {
  const match = /^\s*(\d+)(?:\.(\d*))?\s*$/.exec(input);
  if (!match) return null;
  const thousandths = BigInt(match[1]) * 1000n + BigInt(((match[2] ?? '') + '000').slice(0, 3));
  return roundHalfAwayRatio(thousandths, 10n);
};

// pricing/engine/price.ts
export const fromCostPrice = (rule: FromCostRule, cost: bigint): bigint => {
  const v = BigInt(rule.value);
  switch (rule.ruleType) {
    case 'plusAmount': return cost + v;                                   // TP-S10-R4
    case 'markup':     return roundHalfAwayRatio(cost * (TEN_K + v), TEN_K);
    case 'margin':     return roundHalfAwayRatio(cost * TEN_K, TEN_K - v); // v < 100% (validation)
  }
};
export const tierCellPrice = (cell: TierRule, cost: bigint, defaultCents: bigint): bigint => {
  switch (cell.ruleType) {
    case 'percentOff': return roundHalfAwayRatio(defaultCents * (TEN_K - BigInt(cell.value)), TEN_K); // TP-S10-R15
    case 'amountOff':  { const v = BigInt(cell.value); return defaultCents > v ? defaultCents - v : 0n; }
    default:           return fromCostPrice(cell, cost);
  }
};
/** Ends are inclusive and contiguous; below the first start → first (TP-S1-E12), above → last (TP-S10-R3). */
export const rangeIndexFor = (ranges: readonly { endCents: number | null }[], cost: bigint): number => {
  const i = ranges.findIndex((r) => r.endCents === null || cost <= BigInt(r.endCents));
  return i === -1 ? ranges.length - 1 : i;
};
export const priceSide = (side: ResolvedSide, cost: bigint): Map<ColumnKey, bigint> => {
  const prices = new Map<ColumnKey, bigint>();
  if (cost <= 0n) { /* TP-S10-N1 */ for (const k of side.columnKeys) prices.set(k, 0n); return prices; }
  const i = rangeIndexFor(side.ranges, cost);
  const defaultCents = fromCostPrice(side.defaultCells[i], cost);
  prices.set(DEFAULT_COLUMN, defaultCents);
  let previous = defaultCents;
  for (const column of side.tierColumns) {          // active tiers by number only → archived skipped (TP-S10-E8)
    const price = column.mode === 'previousTier' ? previous : tierCellPrice(column.cells[i], cost, defaultCents);
    prices.set(column.tierId, price);
    previous = price;
  }
  return prices;
};
```

##### 4.2 Below-cost: analytic per range, never a scan of costs
```ts
// pricing/engine/belowCost.ts
/**
 * Lowest cost in [lo, hi] (cents) at which `cell` sells below cost; null if none (TP-S15-R5).
 * hi for the open last range = max(10 × start, 1_000_000).
 * - From cost cells (and Default) never sell below cost: c·(1+m), c/(1−g), c+a are ≥ c and
 *   half-away rounding of a value ≥ integer c stays ≥ c. So only % Off / $ Off can warn.
 * - $ Off: D(c) − c = rha((α−1)c) is non-decreasing, so below-cost costs are a prefix → test lo.
 * - % Off over Default "+ $A": exact threshold c* = ⌊(2A·F + 10⁴)/(2p)⌋ + 1 (suffix).
 * - % Off over Default markup/margin (ratio N/Dn): below ⇔ F·r(c) > K − S·c with
 *   r(c) = (2N·c + Dn) mod 2Dn, S = 2·10⁴·Dn − 2F·N, K = (10⁴ + F)·Dn, F = 10⁴ − p.
 *   r is periodic in c with period T = 2Dn / gcd(2N, 2Dn) ≤ 20 000 → solve each residue class in O(1).
 */
export function lowestBelowCost(def: FromCostRule, cell: TierRule, lo: bigint, hi: bigint): bigint | null {
  const from = lo < 1n ? 1n : lo;                          // cost 0 is never priced (TP-S10-N1)
  if (from > hi) return null;
  if (cell.ruleType === 'amountOff') {
    const d = fromCostPrice(def, from);
    return tierCellPrice(cell, from, d) < from ? from : null;
  }
  if (cell.ruleType !== 'percentOff' || cell.value === 0) return null;
  const p = BigInt(cell.value), F = TEN_K - p;
  if (def.ruleType === 'plusAmount') {
    const t = (2n * BigInt(def.value) * F + TEN_K) / (2n * p) + 1n;
    const c = t > from ? t : from;
    return c <= hi ? c : null;
  }
  const [N, Dn] = def.ruleType === 'markup' ? [TEN_K + BigInt(def.value), TEN_K] : [TEN_K, TEN_K - BigInt(def.value)];
  const M = 2n * Dn, S = 2n * TEN_K * Dn - 2n * F * N, K = (TEN_K + F) * Dn;
  const T = M / gcd(2n * N, M);
  let best: bigint | null = null;
  for (let j = 0n; j < T; j += 1n) {
    const c0 = from + j;
    if (best !== null && c0 >= best) break;                 // later classes can't beat it
    const need = K - F * ((2n * N * c0 + Dn) % M);          // below ⇔ S·c > need
    let c: bigint | null = null;
    if (S > 0n) {
      const t = need < 0n ? c0 : need / S + 1n;
      c = t <= c0 ? c0 : c0 + ((t - c0 + T - 1n) / T) * T;  // first c ≡ c0 (mod T), c ≥ t
    } else if (S * c0 > need) c = c0;                       // S ≤ 0: holds only at the class's smallest c
    if (c !== null && c <= hi && (best === null || c < best)) best = c;
  }
  return best;
}
```
- **Memoize** on `(def, cell, lo, hi)` so only edited cells recompute.
- **Performance test:** a Vitest budget over a 20 × 10 grid of "awkward" values (for example margin 33.33% and 20.01% off) must stay under 50 ms.
- **PRD example:** the vectors include `TP-S15`'s case, $0–$100, Default Cost + $10, Fleet 20% off → $40.03.

##### 4.3 Grid edit model: auto-fill, last-range follow, `Same as previous tier`, change count
```ts
// pricing/grid/Model.ts
export type CellOrigin = 'saved' | 'typed' | 'copied';
export type ShownOrigin = CellOrigin | 'autoFill' | 'followsAbove' | 'following' | 'empty';
export interface DraftCell { ruleType: RuleType; value: number | null; origin: CellOrigin }
export interface DraftRange { key: string; endCents: number | null }              // id or `new-n`
export interface DraftColumn { key: ColumnKey; mode: 'own' | 'previousTier'; headerType: RuleType;
                               lastFollows: boolean; cells: Map<string, DraftCell> }
export interface ShownCell { ruleType: RuleType; value: number | null; origin: ShownOrigin }

// pricing/grid/gridDraft.ts — gray values are DERIVED, never stored: auto-fill = nearest entered cell above.
export function resolveColumn(col: DraftColumn, ranges: readonly DraftRange[], previous: readonly ShownCell[] | null): ShownCell[] {
  if (col.mode === 'previousTier' && previous) return previous.map((c) => ({ ...c, origin: 'following' }));  // TP-S4-R10
  const out: ShownCell[] = [];
  let entered: DraftCell | null = null;
  ranges.forEach((range, i) => {
    if (i > 0 && i === ranges.length - 1 && col.lastFollows) { out.push({ ...out[i - 1], origin: 'followsAbove' }); return; } // TP-S3-R23
    const own = col.cells.get(range.key);
    if (own && own.value !== null) { out.push(own); entered = own; return; }
    out.push(entered ? { ruleType: entered.ruleType, value: entered.value, origin: 'autoFill' }                  // TP-S4-R26
                     : { ruleType: own?.ruleType ?? col.headerType, value: null, origin: 'empty' });
  });
  return out;
}

export function typeCell(side: SideDraft, colKey: ColumnKey, i: number, cell: { ruleType: RuleType; value: number | null }, shownPrevious: ShownCell[] | null): void {
  const col = column(side, colKey);
  if (col.mode === 'previousTier' && shownPrevious) {                  // first edit turns the copy into own rules
    col.mode = 'own';
    side.ranges.forEach((r, k) => col.cells.set(r.key, { ruleType: shownPrevious[k].ruleType, value: shownPrevious[k].value, origin: 'copied' }));
  }
  if (i > 0 && i === side.ranges.length - 1) {
    const above = resolveColumn(col, side.ranges, shownPrevious)[i - 1];
    col.lastFollows = above.ruleType === cell.ruleType && above.value === cell.value;
  }
  col.cells.set(side.ranges[i].key, { ...cell, origin: 'typed' });
}

/** TP-S4-R4: diff against the last saved version; gray, following and follows-above never count. */
export function countChanges(draft: SideDraft, base: SideDraft, shown: ShownGrid, baseShown: ShownGrid): number {
  let n = 0;
  const baseRanges = new Map(base.ranges.map((r) => [r.key, r]));
  for (const r of draft.ranges) { const b = baseRanges.get(r.key); if (!b || b.endCents !== r.endCents) n += 1; }
  n += base.ranges.filter((b) => !draft.ranges.some((r) => r.key === b.key)).length;
  for (const col of draft.columns) {
    const baseCol = base.columns.find((c) => c.key === col.key);
    if (!baseCol) continue;                                             // tier created mid-edit (TP-S4-E3)
    if (typeSignature(col, shown.get(col.key)) !== typeSignature(baseCol, baseShown.get(col.key))) n += 1;
    if (col.mode === 'previousTier') continue;
    draft.ranges.forEach((r) => {
      const cell = col.cells.get(r.key);
      if (cell?.origin !== 'typed') return;
      const was = baseShown.get(col.key)?.[base.ranges.findIndex((b) => b.key === r.key)];
      if (!was || was.ruleType !== cell.ruleType || was.value !== cell.value) n += 1;
    });
  }
  return n;
}
// typeSignature = 'previousTier' | the single rule type | 'mixed' (TP-S4-R28, TP-S4-R31)
```
**Followers** (`TP-S4-R30`): walk the tier columns in number order. `reaches = mode === 'previousTier' ? previousReaches : anyCell(%Off | $Off)`. Default starts as reaching.

##### 4.4 Set Rule: select-all over rows that aren't loaded
```ts
// pricing/tiers/useMatrixSelection.ts
type Selection = { all: false; ids: Set<UUID> } | { all: true; except: Set<UUID> };
export function useMatrixSelection(total: Ref<number>) {                  // total = server count (Active + Inactive)
  const sel = ref<Selection>({ all: false, ids: new Set() });
  const isChecked = (id: UUID) => (sel.value.all ? !sel.value.except.has(id) : sel.value.ids.has(id));
  const count = computed(() => (sel.value.all ? total.value - sel.value.except.size : sel.value.ids.size));
  const header = computed<boolean | null>(() => (count.value === 0 ? false : count.value === total.value ? true : null)); // null = partly
  const toggle = (id: UUID) => { const set = sel.value.all ? sel.value.except : sel.value.ids;
    if (set.has(id)) set.delete(id); else set.add(id); if (count.value === 0) clear(); };
  const toggleAll = () => { sel.value = header.value === true ? { all: false, ids: new Set() } : { all: true, except: new Set() }; };
  const clear = () => { sel.value = { all: false, ids: new Set() }; };
  const toRequest = (): SetRuleSelection =>
    sel.value.all ? { all: true, exceptMatrixIds: [...sel.value.except] } : { all: false, matrixIds: [...sel.value.ids] };
  return { isChecked, count, header, toggle, toggleAll, clear, toRequest };
}
```
The backend resolves the set at preview time and again at set time. The confirm counts come from the preview, never from the frontend.

##### 4.5 Manage Customers selection model
```ts
// pricing/tiers/useCustomerPicks.ts
type Channel = 'workOrders' | 'partSales';
interface PickState {
  selectAll: { channels: Set<Channel>; except: Set<UUID> } | null;  // Select All over the whole search result
  rows: Map<UUID, Set<Channel>>;                                    // hand-ticked / overridden rows (always loaded)
}
export const availableChannels = (row: CandidateRow, tab: Tab, tierId: UUID): Set<Channel> =>
  new Set((['workOrders', 'partSales'] as const satisfies readonly Channel[])
    .filter((ch) => (tierOf(row, ch) === tierId) === (tab === 'remove')));            // locked chips = the rest (TP-S9-R21)
// tick(row): rows.set(id, availableChannels(row))                          (TP-S9-R20)
// setBarChannel(ch, on): every ticked row where ch is available ± ch; selectAll.channels ± ch (TP-S9-R19, TP-S9-E7)
// barState(ch): true | false | null(mixed) over ticked customers where ch is available
// skipped(channels): from meta — Add: {WO}→onTierWorkOrdersOnly+both, {PS}→onTierPartSalesOnly+both, {WO,PS}→both;
//                    Remove: {WO}→onTierPartSalesOnly, {PS}→onTierWorkOrdersOnly, {WO,PS}→0      (TP-S9-E5)
// count / breakdown (both / WO only / PS only) = server part from meta − except − overridden + explicit rows
// invalid(row) = ticked with no channel → "Pick Work Orders, Part Sales or both." and the button is disabled (TP-S9-N1)
// toRequest(): { tab, search, selectAll: {channels, exceptCustomerIds} | null, customers: [{customerId, channels}] }
// switching tab → reset (TP-S9-R24)
```
`as const satisfies` is not an `as` cast, but if the reviewer reads GR#10 strictly, declare `const CHANNELS: readonly Channel[] = ['workOrders', 'partSales']` instead.

##### 4.6 Price details anchor around the editable sell price
```vue
<!-- pricing/lines/PriceDetailsAnchor.vue -->
<template>
  <div ref="anchor" class="price-details-anchor" :data-test-id="testId"
       @mouseenter="!disabled && trigger.onEnter()" @mouseleave="trigger.onLeave()"
       @pointerdown="onPointerDown" @keydown.alt.down.prevent.stop="openFromKeyboard">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
// Hover opens after a delay (desktop), a touch opens at once (tablet), Alt+Down opens from the
// price box while typing still edits (TP-S12-R2). One popover per table: usePriceDetailsPopover().
const props = defineProps<{ ids: PriceDetailsIds; disabled: boolean; testId: string }>();
const popover = usePriceDetailsPopover();                     // inject; owns the single q-menu
const anchor = useTemplateRef<HTMLDivElement>('anchor');
const trigger = useHoverCardTrigger(300, { onOpen: () => anchor.value && popover.open(anchor.value, props.ids, 'pointer') });
const onPointerDown = (e: PointerEvent) => { if (!props.disabled && e.pointerType === 'touch' && anchor.value) popover.open(anchor.value, props.ids, 'touch'); };
const openFromKeyboard = (e: KeyboardEvent) => {
  if (props.disabled || !anchor.value) return;
  const focused = e.target instanceof HTMLElement ? e.target : anchor.value;
  popover.open(anchor.value, props.ids, 'keyboard', focused);  // focus returns here on close (TP-S12-R2)
};
</script>
```

---

#### 5. API contract I assume (all to reconcile with BE)

**Conventions:**
- New endpoints are camelCase.
- Extensions of existing snake_case payloads stay snake_case.
- `Hundredths` = int (cents for `$` rules, hundredths of a percent for `%` rules).
- Every write is all-or-nothing.
- 409 responses carry `{code, message}` naming the conflict (`TP-S19-E2`).
- Reads used right after the user's own write (matrix and tier detail, lists after save) stay on the **writer**. Otherwise the frontend sets the cache from mutation responses (`setQueryData`); that follows `read-replica.md`.

**Shared types (`api/pricing/Model.ts`):**
```ts
type RuleType = 'percentOff' | 'amountOff' | 'plusAmount' | 'markup' | 'margin';
type MatrixSideKey = 'workOrder' | 'partSale';
interface TierRef { id: UUID; number: number | null; name: string; isDefault: boolean }
interface RuleCell { rangeId: UUID; ruleType: RuleType; value: Hundredths; followsAbove: boolean }
interface MatrixRange { id: UUID; startCents: number; endCents: number | null }
interface TierColumn { tierId: UUID; mode: 'own' | 'previousTier'; cells: RuleCell[] }
interface MatrixSide { side: MatrixSideKey; version: number; ranges: MatrixRange[];
                       defaultColumn: { cells: RuleCell[] }; tierColumns: TierColumn[] }
type RuleSummary = { kind: 'usesPreviousTier' } | { kind: 'mixed' }
  | { kind: 'single'; ruleType: RuleType; value: Hundredths } | { kind: 'layered'; ruleType: RuleType };
type PricingSource = 'tier' | 'default' | 'fixedPrice' | 'fixedLineTotal' | 'manual' | 'beforeTiers';
interface PricingAuditEntry { id: UUID; eventType: string; eventName: string; userName: string; occurredAt: string;
  summary: string | null; changes: { label: string; oldValue: string | null; newValue: string | null }[] }
```

| Group | Endpoint | Request | Response |
|---|---|---|---|
| C-B | `GET /api/pricing/tiers` | `status=active\|archived&page&rowsPerPage=50` | `{collection: TierListRow[], pagination}` where `TierListRow = TierRef & {status, customers:{distinct, workOrders, partSales}, matrices:{own, activeTotal}, deleteBlock:{reason:'savedLines'\|'openOrders', count}\|null}` |
| C-B | `GET /api/pricing/tiers/options` (allowed for Customers — Create & Edit **or** Settings — Parts + See Financial Data) | — | `TierRef[]` (active, by number) |
| C-B | `GET /api/pricing/tiers/{id}` | — | `TierDetail` (TierRef + status + deleteBlock + `nextNumber` for the new-tier hint) |
| C-B | `POST /api/pricing/tiers` / `PATCH /api/pricing/tiers/{id}` | `{name}` | `TierDetail`; 422 `{code:'required'\|'taken'\|'takenByArchived'\|'reserved'\|'tooLong', message}` |
| C-B | `POST …/{id}/archive`, `POST …/{id}/reactivate`, `DELETE …/{id}` | — | `TierDetail` / 204; 409 `hasCustomers` \| `deleteBlocked` |
| C-B | `GET …/{id}/removal-check` | — | `{customerCount, followers: string[], tierBeforeName}` (customers listed via C-E) |
| C-D | `GET /api/pricing/tier-matrices` | `tierId?` (absent = new tier) `&page&rowsPerPage=50` | `{collection:[{matrixId, name, isGeneral, isActive, categories:{names, total}, generalCategoryCount, workOrder: RuleSummary, partSale: RuleSummary\|null}], pagination:{totalResults, inactiveTotal}}` |
| C-D | `POST …/tiers/{id}/set-rule/preview` | `{rule:{ruleType, value}, selection}` | `{changing, changingInactive}` |
| C-D | `POST …/tiers/{id}/set-rule` | same | `{operationId, changed}` |
| C-D | `POST …/tiers/{id}/set-rule/{operationId}/undo` | — | 204; 409 `{code:'savedAfter', matrixName}` |
| C-E | `GET …/tiers/{id}/customers` | `search&channel&sortBy=name\|channel&descending&page&rowsPerPage=50` | rows `{id, name, channels: Channel[]}` |
| C-E | `GET …/tiers/{id}/customer-candidates` | `tab=add\|remove&search&page&rowsPerPage=50` | rows `{id, name, workOrderTier: TierRef, partSalesTier: TierRef}`, `meta:{total, onTierWorkOrdersOnly, onTierPartSalesOnly, onTierBoth}` |
| C-E | `POST …/tiers/{id}/customers` | `{tab, search, selectAll:{channels, exceptCustomerIds}\|null, customers:[{customerId, channels}]}` | `{customers, both, workOrdersOnly, partSalesOnly}` |
| C-C | `GET /api/pricing/matrices` | `search&status&sortBy=name\|categories&descending&page&rowsPerPage=50` | rows `{id, name, isGeneral, isActive, categories:{names(≤3), total, all}, generalCategoryCount, tiersWithOwnRules: TierRef[], allTiersHaveOwnRules, workOrderDefault: RuleSummary, partSaleSeparate}` |
| C-C | `GET /api/pricing/matrices/options` | — | `[{id, name, isGeneral, categoryCount}]` |
| C-C | `GET /api/pricing/matrices/{id}` | `view=active\|archived` | `MatrixDetail {id, name, isGeneral, isActive, categories:{id,name}[], generalCategoryCount, partSaleSeparate, workOrderSide: MatrixSide, partSaleSide: MatrixSide\|null, tierColumnsOrder: TierRef[]}` |
| C-C | `POST /api/pricing/matrices` | `{name, categoryIds, workOrderSide: SideInput}` | `MatrixDetail` |
| C-C | `PATCH …/matrices/{id}` / `PUT …/{id}/categories` | `{name}` / `{categoryIds}` | `MatrixDetail` |
| C-C | `PUT …/matrices/{id}/rules` | `{view, changeAllConfirmed, sides: SideInput[]}`; `SideInput {side, version, ranges:[{key, endCents\|null}], defaultColumn:{cells: CellInput[]}, tierColumns:[{tierId, mode, cells}]}`; `CellInput {rangeKey, ruleType, value, followsAbove}` | `MatrixDetail`; 409 conflict |
| C-C | `POST` / `DELETE …/matrices/{id}/part-sale-side`; `POST …/{id}/duplicate`; `DELETE …/{id}` | — | `MatrixDetail` / `{id}` / 204 |
| C-F | `GET /api/pricing/categories` | `search&sortBy=name\|matrix&descending&page&rowsPerPage` | rows `{id, name, isSystem, matrix:{id,name,isGeneral}, columns?:{default: RuleSummary, tiers:{tierId, summary}[]}}` (columns only with See Financial Data) |
| C-F | `GET /api/pricing/categories/options` | — | `[{id, name, matrix:{id, name, isGeneral}}]` (no Uncategorized) |
| C-F | `GET /api/pricing/categories/{id}` / `PUT …/{id}/matrix` | — / `{matrixId}` | `{id, name, isSystem, isTaxExempt, productAndServiceId, productAndServiceName, matrix:{id, name, isGeneral, categoryCount, otherCategoryNames}}` |
| C-F | existing `POST parts-catalogue/add-category` (+ `pricing_matrix_id`), `change-category`, `categories/{id}/remove` | — | remove is never blocked (`TP-S8-R8`); 422 `taken` → "A category called <name> already exists" |
| C-G | `customers/company` view (snake) | — | + `work_order_tier`, `part_sales_tier` (TierRef), `is_system_default` |
| C-G | company create/update (snake) | + `work_order_tier_id?`, `part_sales_tier_id?` | — |
| C-G | `GET /api/customers/{id}/pricing-summary` (View and Manage AP/AR Data) | — | `{laborRate:{name, rateCents\|null, variesByLocation}, shopSupplies:{kind:'none'\|'own'\|'locationDefault', percent?, minCents?, maxCents?}, tax:{taxId\|null, name\|null} (PQ6: the picked tax's name, or null for "Default Tax Settings"), activeTierCount, workOrderTier, partSalesTier}` |
| C-H | by-lines rows (snake) and Lines detail part rows (requested and staged) | — | + `pricing_source: PricingSource\|null`, `priced_by_label: string\|null` (current names, `TP-S4-R15`) |
| C-H | `work-orders/part/change-request` response (camel) | — | + `pricingSource`, `pricedByLabel` |
| C-H | `GET /api/work-orders/part-requests/{id}/price-details` | `workOrderPartId?` | `{source, tierName, matrix:{name, side}\|null, rule:{startCents, endCents, ruleType, value}\|null, sameAsPreviousFrom:{tierName, categoryName}\|null, costCents, sellPriceCents, pricedAt, defaultPriceCents\|null, origin:{kind:'inventory', bin}\|{kind:'specialOrder', vendorName, vendorBillNumber}\|null, fixedLineTotal:{totalCents, partsCents}\|null, customerMoved:{customerName, currentTierName}\|null, pricedForCustomer:{customerName}\|null, cannedLine:{name, pendingCost: boolean}\|null, manualBy:{userName}\|null}` |
| C-H | `GET pricing-rules/calculate-sell-price` | + `work_order_id`, `part_request_id` (snake query) | unchanged |
| C-H | parts-options read | + `workOrderId` → `sell_price` priced by the full order (fixed, then the work order's tier) | — |
| C-H | receive item state (purchase-order receive) | — | + `pricingSource`, `partRequestId` |
| C-I | `WorkOrder` payload (snake) | — | + `pricing_tier: TierRef\|null` (the order's tier for its channel) |
| C-I | `POST work-orders/change-customer` response | — | `{linesPricedForPreviousCustomer:{count, tierName\|null}}` |
| C-J | `GET /api/pricing/{matrices\|tiers\|categories}/{id}/audit-log`, and `/api/pricing/{matrices\|tiers\|categories}/audit-log` (lists) | `page&rowsPerPage=50&search` | `{collection: PricingAuditEntry[], pagination}` |

**Shared vectors file** (C-A):
- `{version, priceCases:[{id, side, costInput, expected:{costCents, prices}}], summaryCases:[…], belowCostCases:[…]}`.
- Must include:
  - the PRD examples: `TP-S10-R15`, `TP-S15-R5`, and the §5 terminology example (10 at 30% markup → 13, 30% margin → 14.29);
  - `$ Off` floor at 0, legacy first start above 0, range boundaries, cost 0, the Same-as-previous chain;
  - **half-cent edge cases**: today's PHP uses float `round()`, and integer math can differ there. The backend decides parity; the vectors pin it.
- The backend runs the `priceCases`, and may also check that `belowCostCases` hold at `c*` and fail at `c*−1`.

---

#### 6. `data-test-id` scheme (new surfaces; snake_case, GR#5)

**Conventions:**
- On wrappers, use `data-test-id-suffix`, which produces `button_…`, `input_…`, `select_…`, `table_…`. A literal id is used only where marked "(literal)".
- `{side}` = `work_order` | `part_sale`.
- `{col}` = `default` | tier id.
- `{i}` = range row index.

| Surface | Ids |
|---|---|
| Shell | `page_pricing`, `tab_pricing_tiers`, `tab_pricing_matrices`, `route_tab_fixed_rules` (kept), `undo_toast` / `button_undo_set_rule` / `button_dismiss_toast` |
| Breadcrumbs | `breadcrumbs`, `link_breadcrumb_{index}`, `text_breadcrumb_current` |
| Tiers list | `table_tiers`, `button_new_tier`, `button_tiers_list_menu`, `menu_item_tiers_audit_log`, `tier_row_{id}`, `text_tier_number_{id}`, `text_tier_customers_{id}`, `tooltip_tier_customers_{id}`, `text_tier_matrices_{id}`, `button_tier_menu_{id}`, `menu_item_tier_{archive\|delete\|reactivate\|audit_log}_{id}`, `tooltip_tier_delete_{id}`, `text_tiers_empty` |
| Tier page | `page_tier`, `tier_title` (+ `_input`, `_value`), `button_tier_rename`, `text_tier_name_error`, `input_new_tier_name`, `text_new_tier_hint`, `button_cancel_tier`, `button_create_tier`, `text_tier_archived`, `button_tier_page_menu`, `tab_tier_pricing`, `tab_tier_customers` |
| Tier matrices | `table_tier_matrices`, `tier_matrix_row_{matrixId}`, `checkbox_tier_matrix_{matrixId}`, `checkbox_tier_matrices_all`, `button_edit_tier_matrix_{matrixId}`, `text_tier_matrix_wo_rule_{matrixId}`, `text_tier_matrix_ps_rule_{matrixId}` |
| Set Rule | `bulk_bar_set_rule`, `text_set_rule_count`, `select_set_rule_type`, `input_set_rule_value`, `button_set_rule`, `text_set_rule_error`, `button_bulk_close_selection` (BulkBar), dialog suffix `set_rule_confirm` |
| Archive/Delete | dialog suffixes `tier_archive`, `tier_delete`, `tier_blocked`; `text_tier_followers`, `tier_blocked_customer_{id}`, `link_remove_customers`, `button_close_tier_blocked` |
| Tier customers | `table_tier_customers`, `tier_customer_row_{id}`, `button_manage_customers`, `button_reactivate_tier` |
| Manage Customers | dialog suffix `manage_customers`; `tab_manage_customers_add`, `tab_manage_customers_remove`, `checkbox_manage_customer_{id}`, `chip_manage_customer_{id}_{work_orders\|part_sales}`, `button_manage_customers_select_all`, `checkbox_bar_work_orders`, `checkbox_bar_part_sales`, `text_manage_customers_footer`, `text_manage_customers_skipped`, `text_manage_customer_error_{id}`, `button_manage_customers_save`, `text_manage_customers_empty` |
| Matrices list | `table_matrices`, `button_new_matrix`, `button_matrices_list_menu`, `menu_item_matrices_audit_log`, `matrix_row_{id}`, `link_matrix_name_{id}`, `badge_matrix_status_{id}`, `text_matrix_categories_{id}`, `text_matrix_tiers_{id}`, `button_edit_matrix_{id}` (same id, new behavior), `button_matrix_menu_{id}`, `menu_item_{duplicate\|delete}_matrix_{id}`, `tooltip_delete_general_matrix`, `text_list_empty`, `button_clear_search`, `button_clear_all_filters` |
| Matrix page | `page_matrix`, `matrix_title`, `text_matrix_inactive`, `text_matrix_categories_line`, `select_matrix_categories`, `option_matrix_category_{id}`, `tab_matrix_{side}`, `toggle_separate_part_sale`, `button_matrix_page_menu`, `menu_item_matrix_audit_log`, `button_edit_grid`, `edit_bar`, `text_edit_bar_changes`, `button_cancel_grid`, `button_save_grid`, `button_create_matrix`, `button_cancel_new_matrix`, `banner_archived_grid`, `banner_grid_conflict`, `text_grid_errors`; dialog suffixes `change_all`, `save_general_matrix`, `change_default_prices`, `turn_off_part_sale`, `delete_matrix`, `discard_changes` (+ `button_keep_editing`, `button_discard_changes`) |
| Grid | `grid_{side}`, `grid_header_{side}_{col}`, `select_column_rule_{side}_{col}`, `text_column_summary_{side}_{col}`, `grid_cell_{side}_{col}_{i}`, `input_grid_cell_{side}_{col}_{i}`, `button_cell_symbol_{side}_{col}_{i}`, `icon_below_cost_{side}_{col}_{i}`, `text_range_{side}_{i}`, `input_range_end_{side}_{i}`, `button_remove_range_{side}_{i}`, `button_add_range_{side}` |
| Simulator | `simulator_{side}`, `input_simulator_cost_{side}`, `text_simulator_price_{side}_{col}`, `text_simulator_profit_{side}_{col}`, `icon_simulator_below_cost_{side}_{col}` |
| Categories | `table_categories`, `new_category_button` (literal, kept), `category_row_{id}` (kept), `button_categories_list_menu`, `menu_item_categories_audit_log`, `text_category_matrix_{id}`, `text_category_rule_{id}_{col}` |
| Category page | `page_category`, `category_title`, `select_category_matrix`, `select_quickbooks_product_and_service` (kept), `category_tax_exempt_toggle` (literal, kept), `button_new_matrix_from_category`, `button_category_page_menu`, `menu_item_category_{delete\|audit_log}`, `button_edit_category_matrix`, `tooltip_edit_category_matrix`, `link_go_to_matrix`, `text_category_also_prices`; new category: `input_new_category_name`, `button_create_category`, `button_cancel_new_category`; dialog suffix `delete_category` |
| Customer | `select_customer_work_order_tier`, `select_customer_part_sales_tier`, `option_tier_{number}`, `tooltip_counter_sale_tier`, `text_customer_tier_note`, `section_customer_pricing`, `text_customer_{labor_rate\|labor_varies\|shop_supplies\|tax\|work_order_tier\|part_sales_tier}` |
| Lines | `text_priced_by_{rowKey}`, `icon_manual_price_{rowKey}`, `price_details_anchor_{rowKey}`, `price_details_trigger_part_{partId}` (Lines tab), `icon_manual_price_part_{partId}`, `popover_price_details`, `loading_price_details`, `error_price_details`, `button_retry_price_details`, `text_price_details_{source\|tier\|rule\|cost\|sell\|priced_at\|default_price\|origin\|note}` |
| Change Customer | `text_change_customer_pricing_caption`, `banner_change_customer_tier`, toast `toast_lines_priced_previous_customer` |
| Audit Log | existing `table_audit_log`, dialog suffix `audit_log` |

---

#### 7. Shared code this change touches (blast radius)

| File | Change | Who else depends on it | Regression to verify |
|---|---|---|---|
| `QueryState.vue` | optional props and slot | 82 screens | defaults render identically (snapshot one consumer) |
| `BulkBar.vue` | `#count` slot | work order bulk bar, inventory status bar | "{n} selected" unchanged; `BulkActionBar.spec` |
| `EditableTitle.vue` | `maxlength` | maintenance editor, DVI builder | unchanged without the prop |
| `useScreen.ts` | `isPhoneWidth` | — | additive |
| `AuditLogDialog.vue` | `'pricing'` subject, `changes`/`summary` | work order log, line log, Part Sale log | the three existing logs unchanged; their specs |
| `WorkOrderPartRequests.vue` | Priced by column and anchor | WO Parts tab **and** Part Sale parts table | column alignment in both modes, colspan, PS widths, history mode, inline saves, `PartSale.spec`, `WorkOrderPartRequests.spec` |
| `WorkOrderLineParts.vue` | trigger in the existing cell | Lines tab | Add-Part band colspan unchanged |
| `InlinePartRow.vue` / `PartDialog.vue` | payload and preview | every add path (Tech View included), Part Sale add | Default-tier client: same price as before |
| `MultiVendorReceiveModel.ts` / `useReceiveView.ts` | preview branch and notice | WO receive modal, PO receive, multi-vendor receive | the three receive specs; SV-11006 behaviour for Default lines |
| `sales` keys and queries | payload key | InventoryPartDialog (no work order, unchanged) | inventory sell-price recalculation |
| `ChangeWorkOrderCustomerDialog.vue` | copy, note, notice | WO and Part Sale | 409 path, imported WO |
| `CustomerDialog.vue` | tier fields | customer page, Customers list, New WO dialog, New Part Sale dialog | create redirect, AP/AR-gated fields untouched |
| `CustomerLeftSection.vue` | Pricing section | customer page | the no-address `v-if` behaviour for the other rows unchanged |
| `AdminLeftMenuNav.vue`, `Administration.vue`, `routes.ts` | order and routes | every Settings tab | `routeGuards.spec` |
| `parts` Vuex | removals | — | zero-reference check |

---

#### 8. Risks and existing debt

**Risks**
1. **Integer versus float rounding (release-day parity, `TP-S1-R3`).** Today's PHP computes `round(float)`. If the backend keeps float math, the frontend must mirror it, and half-cent cases can differ. The vectors decide. This is the main reason the fixture must exist before F2.
2. **The add-path payload change (`TP-S11-R5`).** No longer sending an untouched prefill changes one edge for Default-tier clients: a free-typed number that the backend maps to a catalog part's category (comment at `InlinePartRow.vue:925-940`). It used to save the Uncategorized preview price; it will now be priced by the real category. That is arguably a fix, but it is a price change on release day, so flag it to Product.
3. **Five coordinated edits in a 3,867-line positional table.** Mitigate with a spec asserting `th` count equals `td` count per row in both modes and both permission states.
4. **The below-cost worst case** is T ≤ 20,000 BigInt iterations per cell for awkward percentages. It is memoized, and there is a performance budget test (§4.2).
5. **List state through `usePagePreferences`** adds one preferences read before the first list fetch. It is cached per session; the skeleton covers it.
6. **Prices must match across surfaces.** The simulator, the warning and the grid must agree with the backend. Every engine change runs the vectors, and backend CI needs the path filter (separate CI PR, §2.6).
7. **Scale** (orchestrator item 3).
   - Matrices are few per client, so the Matrices list rarely pages and the tier matrix list is cheap.
   - Categories: up to about 270, so infinite scroll with server columns is fine.
   - Customers: 307k rows across clients, so Select All must stay server-side and the frontend never loads a full customer set.
8. **Read replica.** If the backend moves the new list reads to the replica, a refetch after a save can show stale data. Contract: detail reads stay on the writer, and the frontend sets the cache from mutation responses.
9. **The Undo toast lives in the Pricing shell.** It is dismissed when the user leaves Settings › Pricing. ⏸ (§10, item 32).

**Existing debt removed or fixed in this change**
- `PricingMatrixDialog.vue`: raw `q-dialog` (GR#9), a static inline style, Vuex visibility.
- The `parts` Vuex `Record<string, unknown>` slots.
- `changePricingMatrix(data: unknown)`.
- `FixedRuleDialog`'s dead prop.
- `as WorkOrder` and the `inject` cast in `ChangeWorkOrderCustomerDialog` (GR#10).
- `CategoryDialog` and its Vuex create/update/delete.
- `Categories.vue`'s `fetchAllPages` validation set.

**Existing debt left in place:** `AuditLogDialog` lives outside a `ts/` folder (it is already `<script setup lang="ts">`), and `FixedRulesTab` still uses Vuex and `useTable`. Moving it as-is is acceptable, and migrating it is out of scope.

---

#### 9. Engineering trade-offs I could not settle

| # | Choice | Options | Recommendation |
|---|---|---|---|
| T1 | Breadcrumb origin | (a) `history.state`; (b) `?from=` query; (c) separate routes per origin | **(a)**: the only one where a bookmark gives the default trail (`TP-S3-R26`) |
| T2 | Remembered list state | (a) `usePagePreferences` (per user, across devices); (b) session storage plus URL | **(a)**: "each user's" (`TP-S2-R14`) |
| T3 | Edit session scope | (a) one page-level session for both sides; (b) per tab | **(a)** pending Product (§10, item 7) |
| T4 | Pausable toast | (a) new shared host in the Pricing shell; (b) host in the main layout; (c) refactor the schedule host | **(a)**: smallest blast radius |
| T5 | Rule summaries on lists | (a) the backend returns structured kinds and the frontend words them; (b) the frontend computes from full sides | **(a)**, with summary cases in the vectors |
| T6 | Engine numbers | BigInt everywhere, or Number with proven bounds | **BigInt**: markup has no upper bound, so Number can overflow |
| T7 | Price details | lazy fetch per open, or embedded in rows | **lazy**: `TP-S12` asks for a spinner, an error state and Try again |
| T8 | Error/skeleton state | extend `QueryState`, or a new component | **extend** with optional props (82 consumers unchanged) |
| T9 | Prefill price | (a) the options read takes `workOrderId`; (b) re-price after the pick | **(a)**: one resolver, fixed price included |
| T10 | Vectors location and CI | in `app/` plus a backend filter line (precedent), or in `api/` plus a frontend filter line | **app/**, with the filter in a separate CI PR |
| T11 | Archived view address | `?view=archived` query, or state | **query**: it is distinct page content and should survive a reload |
| T12 | Matrix Categories line | save when the picker closes, or with the grid Save | picker close (`TP-S3-R12`); ⏸ §10 item 8 |

---

#### 10. Product-visible ambiguities (not decided; each with its PRD id)

1. ⏸ **PQ3** `TP-S8-N3` / `TP-S2-R3`: do category names reserve "Credits not tied to a part", with the tier message?
2. ⏸ **PQ5** `TP-S2-R3`: tier name maximum length; proposal 50 characters, input stops accepting more.
3. **PQ6** `TP-S9-R12`: the Tax row (answered in page 33: the name of the tax picked on the customer, or "Default Tax Settings"; Section 6 Phase 17).
4. `TP-S4-R26`: auto-fill from the nearest typed range above (planned), or from the most recently typed range? The sentence "fills every range below… filled this way" conflicts with "follows the last range entered".
5. `TP-S4-R4`:
   - Do values typed in a newly added range count on top of "range added"?
   - Does editing one value in a Same-as-previous column count as 2 (type change plus cell)?
6. `TP-S4-R12`: toast wording for more than one change.
7. `TP-S3-R25` / `TP-S4-R4`: is Edit page-level across both tabs with one Save, or per tab?
8. `TP-S3-R13`: Categories-line changes save immediately or with the grid ("moves… when the matrix is saved")?
9. `TP-S3-R6`: the missing grid messages: empty value, end not above start, more than 2 decimals, margin 100% or more.
10. `TP-S12-R3` / `TP-S12-R10`: on the Parts tab, does the Manual icon go beside the sell price, in the Priced by cell, or both?
11. `TP-S12-R6`: Priced by text for lines from before tiers ("Before tiers"?).
12. `TP-S7-R1`: is today's QuickBooks column dropped from the Categories list? `TP-S8-R10`: does New Category get the QuickBooks field, which today exists only in edit?
13. `TP-S4-R15` versus `TP-S12-R5`: price details show the tier's current name or the recorded one?
14. `TP-S12-R7`: read literally, it removes the Received/Installed status from the Parts and Lines tables. Confirm the intent.
15. `TP-S7-R2`: wording of the full sentence on hover for each summary kind.
16. `TP-S14-R2`: is the after-change notice a toast or an inline banner, and for how long?
17. `TP-S9-R7`: where "Existing work orders and Part Sales keep their prices and tier." shows: always, only once changed, and in Manage Customers too?
18. `TP-S4-R19`: is the simulator shown in the archived view, and what does an archived Same-as-previous column follow?
19. `TP-S9-R23` / `TP-S9-E5`: Remove-tab copy for the footer and the skip line. Also, the design's "Remove 1 Customer?" confirmation (screens 9.17–9.18) is not in the PRD.
20. `TP-S9-R12`: format of the customer's own shop supplies charge.
21. `TP-S2-R1`: copy for the channel split on hover.
22. `TP-S6-R6`: what the Categories column sorts by (first name or count)?
23. `TP-S3-R26`: which left-nav item is lit for a matrix opened from a category (Pricing is lit in the plan)?
24. `TP-S5-N1`: the error message for a zero cost.
25. `TP-S19-R9`: the column label is "Priced by" (short prepositions stay lower case; the PRD writes "Priced by").
26. `TP-S12-R2`: on a tablet, a tap on the editable price both focuses the input and opens the details. Confirm.
27. `TP-S2-R7`: the blocked dialog with many customers: full list with scroll, or capped?
28. `TP-S3-R31`: is the Part Sale switch disabled while the grid is in edit?
29. Risk 2: the add-path price change for free-typed numbers that map to a catalog category, on release day (`TP-S1-R3`).
30. `TP-S4-R29` / `TP-S19-R6`: header rule pickers are reached by normal tab order before the body cells. Confirm.
31. `TP-S1-R8`: the release note is outside the frontend plan (`/release-note`, backend seed).
32. `TP-S2-R27`: Undo toast persistence when leaving Settings › Pricing.

---

#### 11. Not verified
- That `QMenu` re-anchors when its `:target` element changes at runtime (the single shared popover depends on it). Fallback: one `q-menu` per open row via `v-if`.
- That `vue-router` exports `HistoryStateValue` for the guard. Otherwise use `HistoryState[string]`.
- `QTable` `sortOrder: 'da'` together with server-side `@request`.
- That the `customers/company` payload already carries `is_system_default`; I found it only on the Part Sale company payload.
- `FilterChip` and `FilterBar` test-id conventions.
- The tech quick-login role's permissions.
- Anything in the design canvas beyond its screen titles: layouts, the exact error-toast versus inline placements.