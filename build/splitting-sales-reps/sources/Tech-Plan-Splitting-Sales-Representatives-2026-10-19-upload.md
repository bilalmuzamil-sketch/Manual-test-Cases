# Splitting Sales Representatives — Technical Implementation Plan

**Date:** 2026-10-14
**PRD:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/919928833/Splitting+Sales+Representatives
**Jira epic:** [SV-10890](https://shopview.atlassian.net/browse/SV-10890) — stories SV-11265 … SV-11272
**Design:** https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm (shared with the team 2026-10-14)
**Tech stack:** Symfony 7.4 / PHP 8.5 / Doctrine ORM 3 / MySQL (api/), Vue 3.5 / Quasar 2 / TypeScript / TanStack Query (app/), Playwright (e2e/)
**Estimated complexity:** High — 3 schema migrations, a new customer child table, a per-side rewrite of the Sales By Representative query, and changes to the shared work order card, customer dialog and filter chip.
**Planned against:** `develop` @ 022941e459 (re-verified 2026-10-15; includes Part Sales Update v1 #3369). Every code anchor this plan names was re-checked on that commit after the PRD reached v8.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started — plan approved 2026-10-15; verification tickets SV-11384…SV-11392 (one per phase)
- **Current phase:** —
- **Last completed:** —
- **Delivery:** stacked phase PRs, each based on the previous phase's branch, rolling into an `SV-10890` integration branch; ONE final PR from the integration branch to `develop` (decision D13). The feature is always on with no flag, so nothing may reach `develop` before the whole stack is approved.
- **Open questions / blockers:** none. All six went to Product on the PRD and were answered on 2026-10-14 (reply 941981729); Product folded every answer into the PRD itself, which is now **v8, "Ready for tech plan"**. Each proposal was accepted:
  - **Q1 (S5-R2)** — the report labels each person with their **current** name, so a renamed rep stays one row; the captured name shows only when the staff record is gone. S5-R2 now says this.
  - **Q2 (S1-R4)** — match Lead Technician and Service Advisor exactly. S1-R4 no longer names a pixel value, so the plan builds to the existing **42px**.
  - **Q3 (S3-R4)** — on a touch screen the rep fields always show their dropdown arrow; Lead Technician and Service Advisor keep today's behavior. S3-R4 now says this.
  - **Q4 (design)** — the canvas is shared with the team. ⚠️ It renders its content in JavaScript, so it yields no extractable text to this tooling; items marked **[design-verify]** are still confirmed by eye in the browser walk against the canvas.
  - **Q12 (S4-R19)** — the rep rows show on every customer, address or not; the other fields on that card keep today's rule. S4-R19 now says this.
  - **Q13 (S5-N1)** — a split side with no dollars still gets a $0.00 row and counts the invoice once. S5-N1 now says this.
- **FYIs accepted and folded into the PRD** (items 5–8 and 11): invoices before 2026-07-29 stay Unassigned with no backfill (S5-E2); the Audit Log keeps today's history access (Story 7 prerequisites); the phone card expands with today's edit button (S3-R6); Release day lists the New Customer rep field; and the 10 legacy customers below.
- **🔴 One Product instruction the code does not corroborate — S1-R6 (16px gaps).** Product's reply calls this "a must-fix in this build" and says *"Today the gap under Lead Technician is wrong."* On `develop` **and** on `main`, `.assignee-field + .assignee-field { margin-top: 16px }` plus the two `:deep()` resets in `app/src/components/shared/OrderStatusCard.vue` already pin all three gaps to 16px, Lead Technician is passed `:required="false"` (so no validation strip is reserved), and the `Select` wrapper defaults `hideBottomSpace: true`. Product may be describing a state we did not reproduce, or an older build. **The plan treats S1-R6 as a requirement to verify and fix, not as already satisfied:** Phase 5's browser walk measures all three gaps in the editable, read-only and split states, and anything off 16px is fixed in that phase. If every state already measures 16px, S1-R6 closes as a no-op and the browser-walk evidence goes in the phase PR.
- **Known exception to S4-E1 (prod data, 2026-10-14):** 892 customers hold a rep; **10** hold a rep who is not a user of the customer's organization (deleted or foreign). The Phase 2 migration turns those 10 into "Unassigned". They already credit nobody on invoices; the visible change is that those 10 customer pages stop showing a name. Posted to Product as FYI (reply 941457409). **0** customer reps lack a staff row.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it. E2E coverage is not part of `/implement`: run `/e2e-after-change` before `/create-pr`.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement docs/tech-plans/2026-10-14-splitting-sales-representatives.md` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link. Use the **DesignSync** tool (load it with `ToolSearch` `select:DesignSync`), with `get_project` / `list_files` / `get_file` and the project id from a `claude.ai/design/p/<projectId>` link. `get_file` is capped at 256 KiB, so check `.truncated`. A `claude.ai/artifact/<id>` canvas opens with the **Artifact** tool (`action: "read"`), and a `figma.com` link with the Figma MCP. WebFetch and curl return 403. Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have these tools, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt. As of 2026-10-14 this canvas returns "not found" for engineering (Q4); until it is shared, build to the PRD text and confirm **[design-verify]** items in the browser walk.

---

## 1. Requirements (extracted from PRD)

Verbatim from the PRD (Confluence page 919928833, **v8 "Ready for tech plan"**, last modified 2026-10-14 16:41 — re-verified 2026-10-15: 138 requirement IDs, all present below, none added or removed by Product's edit). The PRD's own IDs are the FR IDs; each is tagged with its epic story.

**Story 1 (SV-11265): Give a work order its sales representative**

- **S1-R1** (SV-11265): The work order card shows a Sales Representative field directly under Service Advisor.
- **S1-R2** (SV-11265): The field is the same field as Lead Technician and Service Advisor: the label "Sales Representative" sits inside it on the first line and the name on the second, in the same text style, size, weight and left edge.
- **S1-R3** (SV-11265): At rest the field shows no box, no dropdown arrow and no buttons beside it.
- **S1-R4** (SV-11265): Hovering anywhere on the Sales Representative rows shows, on every Sales Representative field at once, the same box Lead Technician and Service Advisor show on hover, around the label and the name together, at the same height as those two fields and the same left edge. The dropdown arrow (S1-R11) and the buttons beside the fields (S2-R1, S2-R8) show at the same time. All of them stay shown while a Sales Representative dropdown or the + menu is open, or while a field has keyboard focus.
- **S1-R5** (SV-11265): The box ends 16px before the 32px column that holds the + and remove x buttons.
- **S1-R6** (SV-11265): The vertical gap between Lead Technician, Service Advisor and every Sales Representative field on the card is 16px. This holds with one field, with the Labor and Parts fields (S2-R5), and on the read-only card (S2-R17).
- **S1-R7** (SV-11265): With nobody assigned, the field reads "Unassigned".
- **S1-R8** (SV-11265): Clicking the field opens a dropdown. Its first option is "Unassigned", followed by every active sales representative, sorted by first name, then last name, A to Z.
- **S1-R9** (SV-11265): The option for the person in the field is checked. With nobody assigned, "Unassigned" is checked.
- **S1-R10** (SV-11265): The field has no x inside it. Picking "Unassigned" from the dropdown clears it.
- **S1-R11** (SV-11265): The dropdown arrow sits at the right end of the field, vertically centered on the label and the name together, the same as on Lead Technician and Service Advisor. With the Labor and Parts fields showing (S2-R5), the arrow sits instead in the bottom-right corner of each field, on the name line, so it never covers the longer label on a narrow or zoomed screen.
- **S1-R12** (SV-11265): The dropdown has no search box.
- **S1-R13** (SV-11265): Picking a person assigns them to the whole work order, labor and parts.
- **S1-R14** (SV-11265): Each change is saved as it is made. There is no Save button.
- **S1-R15** (SV-11265): The dropdown closes when the user picks an option, clicks outside it or presses Escape.
- **S1-N1** (SV-11265): A user without 'Work Orders — Create & Edit', or a work order that is invoiced, paid or opened from its history, shows the field as plain text with the same label and wording, with no + or remove x. If a change is sent by any other route, the system refuses it.
- **S1-N2** (SV-11265): A staff member whose Sales Representative switch is off is not listed and cannot be picked. If one is sent by any other route, the system refuses it with "The selected staff member is not a sales representative."
- **S1-N3** (SV-11265): If a change cannot be saved, the field returns to the last saved value and an error message shows.
- **S1-E1** (SV-11265): A change made while the previous change is still saving is ignored, and the + and remove x cannot be clicked until the save finishes. When it finishes, the field shows what was saved.
- **S1-E2** (SV-11265): A person whose Sales Representative switch was turned off, or whose staff account was deactivated, stays in the field until someone changes it. The field reads their name followed by "(Inactive)", for example "Elliot Brennan (Inactive)". They are not offered in the dropdown, so no option is checked while they hold the field.

**Story 2 (SV-11266): Give a work order a separate Labor and Parts representative**

- **S2-R1** (SV-11266): A + button sits to the right of the Sales Representative field: the design system's Tertiary button in its small icon-only size, 32px square with 8px corners, showing the Lucide plus icon at 20px.
- **S2-R2** (SV-11266): At rest the icon is grey on no fill. Hovering the button shows a light fill. The light fill stays while its menu is open.
- **S2-R3** (SV-11266): Hovering the + shows the tooltip "Add representative". The tooltip does not show while the menu is open.
- **S2-R4** (SV-11266): Clicking the + opens a menu below it with one option, "Sales Representative - Parts". Clicking outside the menu or pressing Escape closes it without a change.
- **S2-R5** (SV-11266): Picking "Sales Representative - Parts" closes the menu and replaces the one field with two fields, in this order: "Sales Representative - Labor" and "Sales Representative - Parts".
- **S2-R6** (SV-11266): Both fields start with the person who was in the one field, or "Unassigned" if it was empty. Adding the Parts field on its own changes nobody's credit.
- **S2-R7** (SV-11266): Neither dropdown opens on its own after the Parts field is added.
- **S2-R8** (SV-11266): A remove x sits to the right of "Sales Representative - Parts", in the column the + uses: the same Tertiary button, 32px square, showing the Lucide x icon at 20px, grey at rest with a light fill on hover.
- **S2-R9** (SV-11266): Hovering the remove x shows the tooltip "Remove Sales Representative - Parts".
- **S2-R10** (SV-11266): While the two fields show, the + is not shown, because there is nothing left to add. "Sales Representative - Labor" has no button beside it.
- **S2-R11** (SV-11266): Each of the two fields works as S1-R2 to S1-R15.
- **S2-R12** (SV-11266): Picking in one field never changes the other.
- **S2-R13** (SV-11266): "Sales Representative - Labor" is credited with the labor side of the invoice and "Sales Representative - Parts" with the parts side (Story 5).
- **S2-R14** (SV-11266): Both labels show in full on the card, never cut off.
- **S2-R15** (SV-11266): The work order keeps both fields when the page is reloaded or reopened, including when both hold the same person.
- **S2-R16** (SV-11266): Clicking the remove x replaces the two fields with the one "Sales Representative" field. It holds the person who was in "Sales Representative - Labor", or "Unassigned", and that person is credited with the whole work order, labor and parts.
- **S2-R17** (SV-11266): Once the work order is invoiced or paid, or when it is opened from its history, each field is plain text with the same label and wording, with no + or remove x. A work order with both fields shows both labels with their names.
- **S2-N1** (SV-11266): A side is never refilled on its own. Setting one side to "Unassigned" never hands that side to the other person and never fills it from the customer after the work order is created (S4-R24, S4-R28).
- **S2-N2** (SV-11266): A part sale's card has no + button. A part sale keeps one Sales Representative field.
- **S2-E1** (SV-11266): A person who is inactive (S1-E2) stays on the side they hold and reads "(Inactive)" in that field. Changing the other side is not refused because of them.
- **S2-E2** (SV-11266): Removing the Parts field while "Sales Representative - Labor" holds an inactive person keeps that person in the one field, reading "(Inactive)", until someone changes it.
- **S2-E3** (SV-11266): Removing the Parts field while "Sales Representative - Labor" reads "Unassigned" leaves the work order with nobody, so S4-R17 applies when it is invoiced.
- **S2-E4** (SV-11266): Changing a representative after the work order is invoiced or paid is not offered. A change sent by any other route is refused with "The sales representative cannot be changed on an invoiced or paid work order." The invoice keeps the names captured when it was created (Story 5). Reversing the invoice unlocks the field again, and the next invoice captures the names afresh.
- **S2-E5** (SV-11266): A work order split off another keeps the representatives of the one it came from: one field, or the Labor and Parts fields with the same people (S4-R29).

**Story 3 (SV-11267): Set the representatives on a phone**

- **S3-R1** (SV-11267): Tapping a Sales Representative field opens the same dropdown Lead Technician and Service Advisor open on a phone, with the same options as on a desktop (S1-R8, S1-R9).
- **S3-R2** (SV-11267): The + and remove x buttons are always shown, at the same 32px size (S2-R1, S2-R8), and work as on a desktop (Story 2).
- **S3-R3** (SV-11267): A field is cleared as on a desktop, by picking "Unassigned" (S1-R10). There is no x inside a field.
- **S3-R4** (SV-11267): Nothing in the fields or the buttons depends on hover. On a touch screen the Sales Representative fields always show their dropdown arrow, as the + and remove x buttons always do. Lead Technician and Service Advisor keep today's behavior, where the arrow shows once the field is tapped.
- **S3-R5** (SV-11267): On a phone, the Edit Customer and New Customer representative fields, their + and remove x work as on a desktop (Story 4), with the same native dropdown (S3-R1).
- **S3-R6** (SV-11267): On a phone the work order card opens collapsed, without Lead Technician, Service Advisor or the Sales Representative fields. They show after the card is expanded with its edit button, as Lead Technician and Service Advisor do today. The expand control itself does not change.

**Story 4 (SV-11268): Give a customer default representatives**

- **S4-R1** (SV-11268): The Edit Customer window and the New Customer window both show a Sales Representative field, in the place Edit Customer shows it today, with the outlined box every other field in the window has.
- **S4-R2** (SV-11268): The field is optional. A customer can be saved with nobody in it.
- **S4-R3** (SV-11268): Its dropdown starts with "Unassigned", followed by every staff member whose Sales Representative switch is on and whose account is active, sorted by first name, then last name, A to Z, as on the work order (S1-R8). Every one of them is listed, however many there are. It has no search box (S1-R12).
- **S4-R4** (SV-11268): No field in the window has an x inside it; picking "Unassigned" clears it (S1-R10). Each field's dropdown arrow is vertically centered (S1-R11). In the window the + and the remove x are always shown; they do not wait for hover.
- **S4-R5** (SV-11268): The + button of S2-R1 to S2-R3 sits to the right of the first field, with the tooltip "Add representative".
- **S4-R6** (SV-11268): Its menu lists, in this order, each field not yet added: "Sales Representative - Service Parts" and "Sales Representative - Part Sales". When both are added the + is not shown.
- **S4-R7** (SV-11268): Adding Service Parts renames the first field "Sales Representative - Service Labor" and shows "Sales Representative - Service Parts" under it. Both start with the person who was in the first field, or "Unassigned".
- **S4-R8** (SV-11268): Adding Part Sales shows "Sales Representative - Part Sales" last. It starts with the person new part sales get at that moment (S4-R26), or "Unassigned".
- **S4-R9** (SV-11268): The fields always show in this order: the first field ("Sales Representative", or "Sales Representative - Service Labor" once Service Parts is added), then Service Parts, then Part Sales.
- **S4-R10** (SV-11268): Service Parts and Part Sales each have the remove x of S2-R8 to their right, with the tooltip "Remove Sales Representative - Service Parts" or "Remove Sales Representative - Part Sales". The first field has the + instead, while there is something left to add, and otherwise no button.
- **S4-R11** (SV-11268): Removing Service Parts renames the first field "Sales Representative" again. It keeps the Service Labor person, who becomes the customer's one representative for labor and parts. A Part Sales field, if added, keeps its choice.
- **S4-R12** (SV-11268): Removing Part Sales makes new part sales follow again (S4-R26).
- **S4-R13** (SV-11268): While the Part Sales field is not added, a change to Service Parts, or to the one representative, changes what new part sales get at once.
- **S4-R14** (SV-11268): Picking a person, or "Unassigned", in the Part Sales field keeps that choice until someone changes the field or removes it. Changing Service Parts never changes it, even when both hold the same person.
- **S4-R15** (SV-11268): Neither dropdown opens on its own after a field is added.
- **S4-R16** (SV-11268): Nothing in the window is saved, including adding or removing a field, until the user saves the customer.
- **S4-R17** (SV-11268): A work order invoiced with nobody on either side is credited with the customer's Service Parts person on the parts side and the Service Labor person on the labor side. A customer that is not split gives its one person both sides.
- **S4-R18** (SV-11268): A part sale invoiced with no representative is credited, for the whole sale, to the person new part sales get from the customer (S4-R26), or to nobody when the Part Sales field reads "Unassigned".
- **S4-R24** (SV-11268): A new work order for a customer that is not split starts with the customer's representative in its one Sales Representative field. The work order is not split.
- **S4-R25** (SV-11268): A new work order for a split customer starts with the Labor and Parts fields: "Sales Representative - Labor" holds the customer's Service Labor person and "Sales Representative - Parts" holds the customer's Service Parts person. Removing its Parts field works as S2-R16.
- **S4-R26** (SV-11268): A new part sale starts with the customer's Part Sales field when it is added: the person picked, or "Unassigned" when "Unassigned" was picked. Without a Part Sales field it starts with the Service Parts person, or the one representative when the customer is not split.
- **S4-R31** (SV-11268): The Counter Sale customer works like any other customer here. Each location's Counter Sale starts with no representative, so walk-in part sales start "Unassigned" unless the shop sets one on Counter Sale.
- **S4-R32** (SV-11268): Picking a person, or "Unassigned", on a work order or part sale changes only that work order or part sale, never its customer.
- **S4-R27** (SV-11268): Only a staff member whose account is active and whose Sales Representative switch is on is copied (S1-R8). Anyone else leaves that field "Unassigned", and S4-R17 and S4-R18 still apply at invoicing.
- **S4-R28** (SV-11268): The customer's representatives are copied only when the work order or part sale is created. Changing the customer on an existing work order or part sale never changes its representatives.
- **S4-R30** (SV-11268): Changing a customer's representatives never changes its existing work orders or part sales. Only work orders and part sales created afterwards start with the new choice.
- **S4-R29** (SV-11268): A work order or part sale made from another one, by Split Work Order, Split Part Sale or reopening a paid work order, starts with the representatives of the one it came from: one field, or the Labor and Parts fields with the same people. It does not take the customer's.
- **S4-R19** (SV-11268): The customer page shows the representatives with the window's labels, in the window's order: "Sales Representative" or "Sales Representative - Service Labor", then "Sales Representative - Service Parts" when added, then "Sales Representative - Part Sales" when added. An empty one reads "Unassigned". The Sales Representative rows show on every customer, whether or not the customer has an address. The other fields on the page keep today's rule of showing only when the customer has an address.
- **S4-R20** (SV-11268): Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26).
- **S4-R21** (SV-11268): The warning shown before deactivating a sales representative counts every customer where they are in the first field, Service Parts or Part Sales, and counts each customer once.
- **S4-R22** (SV-11268): Renaming a staff member updates their name in every customer field they hold.
- **S4-R23** (SV-11268): The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales".
- **S4-N1** (SV-11268): A work order with a representative on either side does not use the customer's representatives, even for the empty side (S2-N1).
- **S4-N2** (SV-11268): Turning off a staff member's Sales Representative switch, without deactivating their account, leaves them in the customer fields they hold, as today.
- **S4-N3** (SV-11268): Re-importing an existing customer through the contacts import never changes its representatives. Every field, including Service Parts and Part Sales, stays as it was. Before this change a re-import cleared the customer's representative.
- **S4-E1** (SV-11268): On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative, so the customer page and every invoice read exactly as before, except that an empty field reads "Unassigned" instead of "N/A".
- **S4-E2** (SV-11268): A Part Sales field that holds the same person as Service Parts stays added. It does not change when Service Parts changes (S4-R14).

**Story 5 (SV-11269): Credit each side on the invoice and in Sales By Representative**

- **S5-R1** (SV-11269): When a work order is invoiced, the parts representative and the labor representative in effect are both captured on the invoice, by name.
- **S5-R2** (SV-11269): The names captured on the invoice do not change afterwards, including when a staff member is renamed or deactivated. That is what the invoice stores. The report labels each person with their current name, as it does today, so a renamed representative stays one row; it shows the captured name only when the staff record no longer exists.
- **S5-R3** (SV-11269): The report reads every invoice as one row per representative per Sales Type: "Labor" for a work order's labor side, "Parts" for its parts side, and "Part Sales" for a part sale.
- **S5-R4** (SV-11269): A Labor row is credited with Labor Invoiced, Labor Margin, labor-line fees and discounts, Hrs Worked, Hrs Invoiced, Labor Delta and all of the invoice's Shop Supplies, including an amount typed by hand.
- **S5-R5** (SV-11269): A Parts row is credited with Parts Invoiced, Parts Margin and part-line fees and discounts.
- **S5-R6** (SV-11269): Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00.
- **S5-R7** (SV-11269): A cent left over by rounding the share goes to the Labor row.
- **S5-R8** (SV-11269): A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned.
- **S5-R9** (SV-11269): A part sale is one "Part Sales" row holding every dollar of the invoice.
- **S5-R10** (SV-11269): When one person, or Unassigned, holds both the Labor and the Parts side of a work order and the Sales Type filter includes both, the two show as one row whose Sales Type reads "Labor, Parts" and whose figures are the sum of both sides.
- **S5-R11** (SV-11269): Two different people on one work order are always two rows.
- **S5-R12** (SV-11269): With the Sales Type filter narrowed to Labor or to Parts, only that side's row shows (Story 8).
- **S5-R13** (SV-11269): A representative counts an invoice once, even when they have two rows for it. When two people split an invoice, each counts it once, so the representatives' invoice counts can add up to more than the shop's.
- **S5-R14** (SV-11269): With Show Unassigned on, the report's totals are the same whether invoices are split or not. With it off, a side credited to Unassigned is left out of the totals, as Unassigned money is today.
- **S5-R15** (SV-11269): On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero.
- **S5-R15a** (SV-11269): On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when it has none.
- **S5-R16** (SV-11269): A representative's summary row always shows real sums, never dashes.
- **S5-R17** (SV-11269): On an invoice row, the Margin % uses only the side the row is credited with.
- **S5-R18** (SV-11269): A side with no representative is credited to Unassigned, which shows when Show Unassigned is on, as today.
- **S5-R19** (SV-11269): An invoice row carries a "Sales Type" column, after Status, reading "Labor", "Parts", "Part Sales" or "Labor, Parts".
- **S5-R20** (SV-11269): The Sales Type column is offered in the report's column selector, first in its list.
- **S5-R21** (SV-11269): The Sales Type column is off by default on screen, for every user.
- **S5-R22** (SV-11269): A user who turns the Sales Type column on keeps it on for later visits.
- **S5-R23** (SV-11269): The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF.
- **S5-R24** (SV-11269): The Sales Type column holds no money, so the report's existing rules for who may see money apply to the other columns unchanged.
- **S5-N1** (SV-11269): An invoice totaling $0.00 adds $0.00 to each representative it is credited to, and counts once for each, as a single representative's $0.00 invoice does today. On a split work order, a side with no dollars (for example no parts at all) still gives its representative a $0.00 row, and the invoice counts once for them.
- **S5-N2** (SV-11269): A negative amount is always credited to a representative, never dropped or left out. A returned part on the invoice reduces the parts representative and a labor credit reduces the labor representative, the same way positive amounts are credited.
- **S5-E1** (SV-11269): When one side is negative, the shares are still measured by size. Example: labor $600.00, parts ($100.00), whole-invoice discount ($70.00). The shares are six sevenths and one seventh, so the Labor row gets ($60.00) and the Parts row ($10.00). Subtotals $540.00 and ($110.00) add up to $430.00, the invoice total.
- **S5-E2** (SV-11269): Every invoice created before the release has its one representative on both sides, so the report for any past date reads exactly as before, with that person's Labor and Parts rows shown as one "Labor, Parts" row (S5-R10). Invoices created before 2026-07-29 have no representative recorded; they stay Unassigned on both sides, and none is added.

**Story 6 (SV-11270): Print both representatives on the work order**

- **S6-R1** (SV-11270): The printed Sales Representative row reads the one name when one person holds both sides, for example "Devon Whitfield", or "Devon Whitfield (Inactive)" when they are inactive.
- **S6-R2** (SV-11270): When two people hold the two sides, the row reads both, Parts first: "Devon Whitfield (Parts) · Elliot Brennan (Labor)". An inactive person reads "(Parts, inactive)" or "(Labor, inactive)".
- **S6-R3** (SV-11270): When one side is empty, the row reads "Devon Whitfield (Parts) · Unassigned (Labor)" or "Unassigned (Parts) · Elliot Brennan (Labor)", the same wording as the work order log (S7-R3).
- **S6-R4** (SV-11270): With nobody on either side, the row is left off the printout, as today.
- **S6-N1** (SV-11270): A side whose staff member no longer exists prints as Unassigned. A row never reads a bare "(Inactive)".

**Story 7 (SV-11271): Record representative changes in the work order log**

- **S7-R1** (SV-11271): Each change to a work order's representatives, including adding or removing the Parts field, writes one log entry, "Sales representative changed".
- **S7-R2** (SV-11271): The entry shows "Sales Representative: {before} → {after}". A work order that is not split reads the one name, or "Unassigned".
- **S7-R3** (SV-11271): A split work order reads both sides, Parts first: "Devon Whitfield (Parts) · Elliot Brennan (Labor)". An empty side reads "Unassigned", for example "Devon Whitfield (Parts) · Unassigned (Labor)".
- **S7-R4** (SV-11271): A change that leaves the representatives as they were writes no entry.
- **S7-R5** (SV-11271): Representatives copied from the customer when a work order is created (S4-R24, S4-R25) write no "Sales representative changed" entry.

**Story 8 (SV-11272): Filter both sales reports by Sales Type**

- **S8-R1** (SV-11272): Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default.
- **S8-R2** (SV-11272): Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12).
- **S8-R3** (SV-11272): With all three selected the filter reads "Sales Type: All". With none it reads "Sales Type: None". Otherwise it reads the selected names in option order, for example "Sales Type: Labor, Parts".
- **S8-R4** (SV-11272): The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file.
- **S8-R5** (SV-11272): With no option selected the report includes no invoices and shows its empty state.
- **S8-R6** (SV-11272): On Sales By Customer, the filter labeled "Product Type" today is labeled "Sales Type".
- **S8-R7** (SV-11272): Its two options read "Part Sales" and "Service Sales".
- **S8-R8** (SV-11272): With both options selected, the filter reads "Sales Type: All Sales". With one, it reads that option's name, for example "Sales Type: Part Sales". With none, it reads "Sales Type: No sales".
- **S8-R9** (SV-11272): The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file.
- **S8-R10** (SV-11272): What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them.
- **S8-N1** (SV-11272): No Sales By Customer figure, row or count changes because of the new wording.
- **S8-E1** (SV-11272): A Sales By Customer filter choice remembered from before the release opens with the same options selected, under the new names.

### Non-functional requirements

All four are introduced by analysis (the PRD is silent or assumes current behavior that does not hold).

- **NFR-001 (SV-11265, SV-11269) — Tenant-scoped rep lookups.** Every staff/user join that resolves a sales rep name or inactive flag is scoped to the organization: today the work order details join and the Sales By Representative join are not (D4). Applies to both sides.
- **NFR-002 (SV-11268) — Server-validated customer reps.** Customer create/change accept rep ids only for users of the caller's organization; names are never client-supplied; a newly assigned rep must be an active sales rep (D5). Today the endpoint writes any UUID and any name straight through.
- **NFR-003 (SV-11266, SV-11268, SV-11269) — No whole-table rewrites.** Every schema change is an appended nullable/defaulted column (`ALGORITHM=INSTANT`) or a new table; no backfill of `work_order` or `invoice` (old rows read as "not split" by construction, D1/D2). The one data copy is `company` → the new child table (≈ 10^3–10^5 rows).
- **NFR-004 (SV-11269) — No 500 from new binary columns.** Endpoints that select `i.*` from `invoice` must not leak the new BINARY(16) column into JSON (the SV-9496 regression class; `ListVehicleInvoices`).

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|----------|-----------|--------|
| Anything to add beyond the PRD? | intake | Nothing — analyze the PRD as-is. |
| Invoiced/paid work orders refuse rep changes by any route | prd-review (accepted) | Accepted by Product. **Not built** for service work orders (only part sales): Phase 4. |
| Contacts re-import never changes reps | prd-review (accepted) | Accepted. Not built (import blanks the rep today): Phase 2. |
| New Customer from the work order window needs only 'Work Orders — Create & Edit' | prd-review (accepted) | Accepted, as today. Forces the picker change C1 (Phase 2). |
| Customer rep list A–Z, every active rep | prd-review (accepted) | Accepted. |
| SBR saved columns/sort reset once; old Product Type links open with every Sales Type | prd-review (accepted) | Accepted: saved-view version bump + new `salesTypes` filter key. |
| Shop Supplies dash on Parts rows; Part Sales row shows its own supplies or a dash | prd-review (accepted) | Accepted. |
| Q1 Rename vs captured name on past invoices | Confluence comment 939720718 | **Answered** (reply 941981729, PRD v8): current name; captured name only when the staff record is gone. S5-R2 rewritten. |
| Q2 44px vs 42px | Confluence comment 939720718 | **Answered**: match Lead Technician and Service Advisor exactly; S1-R4 no longer names a number → build to the existing 42px. |
| Q3 Phone dropdown arrows | Confluence comment 939720718 | **Answered**: rep fields always show the arrow on touch; Lead Technician and Service Advisor unchanged. S3-R4 extended. |
| Q4 Design canvas access | Confluence comment 939720718 | **Answered**: shared with the team. The canvas renders in JavaScript and yields no extractable text here, so **[design-verify]** items are confirmed by eye in the browser walk. |
| Q5–Q8 FYIs (pre-2026-07-29 invoices, Audit Log permission, phone expand control, New Customer field) | Confluence comment 939720718 | **Accepted** and folded into the PRD (S5-E2, Story 7 prerequisites, S3-R6, Release day). |
| Q12 Customers with no address | Confluence reply 940572683 | **Answered**: rep rows show on every customer; other fields keep today's rule. S4-R19 extended. |
| Q13 $0 side of a split invoice | Confluence reply 940572683 | **Answered**: $0.00 row and the invoice counts once for that rep. S5-N1 extended. |
| Customer rep storage | user | Child table keyed by user.id, names read live (D12). Columns-on-company rejected: every reader changes anyway, and a later extraction pays twice. |
| Delivery shape | user | Stacked phase PRs into an integration branch, one PR to develop (D13). |
| Invoice volume (D3) | prod query | `SELECT BIN_TO_UUID(organization_id) AS org, COUNT(*) AS invoices_12m FROM invoice WHERE created_on >= NOW() - INTERVAL 12 MONTH GROUP BY organization_id ORDER BY invoices_12m DESC LIMIT 5;` → 9,674 / 6,912 / 4,883 / 4,574 / 4,510. Live per-side query is cheap; no derived credit table. |
| Q15 FYI: 10 legacy customers read Unassigned | Confluence reply 941457409 | **Accepted** by Product. |
| Legacy customer reps (Phase 2 migration) | prod query | `SELECT COUNT(*) AS customers_with_rep, SUM(u.id IS NULL) AS rep_not_a_user_of_org, SUM(u.id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM staff s WHERE s.user_id = u.id)) AS user_without_staff_row FROM company c LEFT JOIN user u ON u.id = c.sales_rep_id AND u.organization_id = c.organization_id WHERE c.sales_rep_id IS NOT NULL;` → 892 / 10 / 0. The 10 become Unassigned (known S4-E1 exception); no user-name fallback needed at invoicing. |

### What the code already does (verified on develop @ 5cb4ad9061; re-verified @ 022941e459)

The PRD describes several things as new that partly exist, and assumes several things that do not hold:

- **Already built:** the work order's single rep field with "Unassigned", (Inactive), save-as-you-go and the read-only gate (SV-8599); the 16px gap (S1-R6); the "not a sales representative" refusal (S1-N2); the "Sales representative changed" log entry for one rep (#3369); the frozen rep name on the invoice; the labor / parts / shop supplies / whole-invoice money columns on every invoice; the Unassigned bucket and Show Unassigned; "Empty export" on both reports.
- **Assumed but not true today:** a rename updates every customer (it updates one, `findOneBy`); service work orders refuse rep changes after invoicing (only part sales do); the customer rep write path is validated (it is not); New Customer has a rep field (it does not); the customer dropdown has no search box and offers "Unassigned" (it has a search box and no Unassigned); the 36px gap context note (already 16px); split / reopen copy the rep (nothing copies it).
- **Prior review notes refuted:** Sales By Representative does not group by a CASE today (`GROUP BY i.sales_rep_id`); the history snapshot's customer part carries the single rep, not "only Service Parts"; nothing copies the pre-split rep columns.

## 2. Architecture Overview

One idea runs through every layer: **a "split" flag plus a second rep id**, where an unsplit record's Parts side *follows* its Labor (one) rep. That keeps every existing row valid with no backfill (NFR-003), and makes "a shop that never splits sees no change" true by construction.

```
 Customer (company)                      Work order / part sale (work_order)          Invoice (invoice)
 ┌──────────────────────────────┐  copy  ┌──────────────────────────────┐  capture  ┌────────────────────────────┐
 │ company_sales_representative │ ─────► │ sales_rep_id      (Labor/one)│ ────────► │ sales_rep_id/_name  (Labor)│
 │  side=primary        user.id │ create │ parts_sales_rep_id (if split)│ invoice   │ parts_sales_rep_id/_name   │
 │  side=service_parts  user.id │ split  │ sales_rep_split               │ creation  │ sales_rep_split            │
 │  side=part_sales     user.id │ reopen │ (part sale: never split)      │           │ (frozen afterwards)        │
 └──────────────────────────────┘        └──────────────────────────────┘           └─────────────┬──────────────┘
          ▲ names read live (user)        ▲ change-sales-rep (one save, one log entry)            │ live query
          │ fallback at invoicing  ───────┴──── only when the WO has nobody on either side         ▼
                                                                    Sales By Representative: per-side rows
                                                                    Labor | Parts | Part Sales  → group by rep
                                                                    whole-invoice share by size, integer cents
```

- **Customer (Phase 2–3).** A new child table owned by the `Company` aggregate holds up to three rows: `primary` (the one rep / Service Labor), `service_parts`, `part_sales`. A row exists ⇔ the field is added; `user_id` NULL ⇔ explicit "Unassigned". Keyed by **user.id** like today; names are joined live from `user`, so renames reach every customer (S4-R22) with no subscriber. The legacy `company.sales_rep_*` columns stay mapped but are no longer read or written (dropped in a follow-up).
- **Work order (Phase 4–6).** `work_order.sales_rep_id` stays the Labor (or one) rep; `parts_sales_rep_id` + `sales_rep_split` are appended. One endpoint (`POST /api/work-orders/change-sales-rep`) carries the full desired state, so adding/removing the Parts field is one save and one log entry. New documents copy the customer's eligible reps at creation (not via the change endpoint, so no log entry, S7-R5); split/reopen copy the source's reps.
- **Invoice (Phase 7).** Captured once at invoice creation, both sides, by staff id and name. A work order with nobody on either side falls back to the customer (S4-R17/R18).
- **Report (Phase 8–9).** Each invoice becomes per-side rows (Labor + Parts for a work order, one Part Sales row for a part sale) via a cross join to a 3-row constant table, filtered by the new Sales Type filter. The whole-invoice adjustment column is shared by size in integer cents; then rows group by rep (Level 1) or by (rep, invoice) (Level 2, which produces the "Labor, Parts" merge). Prod volume is small (largest org: 9,674 invoices / 12 months).
- **Picker.** `GET /api/sales-reps` becomes the single rep picker for both surfaces: it returns staff `id` (work order) and `user_id` (customer), A–Z, unpaginated, and is allowed for work-order view, work-order create/edit and customer create/edit (C1).


## 3. Technical Decisions

| ID | Decision | Chosen by | Rationale / rejected alternatives |
|---|---|---|---|
| D1 | Work order: keep `sales_rep_id` as the one/Labor rep; add `parts_sales_rep_id` + `sales_rep_split`; unsplit ⇒ Parts follows Labor | agent | No backfill; S2-R15 needs the flag even when both sides hold the same person. Part sales never split. |
| D2 | Invoice: existing `sales_rep_id/_name` = Labor (and the whole part sale); add parts id + name + split flag; old invoices unsplit | agent | S5-E2 holds by construction; removes the whole-table backfill a prior review warned about. |
| D3 | Sales By Representative stays a live query over per-side rows; share in integer cents; leftover cent to Labor; invoice count = COUNT(DISTINCT invoice) | agent | Confirmed by prod: largest org 9,674 invoices / 12 months. Rejected: a derived per-side credit table written at invoicing (unneeded at this volume). |
| D4 | Scope the rep staff/user joins (work order details + SBR) to the organization, both sides | agent | Tenant scoping is CRITICAL; a second rep would duplicate the unscoped join. Behavior change: a cross-org id now reads "(Inactive)" with no name. |
| D5 | Customer rep writes: server derives names, checks org membership always, checks active + sales-rep flag only for ids the customer does not already hold | agent | S4-N2 holders stay re-savable; closes the "any UUID, any name" hole. |
| D6 | Renames reach every customer field | agent | S4-R22; achieved by reading names live (the buggy `ChangeSalesRepName` subscriber is deleted). |
| D7 | Extend the invoiced/paid refusal to service work orders: "The sales representative cannot be changed on an invoiced or paid work order." | agent | Accepted by Product in the PRD review; part-sale message unchanged. |
| D8 | SBR Sales Type filter under a new `salesTypes` key; saved-view version bump | agent | Old links fall back to defaults automatically; one-time reset of columns + sort (accepted by Product). |
| D9 | New shared UI pieces: 32px icon button on `Button`, vendored Lucide `plus`/`x`, opt-in list-names mode on `FilterChip` | agent | None exist; the shared chip must not change on ~15 other screens. |
| D10 | "Phone" = `@media (hover: none)`, not screen width | agent | PRD defines it as a touch screen with no mouse pointer; `.card-action-btn` precedent. |
| D11 | Copy customer reps in the WO/part-sale create handlers (eligible staff only), not via the change endpoint; split/reopen copy the source | agent | S7-R5 (no log entry); S4-R27. Service advisor is not copied (out of scope). |
| D12 | Customer reps in a child table keyed by user.id; no denormalized names; legacy columns frozen, dropped in a follow-up | user | Every customer reader changes for 3 fields anyway; removes presence flags and the rename bug class. Rejected: columns on `company` (flags + 3× denormalized names; extracting later pays twice); normalize to staff.id (picker permission trap, no product value). |
| D13 | Stacked phase PRs into an integration branch; one PR to develop | user | Smaller, single-concern reviews for AI reviewers; the always-on feature lands in one release. |
| D14 | `GET /api/sales-reps` is the one picker (adds `user_id`; wider permissions) | agent | `/api/staff` needs a staff-view permission that 'Work Orders — Create & Edit' lacks → New Customer from a work order would eject to Access Denied; it also pages 100 rows by id (S4-R3). |
| D15 | `change-sales-rep`: `split`/`parts_sales_rep_id` optional; eligibility only for ids the WO does not already hold | agent | S2-E1/E2/R6 (an inactive holder can be copied to Parts); keeps the part-sale path and the E2E factory working. Absent-field semantics: see D21. |
| D16 | SBR filter encoding `all` \| `none` \| comma subset | agent | An empty array vanishes in the query string, so "none" (S8-R5) would arrive as "all". `invoiceStatus` precedent. |
| D17 | No "(Inactive)" suffix on customer fields | agent | PRD feedback table scopes "(Inactive)" to the work order field. |
| D18 | The part sale's rep field moves onto the new work order rep component with the + off | agent | One save path; it inherits the S1-E1 in-flight fix. Existing part-sale test ids kept. |
| D19 | Migration copies a legacy customer rep only when it is a user of the customer's org | agent | Prod: 10 of 892 are not; a kept foreign id would make the customer unsaveable under D5. |
| D20 | Part sale vs work order on the report = invoice prefix `P%` vs everything else (P-9) | agent | Keeps the default (all Sales Types) report equal to today's for every invoice; differs from the removed SBR "Service" filter only for invoices numbered outside both prefixes. Raised by the PRD audit. |
| D21 | An absent `split` on `change-sales-rep` preserves the stored split state and Parts rep; only an explicit `split=false` un-splits; `parts_sales_rep_id` is honored only with `split=true` | agent | The first contract made an absent `split` un-split, which let any caller that predates the split (E2E factory, stale tab) silently drop the Parts side, violating S2-N1. Raised by the PRD audit. |
| D22 | **No code change** to the public API's staff update; add a regression test only | agent | Verified at `022941e459`: `OpenApi/Staff/Application/Update/UpdateController.php:121-129` already cascades a staff rename to the user (`$user->changeName(new UserName(…))`, "Type-A cascade", SV-7240), and `User::changeName()` (`IAM/Domain/User/User.php:97`) raises `UserNameChanged`. So customer-surface names, read live from `user`, follow every rename path (S4-R22). An earlier draft claimed the controller wrote only `staff`; that was wrong (it read only the staff writes at L81-85). The regression test (rename via the public API, then GET a customer holding that rep → new name) guards the cascade. |


### 3.1 Backend design decisions (P-1 … P-12)

| # | Decision | Why / rejected alternative |
|---|---|---|
| P-1 | **Child table has NO `organization_id`** (amends D12's illustrative DDL): `company_sales_representative(id, company_id FK, side, user_id)`, index `(user_id)`, unique `(company_id, side)`. Tenant scope = join `company c` + `OrganizationDecorator` on `c.organization_id` (one hop, allowed by database.md). | (a) A user.id belongs to exactly one org, so `(user_id)` is as selective as `(organization_id, user_id)`. (b) `Company::$organizationId` is nullable and set AFTER construction (`CreateCommandHandler` calls `setOrganizationId()` after `new Company`, as do the import, OpenAPI and Counter Sale paths), so a denormalized copy on the child would need propagation logic and could drift. Rejected: keeping `organization_id` on the child plus syncing it in `setOrganizationId()`. |
| P-2 | **`side` is `VARCHAR(20)` + PHP backed enum (`enum-type`)**, not MySQL `ENUM` (amends D12). | DBAL schema tooling does not round-trip MySQL ENUM, so `doctrine:migrations:diff` would not stay a no-op. Precedent: `InspectionAxle.tire_configuration`. |
| P-3 | Child entity class **`CompanySalesRepresentativeAssignment`** (table `company_sales_representative`, alias `csr__`). | `CompanySalesRepresentative` is already the legacy embeddable that keeps the `company.sales_rep_*` columns mapped (and that must stay mapped so the diff stays a no-op until the follow-up drop). |
| P-4 | **Keep the `Company` constructor signature** (param #5 `CompanySalesRepresentative`, now `@deprecated`). Every `src/` caller passes `new CompanySalesRepresentative()`. The constructor body adds the `primary` (Unassigned) child row. **Remove** `salesRepresentative` from `Company::change()`. | There are 73 `new Company(` sites at `022941e459` (6 in `src/`, 67 in `tests/`). Removing positional param #5 shifts every later positional arg, which is pure churn in a phase that must stay reviewable. The follow-up column drop removes the param. `change()` has exactly one production caller (contacts import, named args) and one test. |
| P-5 | Legacy `company.sales_rep_*` stays mapped (embeddable), is never mutated after this release, and new companies get NULLs. `Company::getSalesRepresentative()` / `unassignSalesRepresentative()` lose all `src/` callers and are marked `@deprecated` (remove them in the follow-up). | D12. **Sales Follow-Up report** (`SalesFollowUpReportQueryHandler`) keeps reading those columns, so it shows each customer's pre-release one rep with the name as it was at release, nothing for new customers, and no renames. It is out of scope and does not load today. |
| P-6 | The migration copies `company.sales_rep_id` to `primary.user_id` **only when that user belongs to the company's organization** (LEFT JOIN `user` with an org predicate). Foreign or dangling ids become Unassigned. | The read side joins live names with an org predicate anyway, so a foreign id could never render a name. Copying it would leave a held id that D5's always-on org check then refuses on the next save, making the customer un-savable. See §9 ENG-Q1. |
| P-7 | SBR share arithmetic in SQL uses **exact integer division** through a tiny platform-aware helper (`DIV` on MySQL, `/` on SQLite, both on non-negative integers). | MySQL `/` returns DECIMAL rounded to `div_precision_increment` (4) places, so `FLOOR(a/b)` is wrong when the quotient lies within 0.00005 below an integer, which is reachable for D > $100. Functional tests run on SQLite (`.env.test`), where `DIV` does not exist. Precedent for platform checks in Infrastructure SQL: `WorkOrderRowLocker`, `DbalPartReturnRequestListFetcher`. |
| P-8 | SBR per-side rows come from a **cross join to a 3-row constant derived table** (`labor`, `parts`, `part_sales`), filtered by `:sbrSalesTypes`, rather than a three-branch UNION ALL. | One invoice scan, one WHERE, one parameter set. Each query then binds parameters once (DBAL named params). This is functionally the UNION ALL that D3 describes. |
| P-9 | **Decision (not a restatement):** an invoice numbered `LIKE 'P%'` is a part sale (one Part Sales row); **every other invoice** — `S%` and any number outside both prefixes — is a work order with a Labor row and a Parts row. | The invariant that matters is the **default** view (all three Sales Types selected), which must include every invoice exactly as today's unfiltered report does (S5-R14, S5-E2). Classifying the remainder as work orders keeps that true. ⚠️ This is **not** today's SBR/SBC "Service" predicate, which is `LIKE 'S%'` (`SalesByRepresentativeProductType.php:60-67`): an invoice outside both prefixes was excluded when "Service" was selected, and will now appear under Labor/Parts. There is no prior behavior to break — the Product Type filter is removed from SBR and the Labor/Parts filters are new — and SBC keeps its own `S%`/`P%` enum unchanged (S8-N1, S8-R10). Pre-merge, run `SELECT COUNT(*) FROM invoice WHERE invoice_number NOT LIKE 'P%' AND invoice_number NOT LIKE 'S%';` on prod and record the count in the Phase 8 PR. |
| P-10 | `ChangeSalesRep` moves to the canonical layout: `UI/HTTP/ChangeSalesRep/ChangeSalesRepController.php` + `DTO/ChangeSalesRepRequestDto.php`. The Command becomes pure data. The route path and name stay the same. | The contract changes anyway. Per AGENTS.md "Documentation over codebase" and the project convention "follow canonical architecture", new code must not extend the legacy `Application/ChangeSalesRep/ChangeController`. The customer create/change commands are NOT restructured (out of scope). They only gain one parameter, and the legacy RequestPayload-on-Command shape is recorded as pre-existing. |
| P-11 | The invoice stores parts columns only when split: `sales_rep_split=0` ⇒ `parts_sales_rep_id`/`parts_sales_rep_name` NULL, and readers use `CASE WHEN split=1 THEN parts ELSE labor END`. | D2: old invoices have split=0, so S5-E2 holds with no backfill, and new unsplit invoices are byte-identical in shape to old ones. |
| P-12 | Customer-surface names (view, export, snapshot) come from **user** first/last name (the customer stores user.id, and today's denormalized names were user names via `UserNameChanged`). WO and invoice names stay **staff** names, as today. | Keeps each surface on the identity it already uses. Staff and user names stay in sync on every rename path: a user rename reaches staff via `ChangeStaffMemberName` (on `UserNameChanged`); the in-app staff edit (`Staff/Application/Change/ChangeCommandHandler.php:74`) and the public API's staff update (`OpenApi/Staff/Application/Update/UpdateController.php:121-129`, the "Type-A cascade") both call `User::changeName()`. D22 pins this with a regression test. |

No 🔴 Golden-Rule departures. Every new query is tenant-scoped. D4 *adds* scoping. Nothing bypasses
`OrganizationDecorator`. The one cross-context read pattern used, VehicleService/Invoicing Application
reading the Customer `Company` aggregate and the Staff repository, already exists in
`InvoiceSalesRepResolver` and `PartSale\Create\CreateCommand`.

### 3.2 Frontend component structure

**The WO card and the customer dialog do NOT share one extracted rep-fields component.** They share two small primitives
and nothing else:

| Shared | Not shared, and why |
|---|---|
| `IconActionButton.vue` (D9: 32px square, 8px radius, grey Lucide icon at 20px, light fill on hover/active, tooltip suppressed while active) | Field skin: WO = `hidden` Select (no box at rest, group hover, S1-R3/R4); customer = outlined Select with a box (S4-R1) |
| `AddRepresentativeButton.vue` (+ with `q-menu` listing the addable sides, menu-open state, `disable`) | Save model: WO saves every change at once through a mutation with an in-flight latch and rollback (S1-R14, S1-E1, S1-N3); customer is a draft until Save (S4-R16) |
| `salesRepLabels.ts` two-sided formatter (print and audit log only) | Id space: WO options are staff.id (`/api/sales-reps`); customer options are user.id |
| | Side set and rules: WO has 2 sides, + only while unsplit, x on Parts; customer has 3 sides, a menu of up to 2, x on each added field, Part Sales "follows" logic (S4-R8/R12/R13) |
| | Button visibility: WO hover-revealed (touch: always); customer always visible (S4-R4) |

A single component would need a variant flag for skin, save model, id space, side set and visibility, i.e. two
components behind one name. The geometry (field column, 16px gap, 32px button column) is three lines of CSS grid, cheaper
duplicated than parameterised.

## 4. Database Changes

Three hand-written migrations, one per schema phase. All are non-transactional and guarded (idempotent), following `Version20260729130000`. Each must leave `bin/console doctrine:migrations:diff --allow-empty-diff` reporting "No changes detected".

| Phase | Migration (name indicative) | Change |
|---|---|---|
| 2 | `api/migrations/Version20261015100000.php` | NEW table `company_sales_representative(id, company_id FK→company ON DELETE CASCADE, side VARCHAR(20), user_id BINARY(16) NULL)`, unique `(company_id, side)`, index `(user_id)`; one `INSERT … SELECT` creating a `primary` row per company (copying `company.sales_rep_id` only when it is a user of the company's org). |
| 4 | `api/migrations/Version20261015100100.php` | `work_order` ADD `parts_sales_rep_id BINARY(16) NULL`, `sales_rep_split TINYINT(1) NOT NULL DEFAULT 0` — `ALGORITHM=INSTANT`, no index, no FK (mirrors `sales_rep_id`). |
| 7 | `api/migrations/Version20261015100200.php` | `invoice` ADD `parts_sales_rep_id BINARY(16) NULL`, `parts_sales_rep_name VARCHAR(255) NULL`, `sales_rep_split TINYINT(1) NOT NULL DEFAULT 0` — `ALGORITHM=INSTANT`, no backfill. |

```sql
-- Illustrative shape only, NOT the migration to copy-paste (full sketch in Phase 2, §3.1)
CREATE TABLE company_sales_representative (
  id BINARY(16) NOT NULL, company_id BINARY(16) NOT NULL, side VARCHAR(20) NOT NULL, user_id BINARY(16) DEFAULT NULL,
  INDEX csr__user_id_idx (user_id), UNIQUE INDEX csr__company_id_side_unq (company_id, side), PRIMARY KEY(id));
ALTER TABLE work_order ADD parts_sales_rep_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;
ALTER TABLE invoice    ADD sales_rep_split TINYINT(1) NOT NULL DEFAULT 0, ALGORITHM=INSTANT;
```

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`. (The Phase 2 FK comes from a Doctrine association, so it is **not** manually managed — see §3.1.) `side` is VARCHAR + PHP enum, never MySQL `ENUM`, so the diff stays a no-op.

### Data migrations

- **Customer reps (Phase 2):** one `primary` row per existing company; 892 customers carry a rep today, 10 of which are not users of their org and become Unassigned (known S4-E1 exception). Expected `company` size 10^3–10^5 rows; batch by `c.id` range only if `SELECT COUNT(*) FROM company` exceeds ~1M.
- **Work orders and invoices:** none. Existing rows read `sales_rep_split = 0`, so their Parts side follows the one rep (S5-E2, "every open work order keeps its one sales representative").
- **Derived data maintenance:** none introduced. The per-side report rows are computed at query time (D3).
- **Follow-up (separate ticket, after one release):** drop `company.sales_rep_id/_first_name/_last_name`, the legacy embeddable, the `Company` constructor param, and repoint or remove the out-of-scope Sales Follow-Up report, which keeps reading the frozen columns.


## 5. API Changes

Final contract. Sub-sections keep the numbers §0.1–§0.9 that the phase sections below refer to. Items marked **AMENDED** differ from the first proposal; amendments C1–C5 came from the frontend analysis and are all accepted.

#### 0.1 `POST /api/work-orders/change-sales-rep` (route path + name `work_order_change_sales_rep` unchanged)
Request:
```json
{ "work_order_id": "uuid", "sales_rep_id": "uuid|null", "split": true|false, "parts_sales_rep_id": "uuid|null" }
```
- **AMENDED (C2, revised after the PRD audit): `split` and `parts_sales_rep_id` are OPTIONAL, and an absent
  `split` PRESERVES the stored split state** (D21). Unsplit WO + absent `split` = today's single-rep write
  (the part-sale path and the E2E `setSalesRep` factory keep working unchanged). Split WO + absent `split` =
  `sales_rep_id` sets the **Labor** side and the stored Parts side is kept as it is. **`parts_sales_rep_id` is
  honored only together with `split=true`**; to change the Parts side, send `split=true` with both ids (the
  card always does). Under `split=true`, a null `parts_sales_rep_id` means Parts = Unassigned. So "sent as
  null" and "not sent" never need telling apart. Only an explicit `split=false` un-splits (S2-R16, the remove x). This makes
  S2-N1 ("a side is never refilled on its own") hold for every caller, including a stale tab or a
  factory that predates the split. The FE still always sends `split` explicitly.
- A non-null `parts_sales_rep_id` without `split=true` (absent or `false`) returns 400 "The Parts sales
  representative can only be set on a split work order." This is a pure request-level check (it never needs
  the stored state), structural, and never reached from the UI.
- `split=true` on a part sale (type `parts`) returns 400 "A part sale has one sales representative." (S2-N2,
  structural).
- An invoiced or paid service WO returns 400 "The sales representative cannot be changed on an invoiced or paid
  work order." (D7, S2-E4). The part-sale message is unchanged: "…on an invoiced or paid part sale."
- A rep id that is not already held by this WO (on either side) must be an org staff with
  `is_sales_rep = 1`. (C2 says "only ids that CHANGE versus the stored value". This rule is that intent
  made safe: a strict per-side comparison would refuse "add Parts" while an inactive person holds
  Labor, because Parts goes from null to X. The "held on either side" test lets that copy through.) Otherwise the request returns 400 "The selected staff member is not a sales representative."
  (S1-N2). An id the WO already holds is accepted as-is, so an inactive holder can stay, move between
  sides, or be copied onto Parts when the field is added (S1-E2, S2-E1, S2-R6, S2-E2).
- One request is one save and writes at most one `work_order.sales_rep.changed` entry. An identical
  (labor, split, parts) tuple writes nothing and saves nothing (S7-R1, S7-R4).
- Response unchanged: `201 { "data": { "work_order_id": "…" } }`.

#### 0.2 WO detail (`WorkOrderDetails`, also inside every history/invoice snapshot blob)
Adds `sales_rep_split: bool`, `parts_sales_rep_id: uuid|null`, `parts_sales_rep_name: string|null`,
`parts_sales_rep_is_inactive: bool` beside the existing `sales_rep_*` (which now means the **Labor / one** side).
- **AMENDED (clarification):** when `sales_rep_split=false`, all `parts_sales_rep_*` fields are null/false
  and the FE treats the Parts side as following `sales_rep_*`. A split WO always carries its own Parts
  values, which can be null (Unassigned) or the same person as Labor (S2-R15).
- A part sale always has `sales_rep_split=false`.
- Names and inactive flags are now tenant-scoped on BOTH sides (D4). A rep id that does not resolve to a
  user of this organization reads `name=null`, `is_inactive=true`.

#### 0.3 Customer create `POST /api/customers/create` and change `POST /api/customers/change`
```json
"sales_representatives": [ { "side": "primary" | "service_parts" | "part_sales", "user_id": "uuid|null" } ]
```
- Ids are **user.id** (D12), the same id space as `/api/staff?is_sales_rep=1&is_active=1` today.
- When the list is sent, `primary` must be present (400 otherwise). Each side may appear at most once
  (400 otherwise). A row being present means that field is added; `user_id: null` means "Unassigned".
- **AMENDED:** on **change**, an absent `sales_representatives` (key not sent) leaves the reps
  unchanged. On **create**, an absent key creates `primary` = Unassigned.
- **AMENDED:** the legacy request fields `sales_rep_id`, `sales_rep_first_name`, `sales_rep_last_name`
  are removed from both commands. The payload resolver is non-strict, so a stale client's keys are
  ignored rather than rejected. Names are never client-supplied again (D5).
- Validation (D5): every non-null `user_id` must be a user of the caller's organization, always.
  A `user_id` the customer does not already hold on any side must also be an active user with a
  staff row flagged `is_sales_rep`. Both failures return 400 "The selected staff member is not a sales
  representative." On create, every id is new, so all of them must be eligible.

#### 0.4 Customer view `GET /api/customers/{id}` (ViewQueryHandler) and listing
```json
"sales_representatives": [ { "side": "primary", "user_id": "uuid|null", "first_name": "…|null",
  "last_name": "…|null", "is_active": bool, "is_sales_rep": bool } ]
```
Always in window order primary → service_parts → part_sales. `primary` is always present: the reader
synthesizes an unassigned one if the row is missing. `is_active` and `is_sales_rep` are informational: the FE does
not render them (D17 — no "(Inactive)" on customer fields); they are kept for QA and future use.
- **AMENDED (C5, chosen: DROP):** the legacy keys `sales_rep_id`, `sales_rep_first_name`, `sales_rep_last_name`
  are **removed** from the customer view and stripped from the customer listing (`c.*`). No FE consumer
  reads them from the listing (verified in app/). They are frozen after the
  migration and would otherwise show stale data.

#### 0.5 History log entry `work_order.sales_rep.changed` (camelCase on the wire, as today)
The existing `originalSalesRepId/Name` and `newSalesRepId/Name` now mean the **Labor (or one)** side.
APPENDED at the end of both DTOs, in this exact order (C4): `originalSalesRepSplit: bool|null`,
`newSalesRepSplit: bool|null`, `originalPartsSalesRepId`, `newPartsSalesRepId`, `originalPartsSalesRepName`,
`newPartsSalesRepName`.
`null` split (every entry before this release) reads as not split. Parts fields are null when that state
is unsplit.

#### 0.6 Sales By Representative (list, `/invoices` drill-down, `/export`)
- **AMENDED (C3): the param is `salesTypes`, a COMMA-SEPARATED string**, not `salesTypes[]`. That matches the
  report's existing `invoiceStatus` and `locations` shapes and the `ListValuesCap` handling. Accepted
  values are `all` (default, no narrowing), `none` (zero rows, S8-R5), or any subset of
  `labor,parts,part_sales`. An unknown token returns 400. It replaces `productType` on all three SBR
  endpoints. A stale `productType` is ignored.
- Invoice (Level-2 and Expanded-export) rows gain `sales_type`: `'labor' | 'parts' | 'part_sales' | 'labor,parts'`.
- Masking on invoice rows only (S5-R15/R15a). Rep summary rows and totals always carry real sums (S5-R16):
  - `labor`: `parts_invoiced`, `parts_margin` = null
  - `parts`: `inv_hrs`, `hours_worked`, `hours_invoiced`, `labor_invoiced`, `labor_margin`, `shop_supplies` = null
  - `part_sales`: `shop_supplies` = null when it is 0 ("a dash when it has none"). Every other field is numeric.
  - `labor,parts`: every field is numeric.
  - `adjustments`, `margin`, `subtotal` and `margin_pct` are never masked. `margin_pct` uses only the
    credited side (S5-R17) by construction.
- Rep rows keep their shape. `invoice_count` = COUNT(DISTINCT invoice) (S5-R13).
- Export: the Expanded CSV and PDF always carry a "Sales Type" column right after "Status", with values
  "Labor" / "Parts" / "Part Sales" / "Labor, Parts" (blank on rep and total rows). Masked cells are blank
  in the CSV and an em dash in the PDF (S5-R23). The filter line "Product Type: …" becomes
  "Sales Type: All" / "Sales Type: None" / "Sales Type: Labor, Parts" in option order (S8-R3, S8-R4).
  "None" is defensive only: the FE's "Empty export" guard stops a no-selection export before any request (S8-R4).

#### 0.7 Sales By Customer export
Param `productType` and its values are unchanged (S8-E1, S8-N1). The export filter caption
"Product Type" becomes **"Sales Type"**. The values become "All Sales" / "Part Sales only" /
"Service Sales only" / "No sales" (S8-R9). "No sales" is defensive only, for the same reason as §0.6.

#### 0.8 `GET /api/sales-reps`: the one picker for both surfaces (AMENDED, C1)
Each row becomes `{ "id": staff.id, "user_id": user.id, "name": "First Last" }`. The WO card binds `id`
and the customer dialog binds `user_id`. Org scoping, the active + `is_sales_rep` filter and the
first→last-name sort are unchanged, and the list stays unpaginated, so S4-R3's "every one of them" holds.
The guard widens from `ROLE_WORK_ORDER_VIEW` to an Expression: any of `ROLE_WORK_ORDER_VIEW`,
`ROLE_WORK_ORDER_CREATE_AND_EDIT` or `ROLE_CUSTOMER_CREATE_AND_EDIT`.
- **There is no separate part-sale create/edit permission constant.** Part-sale create is
  `#[IsGranted(IS_AUTHENTICATED)]` (`Application/PartSale/Create/CreateController.php:17`). A part
  sale's rep change goes through `change-sales-rep`, which requires `ROLE_WORK_ORDER_CREATE_AND_EDIT`,
  and that is already in the widened list.
- The customer dialog no longer calls `GET /api/staff` (`ROLE_USER_VIEW`; it would 403 for WO-only
  users opening New Customer from the WO window, and it pages 100 rows sorted by id).

#### 0.9 Unchanged
`GET /api/staff?...` (no longer used by the customer dialog),
`GET /api/staff/{id}/sales-rep-assignments` response shape (only its count logic changes),
`GET /api/reporting/export/sales_rep_assignments` route (a new "Side" column is added, S4-R23).

### Frontend dependency map (contract part → app/ files)

| Contract part | FE files |
|---|---|
| `POST work-orders/change-sales-rep` `{work_order_id, sales_rep_id, split, parts_sales_rep_id}` | `api/work-orders/WorkOrdersModel.ts` (`ChangeSalesRepPayload`), `api/work-orders/queries.ts` (`useChangeSalesRepMutation` doc), `components/ts/work-orders/sales-rep/useWorkOrderSalesReps.ts`; e2e `src/api/factories/work-order.factory.ts:721-726` (cross-area) |
| WO detail `sales_rep_split`, `parts_sales_rep_id`, `parts_sales_rep_name`, `parts_sales_rep_is_inactive` | `WorkOrdersModel.ts` (`WorkOrder`), `useWorkOrderSalesReps.ts`, `WorkOrderSalesRepFields.vue`, `print/buildPrintModel.ts` |
| Customer create/change `sales_representatives: [{side, user_id}]`; view response entries + `first_name,last_name,is_active,is_sales_rep`; removal of `sales_rep_id/_first_name/_last_name` | `api/companies/CompaniesModel.ts` (`CustomerCompanyView`, `CreateCompanyRequest`, `UpdateCompanyRequest`, `Customer`, `CreateCustomerRequest`), `components/ts/customers/CustomerModel.ts` (`CustomerFormData`, `Company`), `CustomerDialog.vue`, `CustomerSalesRepFields.vue`, `customerSalesReps.ts`, `CustomerLeftSection.vue`, `components/ts/shared/customer-info/CustomerInfoModel.ts:82-84` (delete the dead literal-null fields), `cypress/fixtures/customer_view.json` (MSW default for `/customers/view/:id`); e2e `customer.factory.ts:364-366` |
| History `work_order.sales_rep.changed` Parts + split fields | `WorkOrdersModel.ts` (history row type ~L2688), `AuditLogDialog.vue` |
| SBR `salesTypes` request; row `sales_type`; nullable uncredited side | `api/reporting/ReportingModel.ts` (params x4 incl. export, invoice-row type), `api/reporting/queries.ts:477-498`, SBR `Model.ts`, `SalesByRepresentativeReport.vue` |
| SBC unchanged | none (labels only) |

## 6. Implementation Phases

Nine stacked layers. Each is one reviewable PR into the `SV-10890` integration branch and must leave that branch green. **A frontend phase always lands after the backend phase it calls** — the build stays green either way, but the screen breaks at runtime if the endpoint is missing.

| Phase | Layer | Stories | Depends on |
|---|---|---|---|
| 1 | FE shared UI pieces + Sales By Customer relabel (+ BE SBC export labels) | 8 (SBC); building blocks for 2, 3, 8 | — |
| 2 | BE customer reps, picker, read-outs | 4 | — (stacks after Phase 1) |
| 3 | FE customer dialog + customer page | 4, 3 (S3-R5) | 1, 2 |
| 4 | BE work order split model, change endpoint, detail read, audit log | 1, 2, 6 (data), 7 | — (stacks after Phase 3) |
| 5 | FE work order card, print, audit log | 1, 2, 3, 6, 7 | 1, 4 |
| 6 | BE copy reps onto new / split / reopened documents | 4 (R24–R29), 2 (E5), 7 (R5) | 2, 4 |
| 7 | BE invoice per-side capture + customer fallback | 5 (R1/R2), 4 (R17/R18) | 2, 4 |
| 8 | BE Sales By Representative per side, Sales Type filter, exports | 5, 8 (SBR) | 7 |
| 9 | FE Sales By Representative | 5, 8 (SBR) | 1, 8 |

**How to read the detailed design.** Backend sub-sections keep their design numbers, which the text cross-references: §0.x = Section 5 (API contract); §3–§4 = Phase 2; §5 = Phase 4; §6 = Phase 6; §7 = Phase 7; §8 = Phase 8 (§8.3 = Phase 1); §10 = backend risks (Section 9); §12 = rollback (Section 8). Frontend design blocks keep their labels P0–P5: P0/P1 = Phase 1, P4 = Phase 3, P2/P3 = Phase 5, P5 = Phase 9. "D…" = Section 3 decisions; "P-…" = Section 3.1; "C1–C5" = contract amendments in Section 5; "Q…" = Section 0 open questions (Q-P2 = Q12, PRODUCT-Q2 = Q13, ENG-Q1/ENG-Q2 = answered by prod data in Section 1).

**Verification gates that apply to every phase** (root `AGENTS.md` → Definition of Done):
- BE static (scoped): `php tools/php-cs-fixer/vendor/bin/php-cs-fixer --config=.php-cs-fixer.php fix <changed files>`; `vendor/bin/phpstan clear-result-cache && vendor/bin/phpstan analyse --memory-limit=3G <changed FILES>`; `./vendor/bin/pest <changed + mirrored tests>` with a clean status line.
- FE static (scoped): `npx eslint --max-warnings=0 <changed files>`; `npx vitest run --maxWorkers=2 <changed specs>`; `npx vitest related --run --maxWorkers=2 <changed sources>`; `npx vue-tsc --noEmit`; `cd e2e && npx tsx scripts/e2e-precheck.ts --files=<changed .vue> --pretty` (missing test ids).
- Smoke after any BE phase: `bin/smoke-test.sh` (`--warmup` after a cache clear) — no 500s; plus `tail`/`docker compose logs` of the API with no fatals.
- Compile after any FE phase: FE port probe, then Vite up with no errors.
- Browser-walk after any user-visible phase: log in with `QUICK_LOGIN_USERS` from `api/.env.local` (`admin`, `tech`); watch the console.


---

### Phase 1: Shared UI pieces + Sales By Customer relabel
**Implements:** S8-R6, S8-R7, S8-R8, S8-R9, S8-R10, S8-N1, S8-E1; building blocks for S2-R1..R4, S2-R8..R9, S3-R2, S3-R4, S8-R3
**Depends on:** Nothing (starting point)

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Reports/Application/SalesByCustomer/Export/SalesByCustomerExportQueryHandler.php` | Modify | Export filter-line values → "All Sales" / "Part Sales only" / "Service Sales only" / "No sales" (S8-R9) |
| `api/src/Reporting/Reports/UI/HTTP/SalesByCustomer/SalesByCustomerExportController.php` | Modify | Filter-line caption "Product Type" → "Sales Type" |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/shared/icons/{Model.ts,lucideGlyphs.ts}` | Modify | Vendor Lucide `plus` and `x` |
| `app/src/components/ts/shared/IconActionButton.vue` | Create | 32px / 8px-radius icon button on `Button` (D9) |
| `app/src/components/ts/shared/sales-rep/{AddRepresentativeButton.vue,Model.ts}` | Create | The + with its `q-menu` |
| `app/src/components/ts/shared/filters/{Model.ts,FilterChip.vue}` | Modify | Opt-in `allSummaryLabel`, `summaryListsNames` |
| `app/src/css/app.scss` | Modify | Rep group hover/engaged rules + `@media (hover: none)` (D10) |
| `app/src/components/ts/work-orders/sales-rep/salesRepLabels.ts` | Create | "A (Parts) · B (Labor)" formatter for print + log |
| `app/src/components/ts/reporting/sales-by-customer/{Model.ts,SalesByCustomerReport.vue}` | Modify | Relabel only; key + values unchanged (S8-E1) |

#### Detailed design — frontend (P0 foundations, P1 SBC relabel)

#### P0. Foundations (no BE dependency; independently reviewable; ships unused primitives plus the chip opt-in)

##### Files
- MODIFY `src/components/ts/shared/icons/Model.ts`: add `'plus' | 'x'` to `LucideGlyphName` (keep alphabetical).
- MODIFY `src/components/ts/shared/icons/lucideGlyphs.ts`: `plus: ['M5 12h14', 'M12 5v14']`, `x: ['M18 6 6 18', 'm6 6 12 12']`
  (verbatim `lucide-static`; implementer re-verifies against the upstream SVGs).
- CREATE `src/components/ts/shared/IconActionButton.vue`: the D9 primitive. Built on `Button` (GR#8), no raw q-btn.
  ```vue
  <Button flat unelevated :filled="false" color="grey-7" padding="0" :ripple="false"
          :aria-label="ariaLabel" :disable="disable" :data-test-id="dataTestId"
          :class="['icon-action-btn', { 'icon-action-btn--active': active }]" @click="emit('click', $event)">
    <LucideIcon :name="icon" :size="20" />
    <q-tooltip v-if="tooltip && !active">{{ tooltip }}</q-tooltip>   <!-- S2-R3: no tooltip while the menu is open -->
    <slot />                                                         <!-- q-menu goes here -->
  </Button>
  ```
  Props (type-based `defineProps`, GR rules): `icon: LucideGlyphName`, `ariaLabel: string`, `tooltip?: string`, `active?: boolean`,
  `disable?: boolean`, `dataTestId: string`. Emits `['click']`. Scoped CSS:
  ```scss
  .icon-action-btn { width:32px; height:32px; min-width:32px; min-height:32px; border-radius:8px; }
  .icon-action-btn :deep(.q-focus-helper) { display:none; }               // replace Quasar's overlay with our fill
  .icon-action-btn:hover, .icon-action-btn--active { background: rgba(0,0,0,.06); }  // [design-verify] fill token
  body.body--dark .icon-action-btn:hover, body.body--dark .icon-action-btn--active { background: rgba(255,255,255,.08); }
  ```
  Read `docs/patterns/base-wrappers.md` (padding trap) first.
- CREATE `src/components/ts/shared/sales-rep/Model.ts`:
  `export interface AddRepresentativeOption { value: string; label: string; dataTestId: string }`.
- CREATE `src/components/ts/shared/sales-rep/AddRepresentativeButton.vue`: IconActionButton(`plus`, tooltip
  "Add representative", aria-label "Add representative") + `q-menu v-model="menuOpen" anchor="bottom left" self="top left"`
  (ColumnSelector precedent) with one `q-item clickable v-close-popup` per option (`:data-test-id="opt.dataTestId"`,
  `:disable="disable"`). Emits `add(value)` and `menu-toggle(open: boolean)` (the WO group needs it for S1-R4 "stays shown
  while the + menu is open"). `active = menuOpen` (S2-R2). Props `options: AddRepresentativeOption[]`, `disable?`,
  `dataTestId` (for the + button). Esc / outside click close with no change come from q-menu (S2-R4).
  The menu item fires the parent's latched action, so the parent's `useAsyncAction` is the re-entrancy guard; `:disable`
  is belt-and-braces (async-actions.md section 4).
- MODIFY `src/components/ts/shared/filters/Model.ts` (`FilterDef`): two OPT-IN fields, JSDoc'd:
  - `allSummaryLabel?: string`: replaces the `All <noun>` text (SBR "All", SBC "All Sales").
  - `summaryListsNames?: boolean`: a subset of more than one reads the selected option labels in OPTION order, joined
    `", "`, instead of `<n> <noun>`. Bounded option sets only (documented).
- MODIFY `src/components/ts/shared/filters/FilterChip.vue` `nounSummary` / `selectionSummary`:
  ```ts
  const allLabel = props.def.allSummaryLabel ?? `All ${noun}`;
  if (count === 0) return props.def.emptySummaryLabel && total > 0 ? props.def.emptySummaryLabel : allLabel;
  if (total > 0 && count === total) return allLabel;
  if (count === 1) { /* unchanged */ }
  if (props.def.summaryListsNames && total > 0)
    return resolvableOptions.value.filter((o) => props.modelValue.includes(o.value)).map((o) => o.label).join(', ');
  return `${count} ${noun}`;
  ```
  In `selectionSummary`, skip `truncate()` when `summaryListsNames` is set ("Labor, Part Sales" is 17 chars today, but a
  list must never cut a name). No def on any screen sets either field in P0, so every existing chip is byte-identical.
- MODIFY `src/css/app.scss` (next to `.hidden-select`, L68-137): the group-hover and touch rules, by EXTENDING the existing
  selector lists so the ring/fill values are not duplicated:
  ```scss
  // add to the existing hover rule's selector list:
  .sales-rep-group:hover .hidden-select .q-field__control,
  .sales-rep-group:focus-within .hidden-select .q-field__control,
  .sales-rep-group--engaged .hidden-select .q-field__control { /* existing bg + box-shadow */ }
  // add to the existing dropdown-icon reveal rule:
  .sales-rep-group:hover .hidden-select .q-select__dropdown-icon,
  .sales-rep-group:focus-within .hidden-select .q-select__dropdown-icon,
  .sales-rep-group--engaged .hidden-select .q-select__dropdown-icon { opacity:1; pointer-events:auto; }
  .sales-rep-group__action { opacity:0; pointer-events:none; transition:opacity .15s ease; }
  .sales-rep-group:hover .sales-rep-group__action,
  .sales-rep-group:focus-within .sales-rep-group__action,
  .sales-rep-group--engaged .sales-rep-group__action { opacity:1; pointer-events:auto; }
  @media (hover: none) {                       // D10: touch with no mouse pointer, not screen width
    .sales-rep-group__action { opacity:1; pointer-events:auto; }                       // S3-R2
    .sales-rep-group .hidden-select .q-select__dropdown-icon { opacity:1; pointer-events:auto; } // S3-R4 (confirmed by Product, PRD v8): rep fields only; Lead Tech / Service Advisor keep today's tap-to-reveal
  }
  ```
  Keyboard: tabbing onto a hidden action focuses it, which triggers `:focus-within` and reveals it (S1-R4 "keyboard focus").
- CREATE `src/components/ts/work-orders/sales-rep/salesRepLabels.ts` (pure; used by print and the audit log in P3, shipped here
  so P3 is render-only):
  ```ts
  export interface RepSideDisplay { name: string | null; inactive?: boolean }
  const SEPARATOR = ' · ';                       // U+00B7 with spaces (S6-R2/S7-R3)
  const sidePart = (side: RepSideDisplay, tag: 'Parts' | 'Labor'): string =>
    !side.name ? `Unassigned (${tag})` : side.inactive ? `${side.name} (${tag}, inactive)` : `${side.name} (${tag})`;
  /** "Devon Whitfield (Parts) · Elliot Brennan (Labor)"; Parts first (S6-R2, S7-R3). */
  export const formatTwoSidedReps = (parts: RepSideDisplay, labor: RepSideDisplay): string =>
    `${sidePart(parts, 'Parts')}${SEPARATOR}${sidePart(labor, 'Labor')}`;
  ```

##### Tests (P0)
- UPDATE `src/components/ts/shared/icons/tests/LucideIcon.spec.ts`: add `plus`, `x` to `GLYPH_NAMES`.
- CREATE `src/components/ts/shared/tests/IconActionButton.spec.ts`: renders the glyph at 20px; aria-label; tooltip text on
  hover; no tooltip while `active`; `--active` class; disabled blocks the click emit; test id.
- CREATE `src/components/ts/shared/sales-rep/tests/AddRepresentativeButton.spec.ts`: menu lists options in order with their
  test ids; picking emits `add(value)` and closes; `menu-toggle` true/false; tooltip suppressed while open; `disable` blocks.
- UPDATE `src/components/ts/shared/filters/tests/FilterChip.spec.ts`: `allSummaryLabel` (empty and full); `emptySummaryLabel`
  + `allSummaryLabel` together; `summaryListsNames` reads option order even when selected out of order; not truncated;
  **regression**: a def without the flags still reads `All <noun>` / `<n> <noun>`.
- CREATE `src/components/ts/work-orders/sales-rep/tests/salesRepLabels.spec.ts`: both named; inactive markers
  "(Parts, inactive)"/"(Labor, inactive)"; each side Unassigned; separator character.

---------------------------------------------------------------------------------------------------
#### P1. Sales By Customer relabel (Story 8, SBC; no BE dependency)

- MODIFY `src/components/ts/reporting/sales-by-customer/Model.ts`: `SBC_PRODUCT_TYPE_OPTIONS` labels -> `'Part Sales'`
  (value `parts`), `'Service Sales'` (value `service`). Values, order and `productTypes` key unchanged (S8-E1). Refresh the
  JSDoc wording ("Sales Type"). The `SbcProductTypeValue` and wire names stay (renaming them is churn with no user effect).
- MODIFY `src/components/ts/reporting/sales-by-customer/SalesByCustomerReport.vue` def (L697-708):
  `label: 'Sales Type'`, `selectAllLabel: 'All Sales'`, `summaryNoun: 'sales'`, `allSummaryLabel: 'All Sales'`,
  `emptySummaryLabel: 'No sales'` (S8-R8: "All Sales" / "Part Sales" / "No sales"). Comments that say Product Type -> Sales Type.
- Tests: UPDATE `sales-by-customer/tests/SalesByCustomerReport.spec.ts` (`describe('Product Type filter')` L379-470:
  "All products" -> "All Sales", "No products" -> "No sales", option labels; add a single-option "Part Sales" chip case;
  add an S8-E1 case: URL `productTypes=parts` restores with "Part Sales" selected). UPDATE `tests/Model.spec.ts` label asserts.
- E2E impact: `e2e/src/pages/reports/sales-by-customer.page.ts` label constants/texts (test id `filter_chip_productTypes` unchanged).


#### Detailed design — backend (SBC export labels)

##### 8.3 Sales By Customer labels (S8-R9; S8-N1/S8-E1: no predicate or param change)
- MODIFY `src/Reporting/Reports/Application/SalesByCustomer/Export/SalesByCustomerExportQueryHandler.php::productTypeLabel()`:
  All gives 'All Sales', Parts gives 'Part Sales only', Service gives 'Service Sales only', None gives 'No sales'.
- MODIFY `src/Reporting/Reports/UI/HTTP/SalesByCustomer/SalesByCustomerExportController.php::filterSegments()`:
  caption 'Sales Type'. Update the class docblock lines 36-47.
- MODIFY the SBC export tests (`tests/Functional/Reporting/Reports/...SalesByCustomer...Export*`). Find them
  with `grep -rl "Product Type" tests`.


#### Verification (Definition of Done gates):
- **Static (scoped):** FE eslint + vitest (`--maxWorkers=2`) + vue-tsc; BE cs-fix + phpstan + pest on the two SBC export files and their tests.
- **Smoke:** `bin/smoke-test.sh`; download an SBC CSV and PDF.
- **Compile:** Vite up, no errors.
- **Browser-walk (admin):** any report other than SBC (e.g. `/reports/parts-velocity`) — every chip text unchanged (opt-in proof). `/reports/sales-by-customer` — "Sales Type: All Sales"; untick one → "Sales Type: Part Sales"; none → "Sales Type: No sales", empty state, Export → "Empty export"; an old `?productTypes=parts` URL opens with Part Sales selected; CSV/PDF filter line reads "Sales Type: …".

#### E2E tests (e2e/):
- Reference updates (mandatory): `tests/ui/reporting/sales-by-customer.spec.ts` C30178 / C30174 chip regex → `/^All Sales$/`; C30161 and C30163 export metadata regexes → "Sales Type: …" ("Service Sales only" / "Part Sales only").
- New coverage: none (relabel only; covered by the updated cases).

---

### Phase 2: Customer reps — child table, aggregate, picker, read-outs (backend)
**Implements:** S4-R1..R3 (BE), S4-R7, S4-R9, S4-R11..R14, S4-R19 (data), S4-R20, S4-R21, S4-R22, S4-R23, S4-R30, S4-R31, S4-R32, S4-N2, S4-N3, S4-E1, S4-E2, S1-R8 (picker), NFR-002, NFR-003
**Depends on:** Nothing (stacks after Phase 1)

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version20261015100000.php` | New `company_sales_representative` table + one `primary` row per company (§3.1) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Customer/Customers/Domain/CompanySalesRepresentativeAssignment.php`, `CompanySalesRepresentativeSide.php`, `CompanySalesRepresentatives.php` | Create | Child entity, side enum, requested-set VO |
| `api/src/Customer/Customers/Domain/Company.php` + `Infrastructure/Doctrine/*.orm.xml` | Modify | Owned collection, intent methods, part-sale "following" rule |
| `api/src/Customer/Customers/Domain/SalesRepresentativeDirectory.php` + `Infrastructure/Persistence/Query/Dbal/DbalSalesRepresentativeDirectory.php` + `Application/Service/SalesRepresentativeAssignmentPolicy.php` | Create | D5 validation |
| `api/src/Customer/Customers/Application/{Create,Change,View,Listing}/*` | Modify | `sales_representatives` in/out; legacy fields removed |
| `api/src/Customer/Customers/Domain/ChangeSalesRepName.php` | Delete | Names read live (D6) |
| `api/src/Customer/Customers/Application/EventListener/ClearSalesRepAssignmentsOnUserDeactivatedSubscriber.php` | Modify | Per-field removal (S4-R20) — never rename |
| `api/src/Staff/Staff/Infrastructure/Doctrine/StaffRepository.php` | Modify | Warning count over the child table (S4-R21) |
| `api/src/Staff/Staff/Application/SalesReps/{ListingController,ListingQueryHandler}.php` | Modify | `user_id` per row; widened guard (D14 / C1) |
| `api/src/Organization/DataImport/Application/ContactsImport/ImportCommandHandler.php` | Modify | Stop blanking reps (S4-N3) |
| `api/src/Invoicing/Invoice/Application/Service/InvoiceSalesRepResolver.php` | Modify | Read the `primary` row (single-rep semantics until Phase 7) |
| `api/src/Reporting/Export/Application/SalesRepAssignmentsExport/*` | Modify | One row per customer per person + Side (S4-R23) |
| `api/src/VehicleService/WorkOrders/Domain/Service/Snapshot/WorkOrderSnapshotDataProvider.php` | Modify | `fetchCompany()` carries the list |

#### Frontend changes (`app/`):
None in this phase (the customer UI is Phase 3). ⚠️ The current customer dialog keeps posting the legacy fields, which the server now ignores, so customer rep edits from the UI are inert until Phase 3 lands on the integration branch. The customer **view** response also drops the legacy `sales_rep_*` keys (§0.4) that `CustomerLeftSection.vue` reads today, so between Phase 2 and Phase 3 every customer page reads "N/A" for its rep. Expected mid-stack; never merge Phase 2 to develop alone (D13), and say so in the Phase 2 PR description.

#### Detailed design — backend

#### 3. Phase P1: customer reps (child table + aggregate + writers + lifecycle)

##### 3.1 Migration `migrations/Version20261015100000.php` (hand-written; `isTransactional(): false`; guarded like Version20260729130000)
```sql
CREATE TABLE company_sales_representative (
  id BINARY(16) NOT NULL,
  company_id BINARY(16) NOT NULL,
  side VARCHAR(20) NOT NULL,
  user_id BINARY(16) DEFAULT NULL,
  INDEX csr__user_id_idx (user_id),
  UNIQUE INDEX csr__company_id_side_unq (company_id, side),
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

ALTER TABLE company_sales_representative
  ADD CONSTRAINT company_sales_representative__company_id_fk
  FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;

-- one statement, idempotent; P-6: only org-matching users are copied
INSERT INTO company_sales_representative (id, company_id, side, user_id)
SELECT UUID_TO_BIN(UUID()), c.id, 'primary', u.id
FROM company c
LEFT JOIN user u ON u.id = c.sales_rep_id AND u.organization_id = c.organization_id
WHERE NOT EXISTS (SELECT 1 FROM company_sales_representative x
                  WHERE x.company_id = c.id AND x.side = 'primary');
```
`down()`: `DROP TABLE company_sales_representative` (guarded).
- The FK comes from a Doctrine association (child to Company), so DBAL compares it by columns. Like
  `inspection_axle__inspection_id_fk` (Version20260923140000), it does **not** go in
  `MANUALLY_MANAGED_FOREIGN_KEYS`. The unique constraint (on `company_id, side`) is the FK's backing
  index, so declare it in the mapping.
- `company` gets no new column or index. The table is created empty and filled by one INSERT…SELECT
  over `company`, so no `company` row is locked for long. Measure `SELECT COUNT(*) FROM company` in prod
  first (expected 10^4–10^5). If it exceeds about 1M, batch the insert by `c.id` range.
- Verify: `bin/console doctrine:migrations:migrate` on MySQL, then
  `doctrine:schema:update --dump-sql` must print "Nothing to update".

##### 3.2 Domain: `src/Customer/Customers/Domain/` (module is flat: put new types beside `Company.php`)
- NEW `CompanySalesRepresentativeSide.php`: string-backed enum `Primary='primary'`,
  `ServiceParts='service_parts'`, `PartSales='part_sales'`, plus `windowOrder(): int`.
- NEW `CompanySalesRepresentativeAssignment.php`: entity (child of the Company aggregate). Fields:
  `Uuid $id`, `Company $company`, `CompanySalesRepresentativeSide $side`, `?Uuid $userId`.
  Package-level intent methods `assign(?Uuid $userId): bool` (by-VALUE compare, as in the SV-9681 trap
  documented in `CompanySalesRepresentative::change()`), `userId()`, `side()`. There are no public setters.
- NEW `CompanySalesRepresentatives.php`: immutable value object that validates a requested set.
  `fromList(list<array{side:string,user_id:?string}>)` throws a `DomainError` on a missing primary,
  a duplicate side or an unknown side. It also has `primaryOnly(?Uuid)`, `userIdFor(Side): ?Uuid`,
  `has(Side): bool` and `distinctUserIds(): list<Uuid>`.
- MODIFY `Company.php`:
  - New property `/** @var Collection<int, CompanySalesRepresentativeAssignment> */ private Collection $salesRepresentativeAssignments`.
    The constructor body initializes it with ONE `primary` row (userId null), which gives S4-R31 and S4-E1
    for every new customer.
  - `assignSalesRepresentatives(CompanySalesRepresentatives $requested): bool`. Rules:
    (1) **mutate the existing row of a side in place**, never remove and re-add the same side in one flush.
    Doctrine executes INSERTs before DELETEs, so a remove+add on one side violates `csr__company_id_side_unq`.
    (2) Add rows for newly added sides. (3) Remove rows for sides absent from `$requested`
    (orphan-removal). (4) Return whether anything changed.
  - `holdsSalesRepresentative(Uuid $userId): bool` (D5 "already held" test).
  - `salesRepresentativeUserId(Side): ?Uuid` and `hasSalesRepresentativeField(Side): bool`
    (a missing `primary` reads as Unassigned, for rows inserted by raw-SQL fixtures).
  - `isSalesRepresentativeSplit(): bool` = has(ServiceParts).
  - `serviceSalesRepresentativeUserIds(): array{labor: ?Uuid, parts: ?Uuid, split: bool}`.
    Labor = primary. Parts = split ? service_parts : primary (S4-R17, S4-R24, S4-R25).
  - `partSaleSalesRepresentativeUserId(): ?Uuid`. Returns part_sales if that field is added, even when it
    is null (explicit Unassigned, S4-R18 and S4-R26). Otherwise service_parts if added. Otherwise primary
    (the "following" rule, S4-R12 and S4-R13).
  - `removeSalesRepresentativeUser(Uuid $userId): bool` (S4-R20). On primary and service_parts it sets
    the user to null and keeps the field. A part_sales row holding that user is **removed**.
  - `/** @return list<CompanySalesRepresentativeAssignment> */ salesRepresentativeAssignments()` in window order.
  - `change()`: **drop** the `CompanySalesRepresentative $salesRepresentative` parameter and its assignment (S4-N3).
  - Mark `getSalesRepresentative()` and `unassignSalesRepresentative()` `@deprecated` (P-5).
  - Docblock note: this child is deliberately NOT an `AuditStampComponent`. A rep change does not move
    `company.updated_at`, which is correct because no Public API customer field changes. The PRD confirms
    the public API does not expose reps.
- NO CHANGE to `src/OpenApi/Staff/Application/Update/UpdateController.php` (D22): it already cascades a
  rename to the user (L121-129). ADD a regression test: rename a staff member via the public API, then GET a
  customer holding that rep → the new name (S4-R22). Do not add a second user write.
- DELETE `ChangeSalesRepName.php`. S4-R22 and D6 are satisfied by live joins, and this subscriber's
  `findOneBy` bug goes away with it. **Before deleting**, confirm `UserNameChanged` keeps a handler
  (`Staff\Staff\Domain\ChangeStaffMemberName`), because the domain bus has `allowNoHandlers=false`.
  Gate: `bin/console debug:messenger | grep -A3 UserNameChanged`.
- MODIFY `CompanyRepository.php` (Domain port): replace `findBySalesRepresentativeUserId` semantics.
  The signature stays the same, but it now matches any side.

##### 3.3 Domain port for D5 validation
- NEW `src/Customer/Customers/Domain/SalesRepresentativeDirectory.php` (interface):
  - `usersInOrganization(list<Uuid> $userIds): list<string>`: the ids that are users of the current org.
  - `eligibleSalesRepresentativeUserIds(list<Uuid> $userIds): list<string>`: the ids of active users
    that have a staff row with `is_sales_rep = 1` (EXISTS, so multiple staff rows per user cannot fan out).
- NEW `src/Customer/Customers/Infrastructure/Persistence/Query/Dbal/DbalSalesRepresentativeDirectory.php`:
  DBAL over `user` (+ EXISTS `staff`), with `OrganizationDecorator` on `u.organization_id` and a single
  `IN (:ids)` query. Wire it in `config/services.yaml` only if autowiring does not alias it.
  Check with `bin/console lint:container`.
- NEW `src/Customer/Customers/Application/Service/SalesRepresentativeAssignmentPolicy.php`:
  `assertAssignable(CompanySalesRepresentatives $requested, ?Company $current): void`. The rules:
  (1) every non-null id must be in `usersInOrganization`. (2) Every id not in
  `$current?->holdsSalesRepresentative()` must be in `eligibleSalesRepresentativeUserIds`.
  On failure it throws `DomainError('The selected staff member is not a sales representative.')`.
  One unowned id fails the whole request (database.md "collections").

##### 3.4 Infrastructure mapping
- NEW `src/Customer/Customers/Infrastructure/Doctrine/CompanySalesRepresentativeAssignment.orm.xml`:
  ```xml
  <entity name="App\Customer\Customers\Domain\CompanySalesRepresentativeAssignment" table="company_sales_representative">
    <id name="id" type="binary_uuid"/>
    <field name="side" type="string" length="20" enum-type="App\Customer\Customers\Domain\CompanySalesRepresentativeSide"/>
    <field name="userId" column="user_id" type="binary_uuid" nullable="true"/>
    <many-to-one field="company" target-entity="App\Customer\Customers\Domain\Company" inversed-by="salesRepresentativeAssignments">
      <join-column name="company_id" referenced-column-name="id" nullable="false" on-delete="CASCADE"/>
    </many-to-one>
    <indexes><index name="csr__user_id_idx" columns="user_id"/></indexes>
    <unique-constraints><unique-constraint name="csr__company_id_side_unq" columns="company_id,side"/></unique-constraints>
  </entity>
  ```
- MODIFY `Company.orm.xml`: add
  `<one-to-many field="salesRepresentativeAssignments" target-entity="…Assignment" mapped-by="company" orphan-removal="true"><cascade><cascade-persist/></cascade></one-to-many>`.
  Keep the legacy `salesRepresentative` embedded mapping (P-5).
- MODIFY `Infrastructure/Doctrine/CompanyRepository.php::findBySalesRepresentativeUserId()`: DQL
  `SELECT c FROM Company c JOIN c.salesRepresentativeAssignments a WHERE a.userId = :u AND c.organizationId.value = :org`
  (DISTINCT).

##### 3.5 Application (write paths)
- MODIFY `Application/Create/CreateCommand.php`: remove `salesRepId`, `salesRepFirstName` and `salesRepLastName`.
  Add `#[Assert\Type('array')] private readonly ?array $salesRepresentatives = null` (resolver maps
  `sales_representatives`). Add an `Assert\All` of `Collection{side: Choice(values), user_id: Uuid|null}`.
  Keep `getSalesRepresentative()` returning `new CompanySalesRepresentative()` (legacy, P-4). Add
  `getSalesRepresentatives(): CompanySalesRepresentatives`.
- MODIFY `Application/Create/CreateCommandHandler.php`: after `new Company(…)`, build `$requested` as
  `CompanySalesRepresentatives::fromList($list)` when `sales_representatives` was sent, else
  `CompanySalesRepresentatives::primaryOnly(null)` (§0.3's "absent key creates primary = Unassigned"); call
  `policy->assertAssignable($requested, null)`, then
  `$company->assignSalesRepresentatives($requested)` inside the existing transaction.
- MODIFY `Application/Change/ChangeCommand.php` / `ChangeCommandHandler.php`: same new parameter. If it is
  non-null, call `policy->assertAssignable($requested, $company)` and then `assignSalesRepresentatives()`.
  Delete the `getSalesRepresentative()->change(…)` call. Null leaves the reps untouched (§0.3).
- MODIFY `src/Organization/DataImport/Application/ContactsImport/ImportCommandHandler.php`: in
  `changeExistingCompany()`, drop `salesRepresentative:` from `$company->change(…)` (S4-N3). New companies
  get primary Unassigned from the constructor.
- `src/OpenApi/Customer/Application/Create/CreateController.php`, `src/OpenApi/Sandbox/Application/Seeder/CustomerSeeder.php`,
  `Domain/EventSubscriber/CreateCounterSaleCompanyOnOrganizationCreateSubscriber.php`,
  `Application/CLI/CreateCounterSaleCompanyForAllWorkplaces.php`: **no code change**. The constructor now
  adds the primary row. Each needs a test assertion (below), because cascade-persist must reach the row
  through every save path. The public API still exposes no rep (PRD "Out of scope").
- MODIFY `Application/EventListener/ClearSalesRepAssignmentsOnUserDeactivatedSubscriber.php`: loop
  `$company->removeSalesRepresentativeUser($userId)` (S4-R20). **Do not rename the class** (allowNoHandlers=false).
- MODIFY `src/Staff/Staff/Infrastructure/Doctrine/StaffRepository.php::countCompaniesWithSalesRepUserId()` (S4-R21):
  ```sql
  SELECT COUNT(DISTINCT csr.company_id)
  FROM company_sales_representative csr
  INNER JOIN company c ON c.id = csr.company_id
  WHERE csr.user_id = :userId AND c.organization_id = :organizationId
  ```
  Served by `csr__user_id_idx`. Update the docblock in `Staff/Staff/Domain/StaffRepository.php`.

##### 3.6 Application (read paths)
- MODIFY `Application/View/ViewQueryHandler.php`: drop the 3 legacy columns from the SELECT and the
  `$element['sales_rep_id']` conversion. Add a second query:
  ```sql
  SELECT csr.side, BIN_TO_UUID(csr.user_id) AS user_id, u.first_name, u.last_name,
         COALESCE(u.is_active, 0) AS is_active,
         CASE WHEN EXISTS (SELECT 1 FROM staff s WHERE s.user_id = u.id AND s.is_sales_rep = 1) THEN 1 ELSE 0 END AS is_sales_rep
  FROM company_sales_representative csr
  INNER JOIN company c ON c.id = csr.company_id
  LEFT JOIN user u ON u.id = csr.user_id AND u.organization_id = c.organization_id
  WHERE csr.company_id = :id                       -- + OrganizationDecorator on c.organization_id
  ```
  Sort it in PHP by `Side::windowOrder()`. Synthesize an Unassigned `primary` row if it is missing.
  Output it as `sales_representatives` (§0.4).
- MODIFY `Application/Listing/ListingQueryHandler.php`: `unset` `sales_rep_id`, `sales_rep_first_name`
  and `sales_rep_last_name` after the `c.*` fetch, next to `AuditStampColumns::strip` (§0.4 AMENDED).
- MODIFY `src/Invoicing/Invoice/Application/Service/InvoiceSalesRepResolver.php` (**required here**,
  because the legacy column stops being written in this phase). Step 2 reads
  `$company->salesRepresentativeUserId(Primary)` instead of `getSalesRepresentative()`. The "user has no
  staff row" branch now returns `(null, null)`, since no denormalized name exists anymore (§9 ENG-Q2).
  Single-rep semantics stay; P5 widens it.

##### 3.6b Picker (C1), in P1 because the customer dialog needs it
- MODIFY `src/Staff/Staff/Application/SalesReps/ListingQueryHandler.php`: select `s.user_id` as well and
  emit `'user_id' => Uuid::fromBytes($row['user_id'])->getValue()`.
- MODIFY `src/Staff/Staff/Application/SalesReps/ListingController.php`: replace
  `#[IsGranted(ROLE_WORK_ORDER_VIEW)]` with
  `#[IsGranted(new Expression('is_granted("ROLE_WORK_ORDER::VIEW") or is_granted("ROLE_WORK_ORDER::CREATE_AND_EDIT") or is_granted("ROLE_CUSTOMER::CREATE_AND_EDIT")'))]`,
  built from the `PermissionEnum` constants as in `Customer/Create/CreateController`.
- MODIFY `tests/Functional/Staff/Staff/ServiceAdvisors/StaffReferenceListingsAuthorizationTest.php` (it
  covers `/api/sales-reps`): add a user holding only `ROLE_CUSTOMER_CREATE_AND_EDIT` (200), one holding
  only `ROLE_WORK_ORDER_CREATE_AND_EDIT` (200), and one with none of the three (403). Assert `user_id`
  on each row, that the org scoping holds, and that the A–Z order holds.

##### 3.7 Tests (P1)
Unit (PHPUnit class style, `tests/Unit/...` mirroring `src`):
- NEW `tests/Unit/Customer/Customers/Domain/CompanySalesRepresentativesTest.php`: missing primary,
  duplicate side and unknown side all throw; `userIdFor` and `distinctUserIds`.
- NEW `tests/Unit/Customer/Customers/Domain/CompanySalesRepresentationTest.php`, against the Company
  aggregate:
  - The constructor creates one primary Unassigned row.
  - Assign primary only gives not split.
  - Adding service_parts makes it split (S4-R7).
  - Removing service_parts keeps primary and part_sales (S4-R11).
  - Part-sale following: part_sales absent → service_parts → primary (S4-R12, S4-R13, S4-R26).
  - An explicit part_sales Unassigned returns null and does not follow (S4-R14, S4-R18).
  - part_sales equal to service_parts stays independent when service_parts changes (S4-E2).
  - An in-place mutation keeps the same row object, so no remove+add happens.
  - A no-op assign returns false.
  - `removeSalesRepresentativeUser` nulls primary and service_parts, deletes part_sales, and leaves other
    users untouched (S4-R20).
  - `serviceSalesRepresentativeUserIds` for split and unsplit customers.
- NEW `tests/Unit/Customer/Customers/Application/Service/SalesRepresentativeAssignmentPolicyTest.php`:
  - A foreign-org id is refused, even when it is already held.
  - A new, ineligible id is refused.
  - An already-held, unflagged id is accepted (S4-N2).
  - One bad id in a list fails the whole list.
  - Create (`$current=null`) requires eligibility for every id.
- MODIFY `tests/Unit/Customer/Customers/Application/Change/ChangeCommandHandlerTest.php`,
  `ChangeCommandTest.php`, `Create/CreateCommandTest.php`, `CreateTest.php`, `CreateControllerTest.php`:
  remove the legacy fields and add the new list.
- MODIFY `tests/Unit/Customer/Customers/Application/EventListener/ClearSalesRepAssignmentsOnUserDeactivatedSubscriberTest.php`:
  cover per-field removal.
- MODIFY `tests/Unit/Organization/DataImport/ContactsImport/ImportCommandHandlerTest.php`: re-importing an
  existing customer with service_parts and part_sales leaves every field unchanged (S4-N3). This is a
  failing-first test, because today the import blanks the rep.
- MODIFY `tests/Unit/Invoicing/Invoice/Application/Service/InvoiceSalesRepResolverTest.php`: the company
  fallback reads the primary row.
- MODIFY `tests/Unit/Staff/Staff/Application/SalesRepAssignments/CountQueryHandlerTest.php` (if it asserts SQL).
- MODIFY `tests/Unit/Customer/Customers/Domain/CompanyValueGuardTest.php` only if it exercises `change()`.
Functional (`tests/Functional/...`, SQLite):
- NEW `tests/Functional/Customer/Customers/Change/CustomerSalesRepresentativesChangeTest.php`:
  - POST change with 3 fields, then GET view shows them in window order with live names (S4-R19).
  - Rename the user, then the view shows the new name on every customer holding them (S4-R22).
  - A foreign-org user id returns 400 and nothing is written.
  - A non-flagged new id returns 400.
  - An already-held unflagged id saves (S4-N2).
  - An absent key leaves the reps unchanged.
  - Removing part_sales deletes the row.
- NEW `tests/Functional/Customer/Customers/Create/CustomerCreateSalesRepresentativesTest.php`:
  - Create with the list.
  - Create without it gives primary Unassigned.
  - The WO-create-and-edit permission path (expression in `CreateController`) still works.
- NEW `tests/Functional/Customer/Customers/Domain/CounterSaleCompanyHasUnassignedPrimaryTest.php` (or extend
  an existing Counter Sale test): a new org's Counter Sale has one primary row with user null (S4-R31).
- MODIFY `tests/Functional/Customer/Customers/View/CustomerViewTest.php`: new key present, legacy keys gone.
- NEW `tests/Functional/Staff/Staff/SalesRepAssignmentsCountTest.php` (or extend `SalesRepPlumbingTest.php`):
  - A user in primary on A, service_parts on B and part_sales and primary on C counts 3 (S4-R21).
  - A user in another org counts 0.
- MODIFY `tests/Functional/Staff/Staff/SalesRepPlumbingTest.php` (it constructs Company and reads the legacy rep).
- MODIFY `tests/Functional/Customer/CompanyAuditStampWritePathTest.php`: assert that a rep-only change does
  NOT stamp `company.updated_at` (documents P-1 / P-4 behavior).
- OpenAPI: extend an existing `tests/Functional/OpenApi/...Customer...Create` test to assert that one primary
  row was persisted.

---------------------------------------------------------------------------------------------------
#### 4. Phase P2: customer read-outs (Assignments export, history snapshot)

##### 4.1 Assignments export (S4-R23)
- MODIFY `src/Reporting/Export/Application/SalesRepAssignmentsExport/SalesRepAssignmentsExportQueryHandler.php`.
  Keep the **user-first** join chain (see the class docblock: do not "simplify" it to staff.id).
  ```sql
  SELECT co.name AS customer_name, BIN_TO_UUID(csr.user_id) AS user_id, csr.side,
         TRIM(CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,''))) AS sales_rep_name,
         CASE WHEN u.is_active = 1 AND EXISTS (SELECT 1 FROM staff s WHERE s.user_id = u.id) THEN 1 ELSE 0 END AS rep_is_active,
         CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END AS customer_is_split
  FROM company co
  INNER JOIN company_sales_representative csr ON csr.company_id = co.id AND csr.user_id IS NOT NULL
  LEFT JOIN user u ON u.id = csr.user_id AND u.organization_id = co.organization_id
  LEFT JOIN company_sales_representative sp ON sp.company_id = co.id AND sp.side = 'service_parts'
  -- OrganizationDecorator on co.organization_id
  ORDER BY LOWER(co.name), LOWER(sales_rep_name), co.id, csr.user_id
  ```
  Then fold in PHP into **one row per (customer id, user id)**. Side labels go in window order, joined
  by ", ": primary reads "Parts and Service" when the customer is not split and "Service Labor" when it
  is; service_parts reads "Service Parts"; part_sales reads "Part Sales". Example output:
  "Parts and Service, Part Sales".
  - "Active?" keeps today's meaning (staff exists AND user active), now org-scoped through `u`.
    The EXISTS replaces the fan-out-prone `LEFT JOIN staff`.
  - Rows are keyed by user id rather than name, which answers the old "two people with the same name"
    question.
- MODIFY `SalesRepAssignmentsExportDetails/SalesRepAssignment.php`: append
  `#[SerializedName('Side')] public string $side` AFTER `repIsActive` (column order = property order).
- MODIFY `tests/Unit/Reporting/Export/Application/SalesRepAssignmentsExport/SalesRepAssignmentTest.php`,
  `tests/Functional/Reporting/Export/Application/SalesRepAssignmentsExport/SalesRepAssignmentsExportQueryHandlerTest.php`
  (assert every label combination plus "one person in two fields reads as one row") and `…ControllerTest.php` (header row).
- Extract the folding into a pure function so it is unit-testable:
  `SalesRepAssignmentSideLabel::for(list<Side>, bool $customerIsSplit): string` in the same Application folder,
  with a unit test.

##### 4.2 History snapshot `fetchCompany()`
- MODIFY `src/VehicleService/WorkOrders/Domain/Service/Snapshot/WorkOrderSnapshotDataProvider.php::fetchCompany()`:
  remove the 3 legacy columns. Add `sales_representatives` (same shape as §0.4, minus the flags) from a
  second, org-scoped query (no fan-out). Old blobs keep their legacy keys, and new blobs carry the list.
  Nothing on the read-only historical card reads the customer's reps (the WO card reads `workOrder.sales_rep_*`).
  This change only keeps the blob complete.
- MODIFY or NEW unit test for `fetchCompany` (if a provider test exists, extend it). Otherwise add a
  functional test in `tests/Functional/VehicleService/WorkOrders/Domain/Service/Snapshot/`.


#### Verification (Definition of Done gates):
- **Static (scoped):** cs-fix, phpstan (files), pest — see §3.7 and §4.
- **Migration gate:** `bin/console doctrine:migrations:migrate --no-interaction`, then `doctrine:migrations:diff --allow-empty-diff` → "No changes detected". `bin/console lint:container`. `bin/console debug:messenger` shows `UserNameChanged` (by `ChangeStaffMemberName`) and `UserDeactivatedEvent` still handled.
- **Smoke:** `bin/smoke-test.sh`; GET a customer view (new `sales_representatives`, no legacy keys), `GET /api/sales-reps` as a customers-only role (200, `user_id` present), the assignments export (Side column).
- **Browser-walk:** none (no UI change in this phase).

#### E2E tests (e2e/):
Reference updates that this phase breaks (fix in the same layer):
- `e2e/src/api/factories/customer.factory.ts` `create()` — sends the removed `salesRepId/FirstName/LastName`; the server ignores them, so customers are silently created with no rep. Add a `salesRepresentatives?: {side, userId}[]` param mapping to `sales_representatives`.
- `customer.factory.ts` `setPinnedNote()` — delete the three echoed legacy keys (do not send `sales_representatives` there).
- `e2e/src/api/factories/staff.factory.ts` `assignSalesRepToCustomer()` — send `sales_representatives: [{side:'primary', user_id}]` (or move to `CustomerFactory.setSalesRepresentatives()` + `getSalesRepresentatives()`).
- `tests/ui/export-reports.spec.ts` C30293 — seed through the new factory; header gains `Side`; assert "Parts and Service".
- `tests/ui/reporting/sales-by-representative-deactivation.spec.ts` C30256 / C30255 — seed through the new factory; read `sales_representatives.find(s => s.side === 'primary')?.user_id`.
- `tests/ui/part-sales/ps-tax-and-sales-rep-extended.spec.ts` C154617 (part a) — read the new keys.

---

### Phase 3: Customer dialog + customer page (frontend)
**Implements:** S4-R1..R16, S4-R19, S4-E1, S4-E2, S3-R5
**Depends on:** Phase 1 (shared buttons), Phase 2 (customer contract + picker)

#### Database changes:
None.

#### Backend changes (`api/`):
None.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/companies/CompaniesModel.ts`, `app/src/api/work-orders/WorkOrdersModel.ts` (`SalesRepOption.user_id`) | Modify | Contract types |
| `app/src/components/ts/customers/{CustomerModel.ts,customerSalesReps.ts}` | Modify / Create | Draft type + the whole Story 4 rule set as pure functions |
| `app/src/components/ts/customers/CustomerSalesRepFields.vue` | Create | Outlined fields, always-visible + / x, draft only |
| `app/src/components/ts/customers/CustomerDialog.vue` | Modify | Field in both windows; options from `/api/sales-reps` (user_id); payload `sales_representatives` |
| `app/src/components/ts/customers/CustomerLeftSection.vue` | Modify | Rows in window order, "Unassigned", test ids; the rep rows move **outside** the address `v-if` so they show on every customer (S4-R19) |
| `app/src/components/ts/shared/customer-info/CustomerInfoModel.ts`, `app/cypress/fixtures/customer_view.json` | Modify | Remove dead legacy fields; MSW default fixture |

#### Detailed design — frontend

#### P4. Customer: Edit Customer, New Customer, customer page (Story 4, S3-R5)

##### Types (GR#4)
- `src/api/companies/CompaniesModel.ts` (API contract):
  ```ts
  export type CustomerSalesRepSide = 'primary' | 'service_parts' | 'part_sales';
  export interface CustomerSalesRepresentativeInput { side: CustomerSalesRepSide; user_id: UUID | null }
  export interface CustomerSalesRepresentative extends CustomerSalesRepresentativeInput {
    first_name: string | null; last_name: string | null; is_active: boolean; is_sales_rep: boolean;
  }
  ```
  `CustomerCompanyView.sales_representatives: CustomerSalesRepresentative[]`; `CreateCompanyRequest` /
  `UpdateCompanyRequest`: `sales_representatives: CustomerSalesRepresentativeInput[]`; remove `sales_rep_id`,
  `sales_rep_first_name`, `sales_rep_last_name` from these and from `CreateCustomerRequest` (and `Customer` per C5).
  With C1: `SalesRepOption` in `WorkOrdersModel.ts` gains `user_id: UUID`.
- `src/components/ts/customers/CustomerModel.ts` (component-local draft):
  ```ts
  /** One customer rep field in the draft. `name` '' = Unassigned. */
  export interface CustomerRepDraftSide { userId: string | null; name: string }
  /** `null` = the field is not added. Draft until Save (S4-R16). */
  export interface CustomerSalesRepDraft {
    primary: CustomerRepDraftSide; serviceParts: CustomerRepDraftSide | null; partSales: CustomerRepDraftSide | null;
  }
  export interface CustomerRepOption { userId: string | null; name: string }   // null = "Unassigned"
  ```
  `CustomerFormData`: drop the three `sales_rep_*` fields, add `sales_reps: CustomerSalesRepDraft`. `Company`: drop the trio,
  add `sales_representatives?: CustomerSalesRepresentative[]`.

##### New files
- CREATE `src/components/ts/customers/customerSalesReps.ts` (pure, unit-tested; the whole Story 4 rule set):
  ```ts
  export const UNASSIGNED: CustomerRepDraftSide = { userId: null, name: '' };
  export const emptyRepDraft = (): CustomerSalesRepDraft => ({ primary: { ...UNASSIGNED }, serviceParts: null, partSales: null });
  /** S4-R26 / S4-R13: what a NEW part sale gets right now. */
  export const partSalesFollows = (d) => d.partSales ?? d.serviceParts ?? d.primary;
  export const addServiceParts = (d) => ({ ...d, serviceParts: { ...d.primary } });            // S4-R7
  export const addPartSales = (d) => ({ ...d, partSales: { ...partSalesFollows(d) } });        // S4-R8 (snapshot, then independent: S4-R14, S4-E2)
  export const removeServiceParts = (d) => ({ ...d, serviceParts: null });                     // S4-R11 (primary keeps the Service Labor person)
  export const removePartSales = (d) => ({ ...d, partSales: null });                           // S4-R12
  export const addableSides = (d): AddRepresentativeOption[] => [                              // S4-R6 order
    ...(d.serviceParts ? [] : [{ value: 'service_parts', label: 'Sales Representative - Service Parts', dataTestId: 'item_add_customer_sales_rep_service_parts' }]),
    ...(d.partSales ? [] : [{ value: 'part_sales', label: 'Sales Representative - Part Sales', dataTestId: 'item_add_customer_sales_rep_part_sales' }]),
  ];
  export const primaryLabel = (d) => d.serviceParts ? 'Sales Representative - Service Labor' : 'Sales Representative'; // S4-R7/R11
  export const repDraftFromApi = (entries: CustomerSalesRepresentative[] | undefined): CustomerSalesRepDraft => { /* by side; name = `${first} ${last}`.trim() */ };
  export const repDraftToRequest = (d): CustomerSalesRepresentativeInput[] => [
    { side: 'primary', user_id: d.primary.userId },
    ...(d.serviceParts ? [{ side: 'service_parts', user_id: d.serviceParts.userId }] : []),
    ...(d.partSales ? [{ side: 'part_sales', user_id: d.partSales.userId }] : []),
  ];
  /** Rows for the customer page (S4-R19), window order, "Unassigned" for empty. */
  export const customerRepRows = (d) => [...];   // [{ key:'primary'|'service_parts'|'part_sales', label, name, dataTestId }]
  ```
- CREATE `src/components/ts/customers/CustomerSalesRepFields.vue`: `v-model` of `CustomerSalesRepDraft` (GR#7:
  `modelValue` + `update:modelValue` only), prop `options: CustomerRepOption[]` (already including the "Unassigned" first
  entry), prop `loading?`. Template: one row per present field (S4-R9 order), each row = grid `[outlined Select][16px][32px]`:
  ```vue
  <Select :model-value="row.side.userId" :options="options" emit-value map-options option-value="userId" option-label="name"
          :display-value="row.side.name || 'Unassigned'" :label="row.label" dense class="q-pt-md"
          :data-test-id-suffix="row.testIdSuffix" @update:model-value="(id) => setSide(row.key, id)" />
  ```
  NO `use-input` (S4-R3/S1-R12), no in-field x (wrapper already hides it; `:clearable="false"` is NOT needed and would change
  backspace behaviour; leave default). First row action = `AddRepresentativeButton` while `addableSides` is non-empty
  (`data-test-id="button_add_customer_sales_rep"`), else empty cell; added rows = `IconActionButton icon="x"` with tooltip /
  aria-label "Remove Sales Representative - Service Parts" / "... - Part Sales" (S4-R10). Actions are ALWAYS visible (S4-R4;
  no `.sales-rep-group__action` class). `setSide` resolves `name` from the picked option (or keeps '' for Unassigned) and emits
  a NEW draft object. No focus or popup after add (S4-R15). No save, no mutation: draft only (S4-R16).

##### Modified files
- MODIFY `src/components/ts/customers/CustomerDialog.vue`:
  - Replace L129-146 with `<div class="col-12"><CustomerSalesRepFields v-model="company.sales_reps" :options="salesRepOptions" /></div>`
    with NO `v-if="editMode"` (S4-R1, both windows). Lazy-load it (GR#6 pattern used for every child here).
  - `createInitialFormData()` -> `sales_reps: emptyRepDraft()`; `setCompanyData()` -> `sales_reps: repDraftFromApi(props.selectedCompany.sales_representatives)`
    (and do not spread a stale `sales_representatives` into the draft).
  - `beforeShow()`: fetch the options in BOTH modes. With C1: `queryClient.fetchQuery(salesRepsQueryOptions())` mapped to
    `[{userId:null,name:'Unassigned'}, ...rows.map(r => ({ userId: r.user_id, name: r.name }))]` (S4-R3; server-sorted).
    Without C1: see the fallback in section 2. Remove `SALES_REP_FILTERS`, `salesRepDisplayValue`, `getSalesRep*`,
    `salesRepChanged` (and the `staffOptionsQueryOptions` import if unused).
  - `addCustomer()`: `basePayload.sales_representatives = repDraftToRequest(company.value.sales_reps)`; drop the three
    `sales_rep_*` keys. Same for create and update.
  - S4-R4 "buttons always visible in the window": the + and x sit inside the form body (scrolls with the fields); the
    window's Save/Cancel already live in BaseFormDialog's footer. [design-verify] if "buttons" means Save/Cancel: confirm the
    footer stays pinned when the rep rows grow the form on a short viewport.
  - Comment hygiene (GR#11): the long SV-9153 comment about `/api/staff` goes; replace with one line on why options come from
    `sales-reps` with `user_id`.
- MODIFY `src/components/ts/customers/CustomerLeftSection.vue` (L76-81): render `customerRepRows(repDraftFromApi(company.sales_representatives))`:
  ```vue
  <template v-for="row in repRows" :key="row.key">
    <div class="card-subtitle" :data-test-id="`label_${row.dataTestId}`">{{ row.label }}</div>
    <div class="q-mb-sm" :data-test-id="row.dataTestId">{{ row.name || 'Unassigned' }}</div>   <!-- S4-R19, "N/A" -> "Unassigned" -->
  </template>
  ```
  Test ids: `text_customer_sales_rep_primary`, `text_customer_sales_rep_service_parts`, `text_customer_sales_rep_part_sales`
  (+ `label_...`). Touch-it-add-it (GR#5): the edit icon Button L20-28 has no id: add `data-test-id-suffix="edit_customer"`.
  **Move the rep rows OUTSIDE the address `v-if`** (S4-R19, confirmed by Product in PRD v8): they render on every customer, address or not. Everything else in that block (Phone, Credit, Website, IBS) stays inside the address check, as today.
- MODIFY `src/components/ts/shared/customer-info/CustomerInfoModel.ts`: delete the dead `sales_rep_*: null` literals (L82-84).
- MODIFY `cypress/fixtures/customer_view.json` (MSW default for `/customers/view/:id`, GR "stubs are code"):
  replace the trio with `"sales_representatives": [{ "side":"primary","user_id":null,"first_name":null,"last_name":null,"is_active":true,"is_sales_rep":true }]`.
  Check `customers.json` only if C5 removes the listing fields.

##### data-test-ids (P4)
Kept: `select_customer_sales_rep` (first field; now via `data-test-id-suffix="customer_sales_rep"`, which ALSO changes its
options from the broken `option__<id>` to `option_customer_sales_rep_<userId|null>`). New:
`select_customer_sales_rep_service_parts`, `select_customer_sales_rep_part_sales`, `option_customer_sales_rep_service_parts_<id|null>`,
`option_customer_sales_rep_part_sales_<id|null>`, `button_add_customer_sales_rep`, `item_add_customer_sales_rep_service_parts`,
`item_add_customer_sales_rep_part_sales`, `button_remove_customer_sales_rep_service_parts`,
`button_remove_customer_sales_rep_part_sales`, `text_customer_sales_rep_{primary,service_parts,part_sales}`,
`label_customer_sales_rep_{...}`, `button_edit_customer`.

##### Tests (P4)
- CREATE `src/components/ts/customers/tests/customerSalesReps.spec.ts`: S4-R7 (copy, rename); S4-R8 follows Service Parts,
  else primary, else Unassigned; S4-R11 remove keeps primary and Part Sales; S4-R12 follow again; S4-R13 (no Part Sales:
  follows changes); S4-R14/S4-E2 (independent after add, even when equal); S4-R6 menu shrinks, empty when both added;
  `repDraftToRequest` presence rules; `repDraftFromApi` round-trip; `customerRepRows` labels/order/Unassigned.
- CREATE `src/components/ts/customers/tests/CustomerSalesRepFields.spec.ts`: Unassigned first option; no search input
  (`use-input` absent); + always visible; menu lists the remaining sides in order; x tooltips; emits a new draft (spy pattern);
  no popup after add.
- UPDATE `src/components/ts/customers/tests/CustomerDialog.spec.ts`: L181-200 "hides ... sales rep in create mode" now
  EXPECTS the rep field in create mode; L344-384 (asserts `/staff` + `filters[0][field]=is_sales_rep`) becomes the
  `sales-reps` read (or the fallback params); create + update payload assert `sales_representatives` and no `sales_rep_*`;
  draft is not saved until Save (no request on add/remove).
- UPDATE `src/components/ts/customers/tests/CustomerLeftSection.spec.ts`: "Unassigned" for empty; three rows with labels in
  order; Service Labor label when split.
- E2E impact (cross-area, via /e2e-after-change): `e2e/src/pages/dialogs/edit-customer.dialog.ts` (picker now has
  "Unassigned" first, no search box, present in New Customer); `tests/ui/customers/sales-rep-picker-options.spec.ts` (option
  list gains Unassigned); `src/api/factories/customer.factory.ts:364-366` (`sales_rep_*` -> `sales_representatives`);
  `src/pages/customers/customer.page.ts` (N/A -> Unassigned).


#### Verification (Definition of Done gates):
- **Static (scoped):** eslint, vitest (`--maxWorkers=2`), vue-tsc, e2e-precheck on the changed `.vue` files.
- **Compile:** Vite up, no errors.
- **Browser-walk (admin):** `/customers` → New Customer: rep field present, outlined, no search box, "Unassigned" first, + always visible; add Service Parts (first label → "Sales Representative - Service Labor", same person); add Part Sales (starts with the Service Parts person); remove each; Cancel → nothing saved; Save → the customer page lists the rows in window order with "Unassigned" for empty. Edit Customer round-trips. From a work order → New Work Order → add customer **as a user holding only 'Work Orders — Create & Edit'**: the dialog stays open (no Access Denied) and lists reps (D14). Phone emulation (touch): same dialog works (S3-R5).

#### E2E tests (e2e/):
- Reference updates: `e2e/src/pages/dialogs/edit-customer.dialog.ts` (comment only — `select_customer_sales_rep` is kept; add locators for the new ids); `tests/ui/customers/sales-rep-picker-options.spec.ts` C43575 docblock refresh (membership assertions still pass with "Unassigned" added).
- New: **N4** — New Customer from the work order window as a 'Work Orders — Create & Edit'-only role (edge). See Section 7.

---

### Phase 4: Work order split model, change endpoint, detail read, audit log (backend)
**Implements:** S1-R13, S1-N1 (server), S1-N2, S1-E2, S2-R6, S2-R12, S2-R15, S2-R16, S2-N1, S2-N2, S2-E1, S2-E2, S2-E3, S2-E4, S4-R32, S6 (data), S7-R1..R4, NFR-001 (work order), NFR-003
**Depends on:** Nothing functionally (stacks after Phase 3)

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version20261015100100.php` | `work_order` + `parts_sales_rep_id`, `sales_rep_split` (INSTANT) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Domain/WorkOrderSalesRepresentatives.php` | Create | Immutable split/single VO |
| `api/src/VehicleService/WorkOrders/Domain/WorkOrder.php` + `Infrastructure/Doctrine/WorkOrder.orm.xml` | Modify | New fields; `changeSalesRepresentatives()` with the D7 lock and the part-sale guard |
| `api/src/VehicleService/WorkOrders/UI/HTTP/ChangeSalesRep/{ChangeSalesRepController.php,DTO/ChangeSalesRepRequestDto.php}` | Create | Canonical layout; same route + name |
| `api/src/VehicleService/WorkOrders/Application/ChangeSalesRep/ChangeController.php` | Delete | Replaced by the UI/HTTP controller |
| `api/src/VehicleService/WorkOrders/Application/ChangeSalesRep/{ChangeCommand,ChangeCommandHandler}.php` | Modify | Full desired state; eligibility only for ids not already held (D15) |
| `api/src/VehicleService/WorkOrders/Application/DTO/{WorkOrderHistoryPayloadDto,WorkOrderHistoryDto}.php`, `Infrastructure/Persistence/History/WorkOrderHistoryResolver.php`, `Application/Service/WorkOrder/WorkOrderEventDispatcher.php`, `Application/Service/History/WorkOrderHistorySearch.php` | Modify | 🔴 APPEND-ONLY six history fields (C4) |
| `api/src/VehicleService/WorkOrders/Domain/Service/WorkOrderDetailsFetcher.php`, `Application/View/ViewDetails/WorkOrderDetails.php` | Modify | Org-scoped joins on both sides (D4); four new detail fields |

#### Frontend changes (`app/`):
None in this phase. The current card keeps working: its requests carry no `split`, which on an unsplit work order is today's single-rep write (D21). No work order can be split before Phase 5 ships the + button.

#### Detailed design — backend

#### 5. Phase P3: WO split model, change endpoint, detail read, audit log

##### 5.1 Migration `migrations/Version20261015100100.php` (non-transactional, guarded, appended ⇒ INSTANT)
```sql
ALTER TABLE work_order ADD parts_sales_rep_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;
ALTER TABLE work_order ADD sales_rep_split TINYINT(1) NOT NULL DEFAULT 0, ALGORITHM=INSTANT;
```
No index: nothing queries WOs by the Parts rep, and `work_order` already carries 23 indexes. No FK,
mirroring `sales_rep_id`. Down: drop both, guarded.

##### 5.2 Domain: `src/VehicleService/WorkOrders/Domain/` (flat module: beside `SalesRepId.php`)
- NEW `WorkOrderSalesRepresentatives.php`: an immutable VO. Factories: `single(?SalesRepId $rep)` and
  `split(?SalesRepId $labor, ?SalesRepId $parts)`. The constructor invariant is
  `!split ⇒ parts === null`.
  Methods: `laborRepId()`, `partsRepId()` (stored value), `partsSideRepId()` (effective: split ? parts : labor),
  `isSplit()`, `holds(string $staffId): bool`, `equals(self): bool` (by value), `hasAnyRep(): bool`
  (labor ≠ null || effective parts ≠ null, used by S4-R17), `withoutParts()` (S2-R16).
  🔴 Build ids with `SalesRepId::from($value)`, never `SalesRepId::create(null)`, because
  `NullableUuid::create(null)` mints a random UUID (see the comment in `Create/CreateCommandHandler`).
- MODIFY `WorkOrder.php`, following the `coreChargedFromQuote` precedent (plain properties with
  defaults, NOT constructor params, so the 28-param constructor with 6 src and 78 test call sites is untouched):
  ```php
  private ?Uuid $partsSalesRepId = null;   // binary_uuid
  private bool $salesRepSplit = false;

  public function getSalesRepresentatives(): WorkOrderSalesRepresentatives { /* compose */ }

  /** @return bool whether anything changed */
  public function changeSalesRepresentatives(WorkOrderSalesRepresentatives $new): bool
  {
      if ($this->status->isInvoicedOrPaid()) {
          throw new DomainError($this->isPartSaleType()
              ? 'The sales representative cannot be changed on an invoiced or paid part sale.'
              : 'The sales representative cannot be changed on an invoiced or paid work order.'); // D7
      }
      if ($this->isPartSaleType() && $new->isSplit()) {
          throw new DomainError('A part sale has one sales representative.');               // S2-N2
      }
      if ($this->getSalesRepresentatives()->equals($new)) { return false; }               // S7-R4
      $this->applySalesRepresentatives($new);
      return true;
  }

  /** S4-R24..R26 / S4-R29: creation-time copy; no status lock, no log (S7-R5). */
  public function startWithSalesRepresentatives(WorkOrderSalesRepresentatives $reps): void
  public function copySalesRepresentativesFrom(self $source): void   // part-sale target never split
  ```
  Remove `setSalesRep()`. Its only caller is ChangeSalesRep, so grep the tests and update them.
  Keep `getWorkOrderSalesRepId()` (the labor side) for existing readers.
- MODIFY `Infrastructure/Doctrine/WorkOrder.orm.xml`: append
  `<field name="partsSalesRepId" column="parts_sales_rep_id" type="binary_uuid" nullable="true"/>` and
  `<field name="salesRepSplit" column="sales_rep_split" type="boolean"><options><option name="default">0</option></options></field>`
  after `coreChargedFromQuote`, with a comment.

##### 5.3 Change endpoint (canonical layout, P-10)
- NEW `src/VehicleService/WorkOrders/UI/HTTP/ChangeSalesRep/DTO/ChangeSalesRepRequestDto.php` (`RequestPayload`):
  `#[NotBlank, Uuid] string $workOrderId`, `#[Uuid] ?string $salesRepId`, `?bool $split = null` (D21: `null` = keep the stored split state),
  `#[Uuid] ?string $partsSalesRepId = null`, plus an `#[IsTrue]` method `isPartsOnlyWhenSplit()`
  returning `null === $this->partsSalesRepId || true === $this->split` (§0.1; request-level only).
  Keep `work_order_id` as a plain string resolved in the handler: `WorkOrderRepository::findById` is the
  org-scoped lookup, and database.md warns that `#[MapEntity]` only scopes if the repo does.
- NEW `.../UI/HTTP/ChangeSalesRep/ChangeSalesRepController.php`: same `#[Route('/api/work-orders/change-sales-rep', 'work_order_change_sales_rep', methods: ['POST'])]`,
  `#[IsGranted(PermissionEnum::ROLE_WORK_ORDER_CREATE_AND_EDIT)]`, maps DTO → Command, `HttpStatus::Created`,
  and returns the same body as today.
- DELETE `src/VehicleService/WorkOrders/Application/ChangeSalesRep/ChangeController.php`.
- MODIFY `Application/ChangeSalesRep/ChangeCommand.php`: pure data `(string $workOrderId, ?string $laborSalesRepId, ?bool $split, ?string $partsSalesRepId)` — `?bool`, where `null` means "keep the stored split state" (D21).
- MODIFY `Application/ChangeSalesRep/ChangeCommandHandler.php`:
  ```php
  $workOrder = $this->workOrderRepository->findById(new Uuid($cmd->workOrderId))   // org-scoped
      ?? throw WorkOrderNotFound::forWorkOrderId(...);
  $before = $workOrder->getSalesRepresentatives();
  $labor  = SalesRepId::from($cmd->laborSalesRepId);
  $after  = match (true) {
      true  === $cmd->split => WorkOrderSalesRepresentatives::split($labor, SalesRepId::from($cmd->partsSalesRepId)),
      false === $cmd->split => WorkOrderSalesRepresentatives::single($labor),                  // S2-R16 (remove x)
      $before->isSplit()    => WorkOrderSalesRepresentatives::split($labor, $before->partsRepId()), // D21: keep Parts (S2-N1)
      default               => WorkOrderSalesRepresentatives::single($labor),                  // unsplit: today's write
  };

  // S1-N2 for NEW people only; already-held ids pass (S1-E2, S2-E1, S2-R6, S2-E2)
  $names = [];                                                   // staffId => full name, for the log
  foreach (array_unique(array_filter([$after->laborRepId()?->getValue(), $after->partsRepId()?->getValue()])) as $id) {
      $staff = $this->staffRepository->findByIdInOrganization(new Uuid($id));  // org-scoped
      if (!$before->holds($id) && (!$staff instanceof Staff || !$staff->isSalesRep())) {
          throw new DomainError('The selected staff member is not a sales representative.');
      }
      $names[$id] = $staff?->getFullName();
  }

  $this->transactional->begin();
  try {
      if ($workOrder->changeSalesRepresentatives($after)) {      // throws D7 / S2-N2; false on no-op
          $this->workOrderRepository->save($workOrder);
          $this->workOrderEventDispatcher->recordSalesRepChanged(
              $workOrder, $before, $after,
              $this->namesFor($before),  // org-scoped findByIdInOrganization, previous names
              $names,
          );
      }
      $this->transactional->commit();
  } catch (\Throwable $e) { $this->transactional->rollBack(); throw $e; }
  ```
  The invoiced/paid and part-sale-split checks happen in the aggregate before any write.
  **D21:** the `match` above is the whole rule: `split=null` keeps the stored split state and the stored
  Parts rep (`$before->partsRepId()`); a Parts id can only arrive with `split=true` (the DTO refuses it
  otherwise), so nothing is ambiguous.
  The "opened from its history" read-only state (S1-N1) has no server write path. The snapshot
  endpoints are GET-only, so nothing needs guarding.

##### 5.4 Audit log (S7-R1..R4)
- MODIFY `Application/DTO/WorkOrderHistoryPayloadDto.php`: 🔴 APPEND after `depositDate`, in this order (C4):
  `?bool $originalSalesRepSplit = null, ?bool $newSalesRepSplit = null, ?string $originalPartsSalesRepId = null,
   ?string $newPartsSalesRepId = null, ?string $originalPartsSalesRepName = null, ?string $newPartsSalesRepName = null`.
- MODIFY `Application/DTO/WorkOrderHistoryDto.php`: the same six fields, appended last.
- MODIFY `Infrastructure/Persistence/History/WorkOrderHistoryResolver.php::hydrateData()`: append the six
  `$payload[...] ?? null` reads (bool cast for the split flags) as the LAST positional args.
- MODIFY `Application/Service/WorkOrder/WorkOrderEventDispatcher.php`: change the `recordSalesRepChanged`
  signature to `(WorkOrder, WorkOrderSalesRepresentatives $before, WorkOrderSalesRepresentatives $after, array $beforeNames, array $afterNames)`.
  Add the six params to `createPayload()` at its END and pass them by name.
- MODIFY `Application/Service/History/WorkOrderHistorySearch.php`: add `originalPartsSalesRepName` and
  `newPartsSalesRepName` to the searchable fields.
- The FE renders "Devon Whitfield (Parts) · Elliot Brennan (Labor)" from these fields (S7-R2/R3).

##### 5.5 Detail read (D4 + new fields)
- MODIFY `Domain/Service/WorkOrderDetailsFetcher.php`:
  - Re-scope the existing pair so it mirrors the advisor pair: `->leftJoin('sr', User::TABLE_NAME, 'sru', 'sru.id = sr.user_id AND sru.organization_id = wo.organization_id')`.
    Key the name on `sru.id IS NOT NULL` and the inactive flag on `sr.id IS NULL OR sru.id IS NULL OR sr.is_sales_rep = 0 OR sru.is_active = 0`.
  - Add the second pair `psr`/`psru` on `wo.parts_sales_rep_id`, with the same scoping.
  - Add to the SELECT: `wo.sales_rep_split`, `CASE WHEN wo.sales_rep_split = 1 THEN wo.parts_sales_rep_id END AS parts_sales_rep_id`,
    the parts name/inactive CASE expressions, each guarded by `wo.sales_rep_split = 1`.
  - Update the comment at :494-496 (the "follow-up" is now done).
- MODIFY `Application/View/ViewDetails/WorkOrderDetails.php`: add `public bool $salesRepSplit = false`,
  `public ?string $partsSalesRepId = null`, `public ?string $partsSalesRepName = null`,
  `public bool $partsSalesRepIsInactive = false`, with setters mirroring the salesRep trio
  (`fromBytes`, `bool|int|string` coercion). Old snapshot blobs lack these keys and get the defaults.

##### 5.6 Tests (P3)
Unit:
- NEW `tests/Unit/VehicleService/WorkOrders/Domain/WorkOrderSalesRepresentativesTest.php`:
  - The invariant holds.
  - `partsSideRepId` follows labor when unsplit.
  - `equals` compares by value.
  - `holds` covers both sides.
  - `hasAnyRep` covers split, unsplit and empty.
  - Building from a null id never mints a random UUID.
- NEW `tests/Unit/VehicleService/WorkOrders/Domain/WorkOrderChangeSalesRepresentativesTest.php`:
  - An invoiced or paid service WO gives the new D7 message, and a part sale keeps its message.
  - A split part sale is refused.
  - A no-op returns false.
  - Add Parts copies the person (S2-R6).
  - Removing Parts keeps Labor (S2-R16, S2-E2, S2-E3).
  - `copySalesRepresentativesFrom` copies the split state too.
- MODIFY `tests/Unit/VehicleService/WorkOrders/Application/ChangeSalesRep/ChangeCommandHandlerTest.php`:
  - A new unflagged id gives the S1-N2 message.
  - An already-held inactive id passes (S1-E2, S2-E1), including when copied to Parts (S2-R6).
  - Changing one side keeps the other (S2-R12).
  - Adding or removing Parts writes one entry with the split flags (S7-R1).
  - An identical tuple writes no entry and does not save (S7-R4).
  - A foreign-org staff id is refused.
  - The previous names are org-scoped.
- MODIFY `tests/Unit/VehicleService/WorkOrders/Application/Service/WorkOrder/WorkOrderEventDispatcherTest.php`.
- MODIFY `tests/Unit/VehicleService/WorkOrders/Infrastructure/Persistence/History/WorkOrderHistoryResolverTest.php`:
  - An old payload without the new keys hydrates with null split.
  - A new payload round-trips.
  - **Positional-order regression:** the deposit fields still land in the deposit slots.
- MODIFY `tests/Unit/VehicleService/WorkOrders/Application/View/ViewDetails/WorkOrderDetailsTest.php`.
Functional:
- MODIFY `tests/Functional/VehicleService/WorkOrders/ChangeSalesRep/ChangeSalesRepCrossOrgTest.php`:
  - A foreign-org staff id is refused on either side.
  - A foreign-org WO id returns 404.
  - D21, unsplit WO: `{work_order_id, sales_rep_id}` (no `split`) is today's single-rep write → 201. The
    part-sale path and the E2E factory payload keep working.
  - D21, **split** WO: `{work_order_id, sales_rep_id}` (no `split`) changes Labor only; Parts and the split
    flag survive; exactly one log entry (S2-N1, S2-R12).
  - A non-null `parts_sales_rep_id` with `split` absent or `false` returns 400 (request-level).
  - `split=true` with `parts_sales_rep_id: null` sets Parts to Unassigned and keeps the split (S2-N1).
  - `split=true` on a part sale returns 400.
  - An invoiced service WO returns 400 with the D7 message.
  - A POST then GET of the detail shows the four new fields (S2-R15, including both sides holding the same person).
  - The permission gate: no `ROLE_WORK_ORDER_CREATE_AND_EDIT` gives 403.
- NEW `tests/Functional/VehicleService/WorkOrders/Domain/Service/WorkOrderDetailsSalesRepScopingTest.php`
  (model it on `WorkOrderDetailsServiceAdvisorLabelTest.php`): a WO whose `sales_rep_id` or
  `parts_sales_rep_id` points at another org's staff reads `name=null`, `is_inactive=true` (D4).


#### Verification (Definition of Done gates):
- **Static (scoped):** cs-fix, phpstan, pest — see §5.6.
- **Migration gate:** migrate, then `doctrine:migrations:diff --allow-empty-diff` → no changes. `bin/console debug:router | grep change-sales-rep` → exactly one route, served by the new controller.
- **Smoke:** `bin/smoke-test.sh`; GET a work order detail (four new fields) and a part sale detail; POST change-sales-rep with and without `split`; confirm a part sale's rep change, lock message and log entry are unchanged.
- **Browser-walk (admin):** the existing (pre-Phase 5) card still changes the rep on a work order and a part sale; the Audit Log shows "Sales representative changed".

#### E2E tests (e2e/):
- No reference breakage: `work-order.factory.ts` `setSalesRep` keeps working because `split` is optional.
- Factory addition for Phase 5/9 coverage: `WorkOrderFactory.setSalesReps(woId, {laborId, partsId, split})`.

---

### Phase 5: Work order card, print, audit log (frontend)
**Implements:** S1-R1..R15 (incl. S1-R6, verify-and-fix — see Section 0), S1-N1, S1-N2 (shows the server message), S1-N3, S1-E1, S1-E2, S2-R1..R12, S2-R14..R17, S2-N2, S2-E1, S2-E2, S2-E4 (read-only), S3-R1..R4, S3-R6, S6-R1..R4, S6-N1, S7-R2, S7-R3
**Depends on:** Phase 1, Phase 4

#### Database changes:
None.

#### Backend changes (`api/`):
None.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/sales-rep/{Model.ts,useWorkOrderSalesReps.ts}` | Create | State machine: no pre-save cache write, `useAsyncAction` latch, rollback by dropping the overlay |
| `app/src/components/ts/work-orders/sales-rep/WorkOrderSalesRepFields.vue` | Create | One field that grows; group hover; + / x; read-only branch. **Adds `:data-saving="isSaving"` and `aria-busy` on `group_sales_rep`** — the E2E-observable save signal (test-curator blocker) |
| `app/src/components/shared/OrderStatusCard.vue` | Modify | Both rep blocks (work order + part sale) use the new component; part sale with the + off (D18); label "Sales Representative" |
| `app/src/api/work-orders/{WorkOrdersModel.ts,queries.ts}` | Modify | Detail fields, payload, history fields |
| `app/src/components/ts/work-orders/print/buildPrintModel.ts` | Modify | Two-sided row (S6) |
| `app/src/components/work-orders/history/AuditLogDialog.vue` | Modify | Two-sided entry (S7-R2/R3) |

#### Detailed design — frontend

#### P2. Work order card: one field that grows (Stories 1, 2, 3)

##### Types (GR#4)
- `src/api/work-orders/WorkOrdersModel.ts` (API contract):
  - `WorkOrder`: `sales_rep_split?: boolean; parts_sales_rep_id?: string | null; parts_sales_rep_name?: string | null;
    parts_sales_rep_is_inactive?: boolean;` (optional, same reason as the existing trio: partial shapes and old history snapshots).
  - `ChangeSalesRepPayload`: `{ work_order_id: UUID; sales_rep_id: UUID | null; split: boolean; parts_sales_rep_id: UUID | null }` + doc.
- CREATE `src/components/ts/work-orders/sales-rep/Model.ts` (component-local):
  ```ts
  export type WorkOrderRepSide = 'single' | 'labor' | 'parts';
  /** The rep assignment as the card reasons about it. Unsplit => partsId === laborId. */
  export interface WorkOrderRepState { split: boolean; laborId: string | null; partsId: string | null }
  /** `id: null` = the synthetic "Unassigned" first option. Moved out of OrderStatusCard (was a local interface). */
  export interface SalesRepSelectOption { id: string | null; name: string }
  export interface WorkOrderRepFieldView {
    side: WorkOrderRepSide; label: string; testIdSuffix: string; modelId: string | null; displayLabel: string; removable: boolean;
  }
  ```

##### New files
- CREATE `src/components/ts/work-orders/sales-rep/useWorkOrderSalesReps.ts`: the state machine. It does NOT touch the Vuex /
  TanStack cache optimistically; it holds a local overlay, so a rejected or ignored pick can never strand a value.
  ```ts
  export function useWorkOrderSalesReps(opts: {
    workOrder: Ref<WorkOrder | null>; options: Ref<SalesRepSelectOption[]>;
    refetchAfterSave?: () => Promise<unknown>;            // part sale: its workOrder is a local ref outside the cache
  }) {
    const store = storeInstance(); const mutation = useChangeSalesRepMutation();
    const server = computed<WorkOrderRepState>(() => {
      const wo = opts.workOrder.value; const laborId = wo?.sales_rep_id ?? null;
      const split = wo?.sales_rep_split === true;                     // absent (old snapshot) = not split
      return { split, laborId, partsId: split ? (wo?.parts_sales_rep_id ?? null) : laborId };
    });
    const optimistic = ref<WorkOrderRepState | null>(null);
    const shown = computed(() => optimistic.value ?? server.value);

    const save = async (next: WorkOrderRepState): Promise<void> => {
      const id = opts.workOrder.value?.id; if (!id) return;
      optimistic.value = next;
      store.commit('workorders/UPDATE_LOADING', { which: 'workOrder', value: true });   // preserved bracket
      try {
        await mutation.mutateAsync({ work_order_id: id, sales_rep_id: next.laborId, split: next.split,
                                     parts_sales_rep_id: next.split ? next.partsId : null });
      } catch { /* interceptor toasted the server message (S1-N3); rollback = dropping the overlay below */ }
      finally {
        await queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });  // SV-9936: detail(id) only, awaited
        if (opts.refetchAfterSave) { try { await opts.refetchAfterSave(); } catch { /* provider toasted */ } }
        optimistic.value = null;                 // after the refetch: shows what was SAVED (S1-E1) or the last saved value (S1-N3)
        store.commit('workorders/UPDATE_LOADING', { which: 'workOrder', value: false });
      }
    };
    const { run, isPending: isSaving } = useAsyncAction(save);         // synchronous latch (async-actions.md)

    const same = (a: WorkOrderRepState, b: WorkOrderRepState) =>
      a.split === b.split && a.laborId === b.laborId && a.partsId === b.partsId;
    const commit = (next: WorkOrderRepState) => {
      if (isSaving.value || same(next, shown.value)) return;            // S1-E1 truly ignored; S7-R4 no-op writes nothing
      void run(next);
    };
    const pick = (side: WorkOrderRepSide, id: string | null) => {
      const s = shown.value;
      if (side === 'single') commit({ split: false, laborId: id, partsId: id });       // S1-R13
      else if (side === 'labor') commit({ ...s, laborId: id });                         // S2-R12
      else commit({ ...s, partsId: id });
    };
    const addParts = () => { if (!shown.value.split) commit({ split: true, laborId: shown.value.laborId, partsId: shown.value.laborId }); }; // S2-R6
    const removeParts = () => { if (shown.value.split) commit({ split: false, laborId: shown.value.laborId, partsId: shown.value.laborId }); }; // S2-R16
    // labels: see below
    return { shown, isSaving, pick, addParts, removeParts, fields /* WorkOrderRepFieldView[] */ };
  }
  ```
  Label per side (generalises today's `salesRepLabel`, L589-603):
  ```ts
  const snapshot = (side) => side === 'parts' && server.value.split
    ? { id: wo.parts_sales_rep_id ?? null, name: wo.parts_sales_rep_name, inactive: wo.parts_sales_rep_is_inactive }
    : { id: wo.sales_rep_id ?? null, name: wo.sales_rep_name, inactive: wo.sales_rep_is_inactive };  // an unsplit Parts side mirrors Labor
  const labelFor = (side, id) => {
    const snap = snapshot(side);
    if (id && id === snap.id && snap.inactive && snap.name) return `${snap.name} (Inactive)`;  // S1-E2, S2-E1/E2
    if (!id) return 'Unassigned';                                                              // S1-R7
    return opts.options.value.find((o) => o.id === id)?.name ?? (id === snap.id ? snap.name ?? '' : '');
  };
  ```
  `fields` = unsplit: `[{side:'single', label:'Sales Representative', testIdSuffix:'sales_rep', removable:false}]`;
  split: `[{side:'labor', label:'Sales Representative - Labor', testIdSuffix:'sales_rep_labor'},
           {side:'parts', label:'Sales Representative - Parts', testIdSuffix:'sales_rep_parts', removable:true}]` (S2-R5 order).
- CREATE `src/components/ts/work-orders/sales-rep/WorkOrderSalesRepFields.vue`.
  Props: `workOrder: WorkOrder | null`, `options: SalesRepSelectOption[]`, `editable: boolean`, `allowSplit: boolean`,
  `refetchAfterSave?: () => Promise<unknown>`. No emits (it owns the save).
  ```vue
  <div :class="['sales-rep-group', { 'sales-rep-group--engaged': engaged, 'sales-rep-group--split': shown.split }]"
       data-test-id="group_sales_rep">
    <div v-for="field in fields" :key="field.side" class="sales-rep-row">
      <template v-if="editable">
        <Select hidden :model-value="field.modelId" :options="options" emit-value map-options
                :display-value="field.displayLabel" option-value="id" option-label="name" dense
                :label="field.label" :data-test-id-suffix="field.testIdSuffix"
                @update:model-value="(id) => pick(field.side, id)"
                @popup-show="onPopup(true)" @popup-hide="onPopup(false)" />
        <div class="sales-rep-row__action sales-rep-group__action">
          <AddRepresentativeButton v-if="field.side === 'single' && allowSplit"
            :options="[{ value: 'parts', label: 'Sales Representative - Parts', dataTestId: 'item_add_sales_rep_parts' }]"
            :disable="isSaving" data-test-id="button_add_sales_rep"
            @add="addParts" @menu-toggle="onPopup" />
          <IconActionButton v-else-if="field.removable" icon="x" aria-label="Remove Sales Representative - Parts"
            tooltip="Remove Sales Representative - Parts" :disable="isSaving"
            data-test-id="button_remove_sales_rep_parts" @click="removeParts" />
        </div>
      </template>
      <div v-else class="static-field">                                  <!-- S1-N1, S2-R17 -->
        <label class="static-field__label">{{ field.label }}</label>
        <div class="static-field__value" :data-test-id="`${field.testIdSuffix}_readonly`">{{ field.displayLabel }}</div>
      </div>
    </div>
  </div>
  ```
  - `engaged` = a counter of open popups (each Select dropdown + the + menu), so S1-R4 holds while any is open; hover and
    `:focus-within` are CSS-only (P0 rules).
  - The `v-model` is NOT a two-way computed any more: the Select is controlled (`:model-value` = shown). A pick during a save
    is dropped by `commit()` and q-select re-renders the unchanged prop, so nothing flashes (S1-E1, decision "v-model setter
    must become in-flight-aware").
  - `:disable="isSaving"` on + and x (S1-E1); the guard itself is the `useAsyncAction` latch inside `run`, reached
    synchronously from the click / menu item (FE checklist 6). The menu item is also `:disable`d.
  - The Labor field renders an EMPTY `.sales-rep-row__action` cell (S2-R10: no button, column kept so both boxes end at the
    same x). Unsplit + `allowSplit=false` (part sale, S2-N2) renders no action column at all, so the part-sale card is
    visually unchanged (S2-N2 context note).
  - Neither Select is focused or opened after add (S2-R7): no `focus()`/`showPopup()` call anywhere.
  - Scoped CSS (geometry):
    ```scss
    .sales-rep-group { display:flex; flex-direction:column; row-gap:16px; }           // S1-R6 inside the group
    .sales-rep-row { display:grid; grid-template-columns:minmax(0,1fr) 32px; column-gap:16px; align-items:center; } // S1-R5
    .sales-rep-group:not(.sales-rep-group--splittable) .sales-rep-row { grid-template-columns:minmax(0,1fr); }     // part sale
    .sales-rep-row :deep(.hidden-select .q-field__control) { margin-right:0; }        // box ends at the gap, not -20px [design-verify]
    .sales-rep-row :deep(.static-field) { margin-bottom:0; min-height:42px; }         // S1-R4 (confirmed by Product, PRD v8): match Lead Technician and Service Advisor exactly = 42px
    // S1-R11: split => arrow bottom-right on the name line; frees the label line for the long label (S2-R14)
    .sales-rep-group--split :deep(.hidden-select) {
      .q-field__append { position:absolute; right:4px; bottom:2px; height:auto; }      // [design-verify] offsets
      .q-field__native { padding-right:24px; }                                         // name never runs under the arrow
      .q-field__label { max-width:100%; }
    }
    ```
    (`--splittable` = `allowSplit && editable`; name it as you like.) S2-R14 check: at 100% and 200% zoom in the browser walk,
    neither long label truncates; if Quasar still ellipsizes, allow the floated label to use the append width (above) before
    considering wrapping.

##### Modified files
- MODIFY `src/components/shared/OrderStatusCard.vue`:
  - Replace BOTH rep blocks (L101-123 part sale, L213-242 WO) with `<WorkOrderSalesRepFields>` inside the existing
    `.assignee-field` wrappers (keeps the 16px rhythm with Lead Technician / Service Advisor, S1-R1/R6):
    - WO: `v-if` unchanged (cardType workOrder + WO view/edit); `:editable="canEditSalesRep && !!lines?.collection"`,
      `:allow-split="true"`.
    - Part sale: `v-if="showPartSaleSalesRep"`, `:editable="canEditPartSaleSalesRep"`, `:allow-split="false"` (S2-N2: gated on
      cardType, never data), `:refetch-after-save="fetchWorkOrder"`.
    - Imported card: no rep field today; unchanged.
  - DELETE `SalesRepSelectOption` local interface (moved), `WOSalesRep`, `salesRepLabel`, `changeSalesRepId`,
    `changeSalesRepMutation`, and the `'sales_rep_id'` `setWorkOrderField` path. KEEP `loadSalesReps` + the part-sale
    watch (403 nuance) and pass `salesRepOptions` down.
  - Lazy-load the child with `defineAsyncComponent` (GR#6) like `TechnicianSelect`.
  - Label case: "Sales representative" -> "Sales Representative" (PRD wording; Lead technician / Service advisor untouched).
  - GR#5 touch-it-add-it: audit the template with `npx tsx scripts/e2e-precheck.ts --files=...` (from `e2e/`); the vehicle-here
    button and both selects already carry ids.
- MODIFY `src/api/work-orders/queries.ts` `useChangeSalesRepMutation` JSDoc (sole caller is now the composable; payload carries
  split + parts id).

##### data-test-ids (P2)
Kept (unsplit WO and part sale; e2e `single-part-sale.page.ts` relies on them): `select_sales_rep`, `sales_rep_readonly`,
`option_sales_rep_<staffId>`, `option_sales_rep_null`.
New: `group_sales_rep`, `button_add_sales_rep`, `item_add_sales_rep_parts`, `button_remove_sales_rep_parts`,
`select_sales_rep_labor`, `select_sales_rep_parts`, `option_sales_rep_labor_<id|null>`, `option_sales_rep_parts_<id|null>`,
`sales_rep_labor_readonly`, `sales_rep_parts_readonly`.

##### Tests (P2)
- CREATE `src/components/ts/work-orders/sales-rep/tests/useWorkOrderSalesReps.spec.ts` (mount via a tiny host or
  `withSetup`, MSW for `*/work-orders/change-sales-rep`):
  pick single -> body `{sales_rep_id:X, split:false, parts_sales_rep_id:null}`; addParts -> `{split:true, sales_rep_id:X,
  parts_sales_rep_id:X}`; addParts on empty -> both null; pick labor leaves parts; removeParts keeps labor; **pick while pending
  -> no second request AND `shown` never shows the ignored id**; reject -> `shown` returns to server, toast path; same-value
  pick -> no request; invalidation of `detail(id)` awaited before the loading bracket clears; `refetchAfterSave` called;
  labels: inactive "(Inactive)" per side, unsplit Parts mirrors Labor snapshot, Unassigned, option-name resolution.
- CREATE `src/components/ts/work-orders/sales-rep/tests/WorkOrderSalesRepFields.spec.ts` (stub `Select` with the existing
  emit-only stub pattern from `OrderStatusCard.spec.ts:370-395`): one field + `button_add_sales_rep`; menu item
  "Sales Representative - Parts" -> two fields in order, labels, no + (S2-R10), x present with tooltip text; x -> one field;
  + and x disabled while saving; read-only renders both labels/names with no + / x (S2-R17); `allowSplit=false` -> no +;
  engaged class toggles on popup-show/hide and on menu-toggle; no `showPopup` after add.
- UPDATE `src/components/shared/tests/OrderStatusCard.spec.ts`:
  - `describe('sales rep select (SV-8599)')` L1018-~1340: request-body asserts gain `split:false, parts_sales_rep_id:null`;
    label text "Sales Representative"; **rewrite** "re-syncs the cache when the write is REJECTED (SV-9936)" (L1157): there
    is no optimistic cache patch any more; assert the detail invalidation still runs and the field shows the saved value.
  - Part-sale describe (~L1540-1786): body asserts gain the two fields; "does not call fetchWorkOrder on a service WO" stays;
    add "part sale never shows the + button" (S2-N2).
  - Add: split WO renders two fields; history mode / restricted status render both read-only labels.
- Seed fixtures (`makeWorkOrder`, L60-95) gain the four new fields.

---------------------------------------------------------------------------------------------------
#### P3. Print and audit log (Stories 6, 7)

- MODIFY `src/components/ts/work-orders/print/buildPrintModel.ts` (L224-241, L290-296): replace `salesRepresentative` with
  ```ts
  const side = (name, inactive): RepSideDisplay => ({ name: text(name) || null, inactive: inactive === true });
  const labor = side(workOrder?.sales_rep_name, workOrder?.sales_rep_is_inactive);   // gone staff => name null => Unassigned (S6-N1)
  const split = workOrder?.sales_rep_split === true;
  const parts = split ? side(workOrder?.parts_sales_rep_name, workOrder?.parts_sales_rep_is_inactive) : labor;
  const samePerson = !split || workOrder?.sales_rep_id === workOrder?.parts_sales_rep_id;
  const salesRepresentative =
    !labor.name && !parts.name ? ''                                        // S6-R4: row omitted (presentFields)
    : samePerson ? (labor.name ? (labor.inactive ? `${labor.name} (Inactive)` : labor.name) : '')   // S6-R1; never a bare "(Inactive)" (S6-N1)
    : formatTwoSidedReps(parts, labor);                                    // S6-R2, S6-R3
  ```
  Update the comment block (it documents a single rep). `WorkOrderPrintView.vue` unchanged (renders `value`).
- MODIFY `src/api/work-orders/WorkOrdersModel.ts` history row (~L2688): add the C4 fields (optional).
- MODIFY `src/components/work-orders/history/AuditLogDialog.vue` (L881-887):
  ```ts
  const repSnapshot = (split, laborId, laborName, partsId, partsName): string => {
    if (!split) return salesRepNameLabel(laborId, laborName);                          // S7-R2
    const named = (id, name) => { const l = salesRepNameLabel(id, name); return l === 'Unassigned' ? null : l; };
    return formatTwoSidedReps({ name: named(partsId, partsName) }, { name: named(laborId, laborName) }); // S7-R3, always both sides when split
  };
  value: `${repSnapshot(row.originalSalesRepSplit === true, ...original)} → ${repSnapshot(row.newSalesRepSplit === true, ...new)}`
  ```
  Note the deliberate difference from print: a split entry reads both sides even when one person holds both (S7-R3 says "a
  split work order reads both sides"; S6-R1 collapses only on paper). The entry is written once per change, including add /
  remove of the Parts field (S7-R1, BE); S7-R4/R5 are BE.
- Tests: UPDATE `print/tests/buildPrintModel.spec.ts` (L215-265): one person both sides (split or not) -> one name; inactive ->
  "(Inactive)"; two people -> "A (Parts) · B (Labor)"; inactive side -> "(Parts, inactive)"; one empty side; gone staff on one
  side -> Unassigned; both empty -> no row. UPDATE `history/tests/AuditLogDialog.spec.ts` (L2070-2120): unsplit unchanged;
  unsplit -> split; split -> unsplit; empty side; "Unknown" for an unresolved id.


#### Verification (Definition of Done gates):
- **Static (scoped):** eslint, vitest (`--maxWorkers=2`), vue-tsc, e2e-precheck.
- **Compile:** Vite up, no errors.
- **Browser-walk:** as listed in the P2 / P3 walk notes above (`/workorders/<open WO id>` as admin and as tech; throttled double-pick; forced failure; invoiced read-only; history read-only; touch emulation; part sale unchanged with no +; print and Audit Log for unsplit / split / one-empty / inactive). Check S2-R14 (labels never cut) at 100% and 200% zoom and in a narrow window; confirm **[design-verify]** offsets against the design canvas (now shared — open it in a browser; it renders in JavaScript, so read it by eye rather than by tooling).
- 🔴 **S1-R6 gap measurement (Product calls this a must-fix).** With DevTools, measure the vertical gap between Lead Technician → Service Advisor → each Sales Representative field in **all** of: the editable card, the read-only card (invoiced), the history card, the split card (Labor + Parts), and a card where Lead Technician falls back to its read-only branch (no technicians loaded). Every gap must be 16px. Our reading of `app/src/components/shared/OrderStatusCard.vue` says they already are, on `develop` and `main` — if every state measures 16px, close S1-R6 as a no-op and paste the measurements into the phase PR; if any state is off, fix it here — the gap is owned by the `.assignee-field + .assignee-field { margin-top: 16px }` rule and its `:deep()` resets in `OrderStatusCard.vue`, and inside a split group by `WorkOrderSalesRepFields.vue`'s `.sales-rep-group { row-gap: 16px }`; no other file sets it.
- **S3-R6 (phone collapse).** No new code: below `md`, `WorkOrderLeftSection.vue` renders the collapsed `OrderStatusCardMobile` (no assignee fields) until its edit button expands the full `OrderStatusCard`. `WorkOrderSalesRepFields` lives only inside the full card's `.assignee-field` wrappers (work order block and part-sale block alike), so it is hidden and revealed exactly like Lead Technician and Service Advisor. Walk it: phone emulation → collapsed card shows no rep field → edit button → rep fields appear → the expand control is unchanged.

#### E2E tests (e2e/):
- New: **N2** — work order card split → change one side → reload → remove; read-only once invoiced (happy + one gate). **N5** — print a work order with two reps (happy). See Section 7.
- Reference check: part-sale specs (`single-part-sale.page.ts`, C146392, C154877, C146393, C154615, C154618) keep `select_sales_rep`, `sales_rep_readonly`, `option_sales_rep_<id>` — verify they still pass. The label case change ("Sales representative" → "Sales Representative") breaks no current locator.

---

### Phase 6: Copy reps onto new, split and reopened documents (backend)
**Implements:** S4-R24, S4-R25, S4-R26, S4-R27, S4-R28, S4-R29, S4-R30, S4-R31, S2-E5, S2-N1, S7-R5
**Depends on:** Phase 2 (customer model), Phase 4 (work order model)

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php` | Create | Customer → work order / part sale reps (eligible staff only) |
| `api/src/Staff/Staff/Domain/StaffRepository.php` + Doctrine impl | Modify | `findEligibleSalesRepStaffIdsByUserIds()` |
| `api/src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php`, `Application/PartSale/Create/CreateCommandHandler.php` | Modify | Prefill at creation (no log entry) |
| `api/src/VehicleService/WorkOrders/Application/SplitWorkOrder/SplitWorkOrderCommandHandler.php`, `Domain/PartSale/Split/Service/PartSaleSplitter.php`, `Domain/PayedWorkOrderReopenedSubscriber.php` | Modify | Copy the source's reps + split state |

#### Frontend changes (`app/`):
None — new documents simply arrive with reps filled in.

#### Detailed design — backend

#### 6. Phase P4: prefill on create, copy on split and reopen (D11, S4-R24..R29)

- NEW `src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php`
  (Application service; depends on the Customer `Company` aggregate and the `StaffRepository` port,
  the same cross-context pattern as `InvoiceSalesRepResolver`):
  ```php
  public function forServiceWorkOrder(Company $company): WorkOrderSalesRepresentatives
  {   // S4-R24 / S4-R25 / S4-R27
      ['labor' => $l, 'parts' => $p, 'split' => $split] = $company->serviceSalesRepresentativeUserIds();
      $eligible = $this->staffRepository->findEligibleSalesRepStaffIdsByUserIds(array_filter([$l, $p])); // one query
      $labor = isset($eligible[(string) $l]) ? SalesRepId::from($eligible[(string) $l]) : null;
      return $split
          ? WorkOrderSalesRepresentatives::split($labor, isset($eligible[(string) $p]) ? SalesRepId::from($eligible[(string) $p]) : null)
          : WorkOrderSalesRepresentatives::single($labor);
  }
  public function forPartSale(Company $company): WorkOrderSalesRepresentatives   // S4-R26: never split
  ```
- NEW `StaffRepository::findEligibleSalesRepStaffIdsByUserIds(list<Uuid>): array<string,Uuid>` (Domain port
  plus the Doctrine impl). It runs one DBAL query over staff ⋈ user with `u.organization_id = :org`,
  `u.is_active = 1` and `s.is_sales_rep = 1`. On duplicate staff rows per user it is deterministic
  (lowest `s.id`), mirroring `findIdByUserId`.
- MODIFY `src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php`: load the company with
  `CompanyRepository::findOrgScopedById($command->getCompanyId())`. If it is found, call
  `$workOrder->startWithSalesRepresentatives($defaults->forServiceWorkOrder($company))` before `save()`.
  This writes no log entry (S7-R5). The handler still has no transaction, which is pre-existing; this
  adds no extra write.
- MODIFY `src/VehicleService/WorkOrders/Application/PartSale/Create/CreateCommandHandler.php`: the command
  already carries `Company`. Call `$workOrder->startWithSalesRepresentatives($defaults->forPartSale($command->getCompany()))`.
  Counter Sale works with no special case (S4-R31).
- MODIFY `Application/SplitWorkOrder/SplitWorkOrderCommandHandler.php` (new-WO branch, next to
  `markCoreChargedFromQuote`), `Domain/PartSale/Split/Service/PartSaleSplitter.php::createNewWorkOrder()`
  and `Domain/PayedWorkOrderReopenedSubscriber.php` (read the source before `$workOrder` is rebound):
  `$new->copySalesRepresentativesFrom($source)` (S4-R29, S2-E5). Moving lines to an EXISTING target WO
  does not touch reps.
- `ChangeCustomer` (`Application/ChangeCustomer/...`): **no change**. S4-R28 is guaranteed by not
  touching it, and a test pins that.
- **S4-R32** (a pick on a work order or part sale never changes its customer) holds by construction: the
  `ChangeSalesRep` handler loads only the `WorkOrder` and the `StaffRepository`, never the `Company`. Pin it:
  a functional test changes a work order's rep and a part sale's rep, then GETs the customer and asserts its
  `sales_representatives` are unchanged.
- Not touched: `src/OpenApi/Sandbox/Application/Seeder/WorkOrderSeeder.php`,
  `src/Invoicing/Invoice/Domain/Service/InvoiceViewService.php` (a preview WO), and imported WOs (PRD out of scope).
Tests (P4):
- NEW `tests/Unit/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaultsTest.php`:
  - An unsplit customer gives a single rep (S4-R24).
  - A split customer gives split with both reps (S4-R25).
  - An ineligible or unflagged person becomes Unassigned on that side only (S4-R27).
  - Part sale: an explicit part_sales Unassigned gives null, and the following chain otherwise applies (S4-R26).
  - A customer with no reps gives single(null).
- MODIFY or NEW unit tests for the 3 copy sites. The existing tests sit under `tests/Unit/VehicleService/WorkOrders/...`.
  Find them with `grep -rl PartSaleSplitter tests` and the equivalent for the others. Each test asserts
  that a split source yields a split copy and that an unsplit source yields an unsplit copy.
- NEW `tests/Functional/VehicleService/WorkOrders/Create/WorkOrderCreateCopiesCustomerSalesRepsTest.php`:
  - POST create for a split customer, then GET the detail: it is split and both sides are filled.
  - No `work_order.sales_rep.changed` entry exists (S7-R5).
  - Changing the WO's customer afterwards leaves its reps unchanged (S4-R28).
  - Changing the customer's reps leaves existing WOs unchanged (S4-R30).
- NEW `tests/Functional/VehicleService/WorkOrders/PartSale/PartSaleCreateCopiesCustomerSalesRepTest.php`:
  - The part_sales field is used when it is added.
  - The service_parts field is used otherwise.
  - A Counter Sale with no rep gives Unassigned (S4-R31).
- NEW `tests/Functional/Staff/Staff/FindEligibleSalesRepStaffIdsByUserIdsTest.php`: org-scoped, active and flagged only.


#### Verification (Definition of Done gates):
- **Static (scoped):** cs-fix, phpstan, pest (unit tests for the defaults service and the three copy sites; the functional create tests).
- **Smoke:** `bin/smoke-test.sh`; create a work order and a part sale for a split customer via the API and GET them.
- **Browser-walk (admin):** set a customer to split (Labor A, Service Parts B, Part Sales C); New Work Order → the card opens split A/B with no log entry; new part sale → C; Counter Sale part sale → Unassigned; Split Work Order and reopen a paid work order → reps copied; change the work order's customer → reps unchanged.

#### E2E tests (e2e/):
- Reference update (behavior change S4-R26): `tests/ui/part-sales/ps-tax-and-sales-rep-extended.spec.ts` C154617 part (b) — sale A now *starts* with the customer's rep; clear it to Unassigned first, then invoice (still credited via S4-R18), and move the test onto its own customer. **Fixture hygiene:** keep the shared base customer rep-less — prefill would otherwise leak its rep into every work order / part sale spec (C154615, C154618 assert "Unassigned").
- New: **N3** — customer split defaults → customer page → a new work order and part sale open prefilled (happy). See Section 7.

---

### Phase 7: Invoice per-side capture + customer fallback (backend)
**Implements:** S5-R1, S5-R2 (storage), S4-R17, S4-R18, S4-N1, S2-N1, S2-E3, S2-E4 (re-capture), S2-R13 (capture), S5-E2 (storage), NFR-003, NFR-004
**Depends on:** Phase 2, Phase 4

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version20261015100200.php` | `invoice` + `parts_sales_rep_id`, `parts_sales_rep_name`, `sales_rep_split` (INSTANT, no backfill) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Invoicing/Invoice/Domain/Invoice.php` + `Infrastructure/Doctrine/Invoice.orm.xml` | Modify | `captureSalesRepresentatives()` replacing `assignSalesRep()` |
| `api/src/Invoicing/Invoice/Application/Service/{InvoiceSalesRepResolver,InvoiceSalesRepSnapshot}.php` | Modify | Per side; customer fallback only when nobody is on either side |
| `api/src/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php` | Modify | Call the new domain method (create-only funnel) |
| `api/src/VehicleService/Vehicles/Application/HTTP/ListVehicleInvoices/ListingQueryHandler.php` | Modify | 🔴 Unset the new `i.*` columns (NFR-004) |

#### Frontend changes (`app/`):
None.

#### Detailed design — backend

#### 7. Phase P5: invoice per-side capture + customer fallback (D2, S4-R17/R18, S5-R1/R2)

##### 7.1 Migration `migrations/Version20261015100200.php` (non-transactional, guarded, INSTANT, no backfill)
```sql
ALTER TABLE invoice ADD parts_sales_rep_id BINARY(16) DEFAULT NULL, ALGORITHM=INSTANT;
ALTER TABLE invoice ADD parts_sales_rep_name VARCHAR(255) DEFAULT NULL, ALGORITHM=INSTANT;
ALTER TABLE invoice ADD sales_rep_split TINYINT(1) NOT NULL DEFAULT 0, ALGORITHM=INSTANT;
```
No index: the report groups by a per-side expression, which no single-column index can serve
(BE research §14). `inv__sales_rep_id_idx` stays; do not drop it in this epic.

##### 7.2 Code
- MODIFY `src/Invoicing/Invoice/Domain/Invoice.php`: add `?Uuid $partsSalesRepId`, `?string $partsSalesRepName`
  and `bool $salesRepSplit = false`. Replace `assignSalesRep(?Uuid, ?string)` with
  `captureSalesRepresentatives(?Uuid $laborId, ?string $laborName, bool $split, ?Uuid $partsId, ?string $partsName)`,
  which enforces `!split ⇒ parts null` (P-11). Add getters.
- MODIFY `Infrastructure/Doctrine/Invoice.orm.xml`: append the 3 fields with a comment (pattern at :70-76).
- MODIFY `Application/Service/InvoiceSalesRepSnapshot.php`: add `$split`, `$partsStaffId` and `$partsName`,
  plus `unassigned()`.
- MODIFY `Application/Service/InvoiceSalesRepResolver.php`:
  ```php
  public function resolve(WorkOrder $wo, Company $company): InvoiceSalesRepSnapshot
  {
      $reps = $wo->getSalesRepresentatives();
      if ($wo->isPartSaleType()) {                                   // S4-R18
          $id = $reps->laborRepId() ?? $this->staffIdForUser($company->partSaleSalesRepresentativeUserId());
          return InvoiceSalesRepSnapshot::single($id, $this->name($id));
      }
      if ($reps->hasAnyRep()) {                                      // S4-N1, S2-N1: capture as-is, empty side stays empty
          return $reps->isSplit()
              ? InvoiceSalesRepSnapshot::split($reps->laborRepId(), $this->name(...), $reps->partsRepId(), $this->name(...))
              : InvoiceSalesRepSnapshot::single($reps->laborRepId(), $this->name(...));
      }
      ['labor' => $l, 'parts' => $p, 'split' => $split] = $company->serviceSalesRepresentativeUserIds(); // S4-R17, S2-E3
      // user.id → staff.id via the existing org-scoped findIdByUserId (NO is_sales_rep filter: the S4-R27 context note)
      ...
  }
  ```
  Names still come from `findByIdInOrganization` (org-scoped, unchanged rationale).
- MODIFY `Application/HTTP/Builder/InvoiceBuilder.php::assignSalesRep()` to call the new domain method.
  It stays in the create-only funnel. Reversal followed by re-invoicing creates a new invoice and so
  re-captures (S2-E4).
- 🔴 MODIFY `src/VehicleService/Vehicles/Application/HTTP/ListVehicleInvoices/ListingQueryHandler.php`: add
  `$element['parts_sales_rep_id']`, `$element['parts_sales_rep_name']` and `$element['sales_rep_split']` to
  the `unset(...)` list. `i.*` picks up the new BINARY(16) column, which breaks `json_encode` and 500s
  the vehicle invoices list. This is the SV-9496 regression class.
Tests (P5):
- MODIFY `tests/Unit/Invoicing/Invoice/Application/Service/InvoiceSalesRepResolverTest.php`, with every
  branch:
  - Split WO is captured as-is, including one empty side.
  - Unsplit WO.
  - A WO with nobody on it and a split customer gives labor = primary and parts = service_parts (S4-R17).
  - An unsplit customer gives the one rep, unsplit.
  - A customer user without a staff row gives `(null, null)`.
  - Part sale with a rep.
  - Part sale without a rep follows the customer chain.
  - An explicit part_sales Unassigned gives an unassigned capture.
  - An unflagged customer person IS credited (S4-R27 note).
  - A cross-org WO rep id gives a null name.
- MODIFY `tests/Unit/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilderTest.php` (the `assignSalesRep` call site).
- MODIFY `tests/Functional/Invoicing/Invoice/Infrastructure/Doctrine/InvoiceSalesRepColumnsRoundTripTest.php`:
  the three new columns round-trip, and an old row reads split=false.
- MODIFY `tests/Functional/VehicleService/Vehicles/ListVehicleInvoices/ListingControllerTest.php`: a split
  invoice with a binary parts id returns 200 and the key is absent.
- NEW `tests/Unit/Invoicing/Invoice/Domain/InvoiceCaptureSalesRepresentativesTest.php`: invariant (P-11).


#### Verification (Definition of Done gates):
- **Static (scoped):** cs-fix, phpstan, pest.
- **Migration gate:** migrate, then `doctrine:migrations:diff --allow-empty-diff` → no changes.
- **Smoke:** `bin/smoke-test.sh`, plus the vehicle invoices list on a vehicle that has a split invoice (must be 200), invoice preview, a part-sale invoice.
- **Browser-walk (admin):** invoice a split work order and an empty work order of a split customer; reverse an invoice and re-invoice after changing a rep — the new invoice captures the new names (S2-E4).

#### E2E tests (e2e/):
- No direct UI; covered end-to-end by N1 (Phase 9). Factory addition: `createInvoicedWoWithParts` gains `shopSuppliesCharge`, `adjustments[]` and `partsSalesRepId` (split) options, applied **before** `/invoices/create`.

---

### Phase 8: Sales By Representative per side, Sales Type filter, exports (backend)
**Implements:** S5-R2 (report label), S5-R3, S5-R4..R18, S5-R15a, S5-R19 (BE), S5-R23, S5-R24, S5-N1, S5-N2, S5-E1, S5-E2, S2-R13 (credit), S8-R1..R5 (BE), NFR-001 (report)
**Depends on:** Phase 7

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Reports/Application/SalesByRepresentative/{SalesByRepresentativeSalesType,SalesByRepresentativeSalesTypeFilter,SalesByRepresentativeRowSalesType}.php` | Create | Filter + row Sales Type + masks |
| `api/src/Reporting/Reports/Application/SalesByRepresentative/SalesByRepresentativeProductType.php` | Delete | Replaced |
| `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php` | Modify | Per-side rows, integer-cent share, merged Level-2 rows, org-scoped staff join |
| `api/src/Reporting/Reports/Application/SalesByRepresentative/**` (queries, invoice row, export column/table builder/handler/result) and `UI/HTTP/SalesByRepresentative/**` (3 DTOs, 3 controllers) | Modify | `salesTypes` replaces `productType`; Sales Type export column; filter line |

#### Frontend changes (`app/`):
None in this phase (Phase 9). Until Phase 9 lands, the current SBR screen still sends `productType`, which is now ignored (all Sales Types) — never merge Phase 8 to develop alone.

#### Detailed design — backend

#### 8. Phase P6: Sales By Representative per side + Sales Type filter + exports; SBC labels

##### 8.1 Application types: `src/Reporting/Reports/Application/SalesByRepresentative/`
- NEW `SalesByRepresentativeSalesType.php`: enum `Labor='labor'`, `Parts='parts'`, `PartSales='part_sales'`
  (declared order = option order), with `label()` returning "Labor" / "Parts" / "Part Sales".
- NEW `SalesByRepresentativeSalesTypeFilter.php`: a copy of the `SalesByRepresentativePaymentBucketFilter`
  shape. It has `fromFilterString(?string)` (`all` | `none` | comma list; an unknown token throws a
  `DomainError`), `matchesEverything()`, `matchesNothing()`, `values()`, `types()`, and
  `includesBothServiceSides()` (diagnostic only).
- NEW `SalesByRepresentativeRowSalesType.php`: a VO built from `(bool $hasLabor, bool $hasParts, bool $hasPartSales)`,
  with `wireValue()` ('labor' | 'parts' | 'part_sales' | 'labor,parts'), `exportLabel()` ("Labor, Parts" …),
  and `masks(): list<string>` holding the financial keys to null (§0.6).
- DELETE `SalesByRepresentativeProductType.php`. Its only users are SBR files; SBC has its own enum.
- MODIFY `SalesByRepresentativeReportQuery.php`, `SalesByRepresentativeInvoicesQuery.php`,
  `Export/SalesByRepresentativeExportQuery.php`: replace `productType` with `SalesByRepresentativeSalesTypeFilter $salesTypes`.
- MODIFY `SalesByRepresentativeInvoiceRow.php`: add `SalesByRepresentativeRowSalesType $salesType`. In
  `jsonSerialize()`, add `'sales_type'` and null out `$salesType->masks()` keys in the financials array.
  For part_sales, `shop_supplies` is null when it is 0 (S5-R15a).
- `SalesByRepresentativeFinancials.php`, `SalesByRepresentativeRow.php` and `SalesByRepresentativeTotals.php`:
  **no formula change**. The per-side split happens upstream in SQL, and summary rows stay real sums
  (S5-R16). Update docblocks to say `invoiceLevelAdjustmentsCentsRaw` is "the side's share".
- MODIFY `Export/SalesByRepresentativeExportColumn.php`: add `case SalesType = 'sales_type'` with header
  "Sales Type". It is an identity column (left-aligned, injection-guarded) inserted **after `PaymentStatus`**
  in `expanded()` only, never in `summary()`.
- MODIFY `Export/SalesByRepresentativeExportTableBuilder.php`: invoice rows fill `SalesType` from
  `exportLabel()`, and rep and total rows leave it blank. `financialValues()` must accept null for
  masked keys. Null renders as `''` for `ReportExportFigureStyle::Spreadsheet` (CSV) and `—` for
  `Display` (PDF), following the existing `margin_pct` precedent and
  `ReportExportFormatter::marginPercent()`. Add a `ReportExportFormatter::optionalMoney(?int, style)`
  if one does not exist.
- MODIFY `Export/SalesByRepresentativeExportQueryHandler.php`: replace `productTypeLabel()` with
  `salesTypeLabel(filter)`. Everything gives "All", nothing gives "None", and otherwise the labels are
  joined with ", " in enum order (S8-R3, S8-R4).
- MODIFY `Export/SalesByRepresentativeExportResult.php`: rename `productTypeLabel` to `salesTypeLabel`.
- MODIFY `UI/HTTP/SalesByRepresentative/SalesByRepresentativeExportController.php::filterSegments()`:
  `new ReportExportFilterSegment('Sales Type', $result->salesTypeLabel)`, and update the CSV record-layout comment.
- MODIFY the 3 DTOs `UI/HTTP/SalesByRepresentative/DTO/SalesByRepresentative{,Invoices,Export}RequestDto.php`:
  remove `productType` and its `#[Choice]`. Add `public readonly string $salesTypes = 'all'` and
  `getSalesTypes(): SalesByRepresentativeSalesTypeFilter`. Update the docblocks.
- MODIFY the 3 controllers and the 3 query handlers to pass `salesTypes` through.

##### 8.2 The fetcher: `src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php`
Short-circuit on `salesTypes->matchesNothing()` everywhere `productType->matchesNothing()` is used today
(S8-R5). Remove every `$prefix` / `sbrInvoicePrefix` path.

**(a) Platform-safe integer division (P-7).** Use a private helper so the PHP stays readable:
```php
private function intDiv(string $a, string $b): string
{   // both operands are NON-NEGATIVE integers at every call site. The divisor D can be 0; every use sits
    // inside `CASE WHEN D = 0 THEN … ELSE <uses intDiv> END`, and both MySQL and SQLite evaluate CASE lazily,
    // so the division never runs with D = 0. Keep that guard outermost if this SQL is refactored.
    return $this->connection->getDatabasePlatform() instanceof AbstractMySQLPlatform
        ? "(($a) DIV ($b))" : "(($a) / ($b))";
}
```

**Where S5-R4/S5-R5's "line fees and discounts" live.** They need no column of their own: `InvoiceFinancialSnapshotService` already nets `labor_line`-scoped adjustments into `labor_sell` and `part_line`-scoped ones into `parts_sell`, and `invoice_level_adjustments` holds only the whole-invoice pool (`Invoice.orm.xml:58-68`: "scopes whole_wo / whole_parts_sale, the processing fee, the legacy invoice.discount rate and the §5 subtotal floor"). So the Labor row's `labor_sell` already includes labor-line fees and discounts, and the Parts row's `parts_sell` part-line ones. Functional test: an invoice with a labor-line discount and a part-line fee credits each to its own row and leaves `adjustments` for the whole-invoice amount only.

**(b) Per-invoice inputs, then the per-side derived table `sd` (`self::sideSql()`):**
```
L  = COALESCE(i.labor_sell, 0)            P = COALESCE(i.parts_sell, 0)
A  = COALESCE(i.invoice_level_adjustments, 0)
LR = i.sales_rep_id
PR = CASE WHEN i.sales_rep_split = 1 THEN i.parts_sales_rep_id ELSE i.sales_rep_id END   (P-11, S5-E2)
D  = ABS(L) + ABS(P)                                  -- S5-R6/S5-E1: weights by SIZE
N  = ABS(A) * ABS(P)                                  -- ≤ (2^31)^2 ≈ 4.6e18 < BIGINT max
Q  = intDiv(N, D)                                     -- exact floor
M  = Q + CASE WHEN 2 * (N - Q * D) > D THEN 1 ELSE 0 END   -- round half TOWARD ZERO: a tie cent stays with Labor (S5-R7)
PARTS_SHARE = CASE WHEN D = 0
                   THEN CASE WHEN LR IS NULL AND PR IS NOT NULL THEN A ELSE 0 END    -- S5-R8
                   WHEN A < 0 THEN -M ELSE M END
LABOR_SHARE = A - PARTS_SHARE                         -- Σ shares == A exactly (S5-R14)
```
```sql
SELECT i.id AS invoice_id, i.work_place_id AS work_place_id, st.sales_type AS sales_type,
       CASE WHEN st.sales_type = 'parts' THEN <PR> ELSE i.sales_rep_id END                          AS rep_id,
       CASE WHEN st.sales_type = 'parts' AND i.sales_rep_split = 1
            THEN i.parts_sales_rep_name ELSE i.sales_rep_name END                                   AS captured_name,
       CASE WHEN st.sales_type = 'parts' THEN 0 ELSE COALESCE(i.labor_sell, 0) END                  AS labor_sell,
       CASE WHEN st.sales_type = 'parts' THEN 0 ELSE COALESCE(i.labor_cost, 0) END                  AS labor_cost,
       CASE WHEN st.sales_type = 'labor' THEN 0 ELSE COALESCE(i.parts_sell, 0) END                  AS parts_sell,
       CASE WHEN st.sales_type = 'labor' THEN 0 ELSE COALESCE(i.parts_cost, 0) END                  AS parts_cost,
       CASE WHEN st.sales_type = 'parts' THEN 0 ELSE COALESCE(i.shop_supplies_charge, 0) END        AS shop_supplies,   -- S5-R4 (incl. hand-typed)
       CASE st.sales_type WHEN 'part_sales' THEN <A> WHEN 'parts' THEN <PARTS_SHARE>
                          ELSE <A> - <PARTS_SHARE> END                                              AS adjustments,
       CASE WHEN st.sales_type = 'parts' THEN 0 ELSE COALESCE(i.hours_invoiced, 0) END              AS hours_invoiced,
       CASE WHEN st.sales_type = 'parts' THEN 0 ELSE COALESCE(i.hours_worked, 0) END                AS hours_worked
FROM invoice i
INNER JOIN (SELECT 'labor' AS sales_type UNION ALL SELECT 'parts' UNION ALL SELECT 'part_sales') st
        ON st.sales_type IN (:sbrSalesTypes)
       AND (CASE WHEN i.invoice_number LIKE 'P%' THEN 1 ELSE 0 END)
         = (CASE WHEN st.sales_type = 'part_sales' THEN 1 ELSE 0 END)                                -- P-9
[LEFT JOIN customer_transaction ct ON ct.reference_id = i.id AND ct.customer_transaction_type = :sbrInvoiceTxnType]   -- only with payment filter
WHERE <NonVoid> AND i.created_on BETWEEN :sbrFrom AND :sbrTo AND i.organization_id = :sbrOrg
  AND i.work_place_id IN (:sbrWorkplaces) [AND <payment bucket IN>]
  [AND (CASE WHEN st.sales_type = 'parts' THEN <PR> ELSE i.sales_rep_id END) IS NOT NULL]           -- Show Unassigned OFF (S5-R14)
```
Bind `:sbrSalesTypes` as `ArrayParameterType::STRING` (always `values()`; for `all` that is all three).

**(c) Level-1 (`buildInnerSql`) groups the side rows by rep:**
```sql
SELECT COALESCE(BIN_TO_UUID(sd.rep_id), :sbrUnassignedKey) AS rep_key,
       CASE WHEN sd.rep_id IS NULL THEN 1 ELSE 0 END AS is_unassigned,
       -- S5-R2 (confirmed by Product, PRD v8): CURRENT staff name first, captured name only when the staff row is gone
       COALESCE(MAX(CASE WHEN u.id IS NOT NULL THEN CONCAT(s.first_name, ' ', s.last_name) END), MAX(sd.captured_name)) AS rep_name,
       MAX(CASE WHEN s.id IS NULL OR u.id IS NULL OR s.is_sales_rep = 0 OR u.is_active = 0 THEN 1 ELSE 0 END) AS is_inactive,
       COALESCE(CASE WHEN COUNT(DISTINCT sd.work_place_id) = 1 THEN MAX(w.name) ELSE 'Multiple' END, '') AS location,
       COALESCE(SUM(sd.labor_sell),0) AS labor_sell_sum, COALESCE(SUM(sd.labor_cost),0) AS labor_cost_sum,
       COALESCE(SUM(sd.parts_sell),0) AS parts_sell_sum, COALESCE(SUM(sd.parts_cost),0) AS parts_cost_sum,
       COALESCE(SUM(sd.shop_supplies),0) AS shop_supplies_sum,
       COALESCE(SUM(sd.adjustments),0) AS invoice_level_adjustments_sum,
       COALESCE(SUM(sd.hours_invoiced),0) AS hours_invoiced_sum, COALESCE(SUM(sd.hours_worked),0) AS hours_worked_sum,
       COUNT(DISTINCT sd.invoice_id) AS invoice_count                                               -- S5-R13, S5-N1
FROM (<sideSql>) sd
LEFT JOIN workplace w ON w.id = sd.work_place_id AND w.organization_id = :sbrOrg                    -- RULE 1, unchanged
LEFT JOIN staff s     ON s.id = sd.rep_id
LEFT JOIN user  u     ON u.id = s.user_id AND u.organization_id = :sbrOrg                           -- D4 (was unscoped)
GROUP BY sd.rep_id
```
`repPageQb()`, `TOTALS_EXPRESSION`, the `ReportPaginator` wrapping and the Unassigned pin are unchanged.
The aliases are identical, so `SalesByRepresentativeSortFields` is unchanged too.

**(d) Level-2 drill-down (`fetchInvoices`) and Expanded flat fetch (`fetchAllInvoicesForExport`)** group
side rows to (rep, invoice), which implements the S5-R10 merge:
```sql
SELECT g.rep_key, g.has_labor, g.has_parts, g.has_part_sales, g.<sums…>, <display columns from i / wo / w / ct as today>
FROM (SELECT COALESCE(BIN_TO_UUID(sd.rep_id), :sbrUnassignedKey) AS rep_key, sd.invoice_id,
             MAX(CASE WHEN sd.sales_type = 'labor' THEN 1 ELSE 0 END) AS has_labor,
             MAX(CASE WHEN sd.sales_type = 'parts' THEN 1 ELSE 0 END) AS has_parts,
             MAX(CASE WHEN sd.sales_type = 'part_sales' THEN 1 ELSE 0 END) AS has_part_sales,
             SUM(sd.labor_sell) AS labor_sell_sum, … SUM(sd.adjustments) AS invoice_level_adjustments_sum, …
      FROM (<sideSql>) sd
      [WHERE <rep predicate on sd.rep_id>]                     -- Level-2 only; Unassigned key → sd.rep_id IS NULL
      GROUP BY sd.rep_id, sd.invoice_id) g
INNER JOIN invoice i ON i.id = g.invoice_id
LEFT JOIN work_order wo ON wo.id = i.work_order_id
LEFT JOIN workplace w ON w.id = i.work_place_id AND w.organization_id = :sbrOrg
LEFT JOIN customer_transaction ct ON ct.reference_id = i.id AND ct.customer_transaction_type = :sbrInvoiceTxnType
ORDER BY i.created_on DESC, i.raw_number ASC, i.id ASC
```
- The has_* flags map to `SalesByRepresentativeRowSalesType` in `mapInvoiceRow()`, built in PHP rather
  than with `GROUP_CONCAT`, so the query also runs on SQLite.
- Because the side table is already narrowed by `:sbrSalesTypes`, the merge happens only when both
  sides are selected (S5-R10, S5-R12). Different people are always two rows (S5-R11).

**(e) `countExpandedRows()`:** rep count = `COUNT(*)` over the Level-1 subquery (unchanged).
Invoice-row count = `SELECT COUNT(*) FROM (SELECT 1 FROM (<sideSql>) sd GROUP BY sd.rep_id, sd.invoice_id) x`.
A split invoice now counts as 2 rows toward the 10k Expanded cap (§10 R-9).

**(f) Worked checks (integer cents). Include these as functional-test fixtures:**
- **S5-R6:** L=60000, P=40000, SS=3000, A=−5000. D=100000, N=5000·40000=200,000,000. Q=2000, remainder
  0, so M=2000 and PARTS_SHARE=−2000, LABOR_SHARE=−3000. Labor row subtotal 60000+3000−3000=**60000**
  ($600.00). Parts row subtotal 40000−2000=**38000** ($380.00). Σ = 98000 = 100000+3000−5000 ✓.
- **S5-E1:** L=60000, P=−10000, A=−7000. D=70000, N=7000·10000=70,000,000. Q=1000, remainder 0, so
  PARTS_SHARE=−1000 and LABOR_SHARE=−6000 (6/7 and 1/7 by size). Subtotals **54000** and **−11000**,
  Σ 43000 = invoice total ✓.
- **S5-R7 tie:** L=100, P=100, A=−1. D=200, N=100. Q=0, 2·100=200 is not > 200, so M=0.
  PARTS=0 and LABOR=−1: the leftover cent goes to Labor ✓. A non-tie: L=1, P=2, A=−100 gives D=3,
  N=200, Q=66, r=2, 2r=4>3 so M=67. PARTS=−67 (exact −66.67), LABOR=−33 ✓.
- **S5-R8:** L=P=0, A=500. With LR=X, labor gets 500. With LR=null and PR=Y, parts gets 500. With both
  null, the (Unassigned) labor row gets 500 ✓.
- **S5-E2 / P-11:** an old invoice (split=0, rep X) gives Labor and Parts rows both with rep X. Level-1
  sums equal the pre-release figures, `invoice_count`=1 (DISTINCT), and Level 2 shows one row, "labor,parts" ✓.
- **Presentation-edge rounding:** every money column is already integer cents and shares are computed in
  integer cents, so `SalesByRepresentativeFinancials::roundCents()` is a no-op on money. Hours are
  DECIMAL(…,2) sums rounded once as today. Σ rows = totals holds to the cent.

##### 8.4 Tests (P6)
Unit:
- NEW `tests/Unit/Reporting/Reports/Application/SalesByRepresentative/SalesByRepresentativeSalesTypeFilterTest.php`:
  `all`/`none`/subset/order/unknown token raises a DomainError; a sentinel mixed into a list raises a DomainError.
- NEW `.../SalesByRepresentativeRowSalesTypeTest.php`: wire value, export label and masks for all four
  combinations, plus part-sale shop supplies at 0 versus non-zero.
- MODIFY `.../Export/SalesByRepresentativeExportTableBuilderTest.php` (find it with `grep -rl ExportTableBuilder tests/Unit`):
  - The Sales Type column comes right after Status in expanded and is absent in summary.
  - A masked cell is '' in a CSV-styled export and '—' in a PDF-styled one (S5-R23).
- MODIFY `.../Export/SalesByRepresentativeExportQueryHandlerTest.php`: Sales Type labels "All", "None",
  "Labor, Parts" (S8-R3/R4).
Functional (SQLite, real SQL):
- MODIFY `tests/Functional/Reporting/Reports/Application/SalesByRepresentative/DbalSalesByRepresentativeFetcherTest.php`.
  The existing cases (all unsplit) must pass **unchanged in figures**, which is the S5-E2 regression net.
  New cases:
  - The S5-R6 example.
  - The S5-E1 example.
  - The tie cent.
  - The three S5-R8 variants.
  - Split X/Y gives two rows, each with `invoice_count` 1, and totals unchanged with Show Unassigned on (S5-R13, S5-R14).
  - Labor = Unassigned with Show Unassigned off: the labor side drops out of the totals (S5-R14).
  - The Parts filter alone credits only the parts side (S5-R12).
  - `none` gives the empty state (S8-R5).
  - A part sale gives one row holding everything (S5-R9).
  - A $0 invoice counts once for each rep (S5-N1).
  - A negative parts return reduces the parts rep (S5-N2).
  - A cross-org staff id on an invoice gives a null live name and falls back to the captured name with inactive set (D4).
- MODIFY `.../DbalSalesByRepresentativeInvoicesFetcherTest.php`:
  - Same rep on both sides gives one row with `sales_type` 'labor,parts' and real figures in every field.
  - A Labor-only row nulls the parts fields.
  - A Parts-only row nulls the labor, hours and shop-supplies fields (S5-R15).
  - The drill-down with the Labor filter alone: the same rep gives a 'labor' row.
- MODIFY `.../DbalSalesByRepresentativeExportFetcherTest.php`: Expanded rows match the Level-2 rows, the
  cap count includes split rows, and Σ invoice rows = rep row to the cent.
- MODIFY the SBR controller and functional tests that send `productType` (`grep -rl "productType" tests/Functional/Reporting`)
  so they send `salesTypes`. Add: an unknown `salesTypes` token returns 400.
- **MySQL verification (not covered by the SQLite suite):** run the S5-R6, S5-E1 and tie fixtures through
  the real fetcher against a throwaway MySQL 8 container (team practice: "MySQL gate via throwaway
  containers"). This proves the `DIV` branch, and it is the only way to exercise P-7 on the production
  engine. Record the output in the PR.


#### Verification (Definition of Done gates):
- **Static (scoped):** cs-fix, phpstan, pest — the existing fetcher tests (all unsplit) must pass **unchanged in figures** (the S5-E2 regression net), plus the new cases in §8.4.
- **MySQL gate:** run the S5-R6, S5-E1 and tie-cent fixtures through the real fetcher against a throwaway MySQL 8 container (the suite runs on SQLite; this proves the `DIV` branch). Record the output in the PR.
- **Smoke:** `bin/smoke-test.sh`; the three SBR endpoints with `salesTypes=all|none|labor,parts`; an unknown token → 400; both exports.
- **Browser-walk:** none until Phase 9 (API-level checks above).

#### E2E tests (e2e/):
Reference updates this phase breaks:
- `e2e/src/pages/reports/sales-by-representative.page.ts` `sbrCsvRecordIndices` — metadata prefix `'Product Type: '` → `'Sales Type: '` (breaks C38923, C30277, C30287 otherwise).
- same file `sbrExpandedExportHeaders()` — insert `'Sales Type'` after `'Status'` (C38923, C30277 header assertions).

---

### Phase 9: Sales By Representative screen (frontend)
**Implements:** S5-R12, S5-R15, S5-R15a, S5-R16, S5-R19, S5-R20, S5-R21, S5-R22, S5-R24; renders S5-R10/R13/R14/R17; S8-R1..R5
**Depends on:** Phase 1 (chip opt-in), Phase 8

#### Database changes:
None.

#### Backend changes (`api/`):
None.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/reporting/{ReportingModel.ts,queries.ts}` | Modify | `salesTypes`, nullable uncredited-side fields, `sales_type` |
| `app/src/components/ts/reporting/sales-by-representative/Model.ts` | Modify | Sales Type options/param/labels; column model (Sales Type first in the selector, off by default) |
| `app/src/components/ts/reporting/sales-by-representative/SalesByRepresentativeReport.vue` | Modify | New `salesTypes` filter key; Sales Type column after Status; saved-view `version: '3'`. **Adds a row id `row_sbr_invoice_<invoiceId>_<sales_type>`** on invoice rows (an invoice now repeats under two reps; test-curator soft gap) |

#### Detailed design — frontend

#### P5. Sales By Representative (Story 5 rendering + Story 8 SBR)

##### Types (GR#4): `src/api/reporting/ReportingModel.ts`
- DELETE `SalesByRepresentativeProductType`. ADD:
  ```ts
  /** Row value (S5-R19). 'labor,parts' = one person on both sides, merged (S5-R10). */
  export type SalesByRepresentativeSalesType = 'labor' | 'parts' | 'part_sales' | 'labor,parts';
  /** Wire filter (C3): 'all' | 'none' | comma-joined subset in option order. */
  export type SalesByRepresentativeSalesTypes = string;
  /** Invoice-row financials: the side a row is NOT credited with is null (S5-R15, S5-R15a). */
  export interface SalesByRepresentativeInvoiceFinancials {
    inv_hrs: number | null; hours_worked: number | null; hours_invoiced: number | null;
    labor_invoiced: number | null; labor_margin: number | null;
    parts_invoiced: number | null; parts_margin: number | null; shop_supplies: number | null;
    adjustments: number; margin: number; subtotal: number; margin_pct: number | null;
  }
  ```
  `SalesByRepresentativeInvoiceRow extends SalesByRepresentativeInvoiceFinancials` + `sales_type: SalesByRepresentativeSalesType`.
  `SalesByRepresentativeFinancials` (rep rows, totals) stays non-null (S5-R16: summary rows are real sums).
  Replace `productType` with `salesTypes: SalesByRepresentativeSalesTypes` in `SalesByRepresentativeFilters`,
  `...ReportParams`, `...InvoicesParams`, `...ExportParams` (~L1205, 1225, 1247, 1371).
- MODIFY `src/api/reporting/queries.ts:486-496`: `salesTypes: filters?.salesTypes ?? 'all'`.

##### `sales-by-representative/Model.ts`
- DELETE: `SbrProductTypeValue`, `SBR_PRODUCT_TYPE_OPTIONS`, `SBR_ALL_PRODUCT_TYPES`, `sbrProductTypeParam`,
  `toSbrProductTypeValues`, `isSbrProductTypeList`, and the dead `SbrRememberedExtra` (spec-only references).
- ADD:
  ```ts
  export type SbrSalesTypeValue = 'labor' | 'parts' | 'part_sales';
  export const SBR_SALES_TYPE_OPTIONS = [ { label:'Labor', value:'labor' }, { label:'Parts', value:'parts' },
    { label:'Part Sales', value:'part_sales' } ] satisfies { label: string; value: SbrSalesTypeValue }[];   // S8-R1 order
  export const SBR_ALL_SALES_TYPES = SBR_SALES_TYPE_OPTIONS.map((o) => o.value);
  export const toSbrSalesTypeValues = (values: readonly string[]) => SBR_SALES_TYPE_OPTIONS.filter((o) => values.includes(o.value)).map((o) => o.value);
  export const sbrSalesTypesParam = (selected: readonly SbrSalesTypeValue[]): SalesByRepresentativeSalesTypes => {
    const chosen = SBR_SALES_TYPE_OPTIONS.filter((o) => selected.includes(o.value));
    if (!chosen.length) return 'none';                                         // S8-R5
    if (chosen.length === SBR_SALES_TYPE_OPTIONS.length) return 'all';
    return chosen.map((o) => o.value).join(',');
  };
  export const SBR_SALES_TYPE_LABELS: Record<SalesByRepresentativeSalesType, string> =
    { labor:'Labor', parts:'Parts', part_sales:'Part Sales', 'labor,parts':'Labor, Parts' };   // S5-R19
  export const formatSbrSalesType = (t: SalesByRepresentativeSalesType) => SBR_SALES_TYPE_LABELS[t];
  export const SBR_SALES_TYPE_COLUMN = { name: 'sales_type', label: 'Sales Type' };
  ```
- Column model:
  ```ts
  export const SBR_SELECTABLE_COLUMNS = [SBR_SALES_TYPE_COLUMN, ...SBR_FINANCIAL_COLUMNS];           // S5-R20 first in list
  export const SBR_DEFAULT_VISIBLE_COLUMNS = SBR_FINANCIAL_COLUMNS.map((c) => c.name);              // S5-R21 OFF by default
  export const SBR_ALL_COLUMN_NAMES = SBR_SELECTABLE_COLUMNS.map((c) => c.name);                   // validator accepts it (S5-R22)
  ```
  Not server-sortable (not added to `SBR_SERVER_SORTABLE_COLUMN_NAMES`).
- `formatSbrFinancial` / `sbrFinancialColorClass`: parameter type -> `SalesByRepresentativeInvoiceFinancials` (the non-null
  rep/totals type is assignable). The shared formatters already return the em dash for null; `$0.00` stays for a real zero.

##### `SalesByRepresentativeReport.vue`
- Filters: `SYNC_KEYS` `'productTypes'` -> `'salesTypes'` (NEW key: an old `productTypes` link is ignored and the default, all
  three, applies; release-day note). `DEFAULT_FILTERS.salesTypes = [...SBR_ALL_SALES_TYPES]`. Def:
  ```ts
  { key: 'salesTypes', label: 'Sales Type', icon: 'o_category', type: 'multi', options: salesTypeFilterOptions,
    selectAllLabel: 'All', summaryNoun: 'sales types', allSummaryLabel: 'All', emptySummaryLabel: 'None',
    summaryListsNames: true }          // S8-R3: "Sales Type: All" / "None" / "Labor, Parts"
  ```
  (placed where Product Type was). `salesTypesParam = computed(() => sbrSalesTypesParam(salesTypes.value))` replaces
  `productTypeParam` in `filters()`, `scopeParams()`, `buildExportParams()` and `collapseSignature`.
- Column: `showSalesTypeColumn = computed(() => visibleColumns.value.includes('sales_type'))`.
  `tableColumns`: after the four identifiers and BEFORE Location push `{ name:'sales_type', label:'Sales Type', align:'left' }`
  when shown (S5-R19 "after Status"). Header renders through the existing non-sortable branch (`header_sbr_sales_type`).
  `identifierColumnCount` becomes `computed(() => SBR_IDENTIFIER_COLUMN_COUNT + (showSalesTypeColumn.value ? 1 : 0))`, so the
  merged rep-name cell and the Totals cell span it (a rep row and Totals have no single Sales Type; this keeps S10-R5's shape).
- Invoice row: after the Status `q-td` (L234-241):
  ```vue
  <q-td v-if="showSalesTypeColumn" class="text-left"
        :data-test-id="`text_sbr_sales_type_${invoice.invoice_id}_${invoice.sales_type}`">{{ salesTypeLabel(invoice.sales_type) }}</q-td>
  ```
  `v-for` key -> `` `${invoice.invoice_id}:${invoice.sales_type}` `` (a split invoice now appears under two reps).
  Also put `:data-test-id="`row_sbr_invoice_${invoice.invoice_id}_${invoice.sales_type}`"` on the invoice `q-tr` itself, so E2E can address a row even when the Sales Type column is off.
- Remembered view: `version: '3'` with a comment "Bumped for Sales Type (SV-10890): one-time reset of columns AND sort to
  the defaults, Sales Type off" (release-day rule; `useRememberedTableView` clears the whole entry on a mismatch).
- Empty export / empty state: unchanged code paths already satisfy S8-R4 (`!data.length` -> "Empty export") and S8-R5
  (`FilteredTableEmptyState`, `filtersApplied` true when Sales Type is narrowed to none).
- Comments that mention Product Type: reword.

##### Tests (P5)
- UPDATE `sales-by-representative/tests/Model.spec.ts`: delete `sbrProductTypeParam` (L363-376) and `isSbrProductTypeList`
  (L420-438) blocks; add `sbrSalesTypesParam` (all / none / subset in option order regardless of input order),
  `toSbrSalesTypeValues` (drops unknown), `formatSbrSalesType` (4 values), column constants (selectable first = sales_type,
  default visible excludes it, all names include it), `formatSbrFinancial` with null -> em dash and 0 -> "$0.00".
- UPDATE `sales-by-representative/tests/SalesByRepresentativeReport.spec.ts`: rewrite `describe('Product Type filter')`
  L358-460 as Sales Type (wire param `salesTypes=all` by default, `none` after Clear all, `labor,parts` subset; chip texts
  "All" / "None" / "Labor, Parts"); L1153-1189 URL-restore cases: an old `?productTypes=parts` URL opens with all three
  (default) and sends `salesTypes=all`; column selector shows Sales Type first and OFF; toggling it on adds the column after
  Status, the merged rep cell colspan grows by 1, persisted in localStorage; a stored version '2' view resets; invoice row
  with null parts fields renders em dashes while the rep row shows sums. Update MSW handlers for the report /
  invoices endpoints in that spec to include `sales_type`.
- E2E impact: `e2e/src/pages/reports/sales-by-representative.page.ts` (`PRODUCT_TYPE_KEY` -> `salesTypes`, labels, CSV
  metadata line "Product Type:" -> "Sales Type:", L140-170), `sales-by-representative-seed.helper.ts`,
  `e2e/src/pages/dashboard/report-parity.helper.ts` (check), any spec asserting the 9-column selector.


#### Verification (Definition of Done gates):
- **Static (scoped):** eslint, vitest (`--maxWorkers=2`), vue-tsc, e2e-precheck.
- **Compile:** Vite up, no errors.
- **Browser-walk (admin, `/reports/sales-by-representative`):** chip "Sales Type: All"; Labor + Parts → "Sales Type: Labor, Parts"; none → "Sales Type: None", empty state, Export → "Empty export". Column selector: Sales Type first and off; turn on → column after Status, rep and Totals merged cells span it; reload → still on. A split invoice shows under both reps with dashes on the uncredited side and real sums on the rep rows; an old `productTypes=parts` link opens with every Sales Type; first visit after deploy resets columns and sort. Expanded CSV/PDF carry Sales Type after Status with blank / dash cells.

#### E2E tests (e2e/):
- Reference updates: `e2e/src/pages/reports/sales-by-representative.page.ts` — `PRODUCT_TYPE_KEY` → `SALES_TYPE_KEY='salesTypes'`, `SbrProductType` → `'labor' | 'parts' | 'part_sales'`, methods `selectOnlySalesTypes()` / `selectAllSalesTypes()` / `clearAllSalesTypes()`, plus `salesTypeCell(invoiceId, type)` and a column-selector toggle helper; `tests/ui/reporting/sales-by-representative.spec.ts` C30274 — assert `salesTypes=all` and no `productType`.
- New: **N1** — a split work order invoiced → SBR credits each side with the PRD S5-R6 figures (happy). See Section 7.

---

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **Backend:** the `Company` aggregate rules (add / remove / following / in-place mutation / per-field removal), `CompanySalesRepresentatives` and `SalesRepresentativeAssignmentPolicy` (Phase 2); `WorkOrderSalesRepresentatives` and `WorkOrder::changeSalesRepresentatives()` (locks, no-op, add / remove Parts), the change handler (eligibility for new ids only, one log entry, org scoping), the history resolver's positional append (Phase 4); `CustomerSalesRepresentativeDefaults` and the three copy sites (Phase 6); `InvoiceSalesRepResolver` every branch (Phase 7); the Sales Type filter / row type / export table builder (Phase 8). Lists per phase in §3.7, §5.6, §6, §7.2, §8.4.
- **Frontend:** `IconActionButton`, `AddRepresentativeButton`, `FilterChip` opt-in + regression pin, `salesRepLabels` (Phase 1); `customerSalesReps.ts` rule set, `CustomerSalesRepFields`, `CustomerDialog`, `CustomerLeftSection` (Phase 3); `useWorkOrderSalesReps` (pick-while-pending sends nothing and never shows the ignored id; rollback; payloads), `WorkOrderSalesRepFields`, `OrderStatusCard` (part sale never shows +), `buildPrintModel`, `AuditLogDialog` (Phase 5); SBR `Model` and report spec (Phase 9).
- **Edge cases to watch:** an inactive holder copied onto Parts (S2-E1/R6); remove + re-add of the same customer side in one save (unique-constraint trap, R-2); `NullableUuid::create(null)` minting random ids (R-3); history payload positional order (R-4); SQLite vs MySQL integer division (R-6).

### Integration tests
- Functional (Pest, SQLite): customer create / change / view with the list; rename reaching every customer; foreign-org and ineligible ids refused; warning count; assignments export rows; change-sales-rep end to end incl. the D7 lock and part-sale guards; detail scoping for cross-org ids; create / split / reopen copying; invoice capture round-trip; vehicle invoices list 200 with a split invoice; the Sales By Representative fetcher with the PRD worked examples and the existing unsplit fixtures unchanged in figures.
- MySQL: the share fixtures through a throwaway MySQL 8 container (Phase 8).

### Manual testing checklist
1. Geometry on the work order card (S1-R3..R6, S1-R11, S2-R14): at rest, on hover, while a dropdown or the + menu is open, with keyboard focus; 100% and 200% zoom; a narrow window. Confirm **[design-verify]** offsets once the canvas is shared (Q4).
2. Touch (S3): a real phone or DevTools touch emulation (`hover: none`) — + and x always visible; arrows per Q3; collapsed card until expanded (S3-R6); customer dialog on a phone (S3-R5).
3. Throttled network (Slow 3G): a second pick during a save is ignored with no flash; + / x disabled until the save finishes (S1-E1).
4. Release-day checks on a copy of production-like data: an existing customer, an open work order and an SBR report for a past month read exactly as before (S4-E1, S5-E2), apart from the 10 known legacy customers and "N/A" → "Unassigned".
5. Permissions: a 'Work Orders — Create & Edit'-only role creating a customer from a work order (D14); `tech` sees plain text on the card (S1-N1).

### E2E tests

Policy: `e2e/.claude/reference/coverage-policy.md` — UI-affecting changes only (§9), `batchCap = 5` new workflows for this implementation run (§3), reference-breakage fixes uncapped and mandatory (§10). The reference updates are listed per phase above; the new workflows are below. Run `/e2e-after-change` before `/create-pr` on the final integration PR.

**Test: Split invoice credits each side in Sales By Representative** (N1, Happy path, S5-R1, S5-R3..R6, S5-R11, S5-R13, S5-R15, S5-R19, S5-R20, S8-R1, S8-R2) — `e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts`, runs after Phase 9, role owner
- *Setup (API factories):* fees and discounts on; reps A and B; a fresh customer with no default adjustments; a work order split Labor=A / Parts=B with a 6 h × $100 labor line, a $400 vendor part, shop supplies pinned at $30 and a whole-work-order $50 flat **taxable** discount (avoids the non-taxable clamp); read the work order's adjustments back to confirm no location-default fee; complete and invoice.
1. Open Sales By Representative (this month, Show Unassigned off).
2. Turn on the Sales Type column from the column selector.
3. Expand A, then B.
4. Narrow Sales Type to Parts.
- **Expected:** A and B each count the invoice once; Sales Type is offered first and A's row reads "Labor", B's "Parts"; A: Labor $600.00, Shop Supplies $30.00, Adjustments ($30.00), Subtotal $600.00, parts cells "—"; B: Parts $400.00, Adjustments ($20.00), Subtotal $380.00, labor / hours / supplies cells "—"; subtotals add to $980.00; after narrowing, the chip reads "Sales Type: Parts" and only B's row remains.

**Test: Split, change one side, reload, remove, then read-only once invoiced** (N2, Happy path + gate, S1-R13, S1-R14, S2-R4..R6, S2-R10, S2-R12, S2-R15..R17) — `e2e/tests/ui/work-orders/sales-rep-split.spec.ts`, runs after Phase 5, role owner
- *Setup:* rep A; a fresh customer with no rep; an open work order with a line; the work order's rep set to A via the API.
1. Hover the rep row, click `button_add_sales_rep`, then `item_add_sales_rep_parts`.
2. Pick "Unassigned" in the Parts field; wait for `group_sales_rep` `data-saving="false"`.
3. Reload.
4. Click `button_remove_sales_rep_parts`.
5. Split again, invoice via the API, reload.
- **Expected:** after step 1, two fields "Sales Representative - Labor" and "Sales Representative - Parts", both A, no + and an x; after step 2 Labor still A; after reload still split with Parts Unassigned; after remove one field reading A; after invoicing `sales_rep_labor_readonly` / `sales_rep_parts_readonly` show names and there is no + or x.

**Test: Customer default reps prefill new documents** (N3, Happy path, S4-R1, S4-R6..R9, S4-R16, S4-R19, S4-R24..R26) — `e2e/tests/ui/customers/customer-default-sales-reps.spec.ts`, runs after Phase 6, role owner
- *Setup:* reps A, B, C; a customer **without** an address (proves S4-R19's "every customer, address or not").
1. Edit Customer, open the + menu.
2. Add Service Parts; set Service Labor = A, Service Parts = B; add Part Sales = C; Save.
3. Reload the customer page.
4. Create a work order and a part sale for this customer via the API and open each.
- **Expected:** the menu lists "Sales Representative - Service Parts" then "Sales Representative - Part Sales"; adding Service Parts renames the first field "Sales Representative - Service Labor" with the same person; the customer page shows A / B / C under their labels in window order; the work order opens split with Labor A / Parts B; the part sale reads C with no +.

**Test: New Customer from a work order as a work-orders-only role** (N4, Edge case, S4 prerequisites, S4-R3, D14) — `e2e/tests/ui/customers/new-customer-sales-rep-wo-only-role.spec.ts`, runs after Phase 3
- *Setup:* a custom role with only 'Work Orders — Create & Edit'; an active rep A.
1. Log in as that role; New Work Order → add customer.
2. Pick A and save.
- **Expected:** the New Customer window stays open (no Access Denied); the rep field lists "Unassigned" first and then A; the saved customer holds A (verified via the API).

**Test: Printed work order names both sides** (N5, Happy path, S6-R2) — added to `e2e/tests/ui/work-orders/print-work-order.spec.ts`, runs after Phase 5
- *Setup:* reps A and B; a work order split Labor=B / Parts=A with a line; wait for `data-saving="false"` after any UI pick.
1. Print Work Order.
- **Expected:** the header row reads "Sales Representative: A (Parts) · B (Labor)".

#### Backlog (beyond `batchCap = 5`)
| Value rank | Workflow | Why deferred | Suggested file |
|---|---|---|---|
| 6 | Audit Log "Sales representative changed" for split / unsplit (S7-R1..R3) | FE render and BE entry each have dev tests; only the field-name seam needs E2E | `e2e/tests/ui/work-orders/sales-rep-audit-log.spec.ts` |
| 7 | Expanded CSV/PDF on a split invoice: Sales Type values, blank / dash uncredited cells (S5-R23) | Headers already pinned by the Phase 8 reference update | add to `e2e/tests/ui/reporting/sales-by-representative.spec.ts` |
| 8 | Split work order / reopen copies both reps (S4-R29, S2-E5) | Mostly BE functional | `e2e/tests/ui/work-orders/sales-rep-split-copy.spec.ts` |

A non-zero backlog does not satisfy the coverage hard-block on its own: either run the backlog in a later `/e2e-after-change` batch before the final PR, or record the `E2E-COVERAGE-OVERRIDE` marker with a reason.

#### TestRail sync
- **New cases (5):** N1 → "SBR — Work Order Sales Rep" (4327); N2, N5 → "Work Orders - Admin"; N3 → "Customers" (50); N4 → "Customers Permissions" (299). Mark Automated once the specs exist (`/testrail-push`).
- **Automated cases whose spec changes:** C30293, C30256, C30255, C154617, C30178, C30174, C30161, C30163, C38923, C30277, C30287, C30274.
- **Wording edits (not automated):** rename sections 4309 "SBR — Product Type Filter" and 4291 "SBC — Product Type Filter" to "… Sales Type Filter"; rewrite C30206 for Labor / Parts / Part Sales; retitle C30107 and C43591 to "Sales Type"; rewrite C30312 ("a new work order opens … unassigned" — now contradicts S4-R24); update C30265 (Sales Type first and off in the column selector), C30293 (Side column), C154617 (sale starts with the customer's rep).
- **Deletes:** none.
- Dev-layer coverage (`Test Layer = Dev`) for the money and rule cases lives in the unit / functional suites above (S5-R6..R8, S5-E1, S5-N1/N2, S4-R17/R18/R27, S1-N2, S2-E4, S4-R20/R21, S4-N3, S4-R23, S4-R28/R30, S7-R4/R5, S1-E1, S1-N3, S2-R6/R7, S2-N2, S5-R21/R22, S8-R3/R8, S4-R13/R14/E2).


## 8. Rollback Plan

| Phase | Revert code + `down()` | Data consequence |
|---|---|---|
| P1 | Drop `company_sales_representative`. Old code reads `company.sales_rep_*` again. | Every customer rep edit made since release is **lost**. Customers revert to their pre-release one rep (the legacy columns were frozen, not cleared). Service Parts and Part Sales fields disappear. Renames made in the meantime are not in the legacy names. No invoice or WO data is touched. Safer partial rollback: revert the code only and keep the table (no data loss; the old code ignores it). |
| P2 | No schema. | The assignments export goes back to one row per customer reading frozen legacy columns. Snapshot blobs written in the meantime keep the new key, which is harmless. |
| P3 | Drop `work_order.parts_sales_rep_id`, `sales_rep_split` (INSTANT). | Split WOs collapse to their Labor person, who is credited with the whole WO on future invoices. Log entries keep the appended fields, which old DTOs ignore positionally because they are appended last. Code-only revert (columns kept) is lossless. |
| P4 | No schema. | New WOs and part sales stop being prefilled. Existing data is unaffected. |
| P5 | Drop the 3 invoice columns (INSTANT). | Parts-side capture on invoices created since release is **lost**, and those invoices report wholly under the Labor rep. The captured Parts name is unrecoverable, though the Parts staff id could be re-derived from `work_order.parts_sales_rep_id` only while the WO is unchanged. Prefer a code-only revert, which keeps the columns. |
| P6 | No schema. | SBR goes back to a one-row-per-invoice Product Type report. Split invoices then credit the Labor rep only. Saved `salesTypes` links get ignored and fall back to `productType=all`. SBC labels revert. |

Release-order note: the integration branch merges to develop with the FE in one PR (D13), so there is no
window where the BE contract is live without the FE.

Frontend: every FE layer is code-only; reverting it restores the previous screen (with the matching BE layer reverted too, or the screen breaks at runtime). The SBR saved-view version bump cannot be un-done for users who already loaded the new version — reverting leaves them on defaults.

## 9. Security Considerations

- **Tenant scoping (NFR-001, 🔴 CRITICAL rule).** Every new query is organization-scoped: the child table through its `company` join + `OrganizationDecorator`; the picker, policy, warning count, export and snapshot through the organization predicate; the work order and SBR rep joins are re-scoped (D4) — fixing a pre-existing gap. A rep id pointing at another organization's staff now reads "(Inactive)" with no name (intended).
- **Input validation (NFR-002).** Customer rep ids must belong to the caller's organization; newly assigned reps must be active sales reps; names are derived server-side. The work order endpoint keeps its org-scoped work order lookup and checks eligibility for ids not already held (D15).
- **Authorization.** Work order rep writes stay behind `ROLE_WORK_ORDER_CREATE_AND_EDIT`; invoiced/paid work orders and part sales refuse changes (D7). The picker widens to work-order view, work-order create/edit and customer create/edit (D14) — it exposes only names + ids of the organization's active sales reps, which those roles can already see on the card. Reports keep `ROLE_REPORT_VIEW`; the Sales Type column holds no money (S5-R24), so existing money-visibility rules are unchanged.
- **Data exposure.** The public API still exposes no rep (rep-only customer changes do not stamp `updated_at`). The new binary invoice columns are stripped from `i.*` listings (NFR-004).
- **Golden Rule exemptions:** none.


### Risks and regression surface — backend

| # | Risk | Mitigation |
|---|---|---|
| R-1 | 🔴 `i.*` in `ListVehicleInvoices` leaks the new BINARY column, breaking `json_encode` and returning 500 (SV-9496 class). | P5 unsets it, and the functional test covers it. The smoke test also hits the vehicles listing. |
| R-2 | Doctrine runs INSERTs before DELETEs, so a remove+re-add of the same side violates `csr__company_id_side_unq`. | Mutate rows in place (§3.2), with a unit test. |
| R-3 | `NullableUuid::create(null)` mints a random UUID, which would persist a phantom rep. | Only `SalesRepId::from()` is used. The VO test asserts it. |
| R-4 | 🔴 History payload/DTO constructors are positional and APPEND-ONLY. | Append after `depositDate`; the resolver test asserts the deposit slots. |
| R-5 | `domain_event.bus` `allowNoHandlers=false`: deleting `ChangeSalesRepName` or renaming the deactivation subscriber aborts renames or deactivations. | Gate with `debug:messenger`. `ChangeStaffMemberName` remains a handler of `UserNameChanged`. Do not rename the deactivation subscriber. |
| R-6 | SQLite vs MySQL arithmetic divergence in the share SQL. | P-7 helper + MySQL throwaway run (§8.4). |
| R-7 | Raw-SQL fixtures insert `company` rows without a primary child row. | Readers default a missing primary to Unassigned (§3.2, §3.6). |
| R-8 | D4 behavior change: a WO whose `sales_rep_id` points at another org's staff now reads "(Inactive)" with no name, where it used to print a foreign name. | Intentional (security). Called out in the PR. |
| R-9 | Split invoices double the report rows, so the Expanded 10k cap is reached sooner. The largest org has 9,674 invoices in 12 months, giving at most about 20k side rows/year in SQL. | The SQL cost is trivial at this volume (one scan of the `(organization_id, created_on)` range). The cap behavior is unchanged in kind; mention it in the PR. |
| R-10 | Release-day behavior change: every new WO and part sale is prefilled from the customer (S4-R24..26). | It is PRD-intended. Part sales on Counter Sale stay Unassigned. |
| R-11 | Sales Follow-Up report goes stale (frozen legacy columns). | Out of scope and not loadable today. The follow-up ticket drops the columns and repoints or removes the report. |
| R-12 | Shared code: `WorkOrderDetailsFetcher` feeds the WO card, the part-sale card, print, the history snapshot and the invoice snapshot. `ChangeSalesRep` serves part sales (#3369). `InvoiceBuilder` serves every invoice and the preview. `Company` has 64 constructor sites, plus the accounting outbox payload builders. | Regressions to verify: the part-sale rep change, lock message and log are unchanged; part-sale invoices are captured as before; invoice preview works; the accounting `CustomerUpdated` payload is unchanged (it reads no rep); the Counter Sale create is unchanged; the deactivation flow is unchanged. |
| R-13 | Public API `updated_since` is not stamped by rep-only customer changes. | Correct, because no API field changed (P-1 docblock). Tested in `CompanyAuditStampWritePathTest`. |

### Risks and blast radius — frontend

- **OrderStatusCard is shared by three card types.** The part-sale rep path is rewired onto the new component (one save
  path, and it gains the S1-E1 fix). Regression scenarios: part-sale pick + `fetchWorkOrder` refetch + loading bracket;
  Part Sales-only role never requests `sales-reps` (403 trap, keep the watch); imported card unaffected; vehicle-here toggle,
  lead tech and advisor untouched. Keep every existing part-sale test id.
- **Dropping the optimistic cache patch** changes SV-9936 semantics: the card no longer writes `sales_rep_id` into the
  TanStack/Vuex cache before the server answers. Any other reader of `workOrder.sales_rep_id` (print) sees the change only
  after the awaited invalidation, which is the correct (saved) value.
- **CustomerDialog is shared by four hosts** (Customer page, Customers list, WO dialog, part-sale dialog). The option fetch
  now runs in create mode. Without C1 this is an AccessDenied ejection for WO-only and part-sales-only roles. Also verify
  the Customers-list redirect after create and the contact dialog chain still run.
- **FilterChip / FilterDef are used by ~15 screens.** Both new fields are opt-in; the P0 regression test pins old behaviour.
- **SBR remembered-view bump** wipes every user's SBR columns and sort once (intended, release-day note).
- **Old WO history snapshots** lack `sales_rep_split`; treated as not split. Old history entries lack C4 fields; rendered as today.
- **Mid-stack runtime**: P2/P4/P5 compile against the new contract; merging a FE phase before its BE phase breaks that screen
  at runtime with a green build. Enforce the BE-first order on the integration branch.
- **Duplicate test ids on SBR**: `link_sbr_invoice_<id>` / `text_sbr_customer_<id>` / `badge_sbr_payment_<id>` now repeat when
  two reps holding one invoice are both expanded. Existing E2E that expands more than one rep must scope by rep; the new
  Sales Type cell id includes the sales type.
- **Label case change** "Sales representative" -> "Sales Representative" on the WO card may break text-based E2E locators.
- **Customer dialog option ids change** from `option__<id>` to `option_customer_sales_rep_<id>` (the old form was a bug).

## 10. Requirement Traceability

Every FR (all 138 PRD IDs) and NFR appears below. Generated from the phase mapping and checked mechanically: no PRD ID is missing.

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R4 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R5 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R6 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned — verify-and-fix (Section 0) |
| S1-R7 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R8 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R8 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S1-R9 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R10 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R11 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R12 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R13 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R13 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S1-R14 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-R15 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-N1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S1-N1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-N2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S1-N2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-N3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-E1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S1-E2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S1-E2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R1 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R2 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R3 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R4 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R4 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R5 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R5 | Phase 5 | E2E | e2e/tests/ui/work-orders/sales-rep-split.spec.ts (N2) | Planned |
| S2-R6 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R6 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-R6 | Phase 5 | E2E | e2e/tests/ui/work-orders/sales-rep-split.spec.ts (N2) | Planned |
| S2-R7 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R8 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R8 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R9 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S2-R9 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R10 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R11 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R12 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-R12 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R13 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S2-R13 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S2-R14 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R15 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-R15 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R15 | Phase 5 | E2E | e2e/tests/ui/work-orders/sales-rep-split.spec.ts (N2) | Planned |
| S2-R16 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-R16 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R16 | Phase 5 | E2E | e2e/tests/ui/work-orders/sales-rep-split.spec.ts (N2) | Planned |
| S2-R17 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-R17 | Phase 5 | E2E | e2e/tests/ui/work-orders/sales-rep-split.spec.ts (N2) | Planned |
| S2-N1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-N1 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S2-N1 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S2-N2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-N2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-E1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-E1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-E2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-E2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-E3 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-E3 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S2-E4 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S2-E4 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S2-E4 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S2-E5 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S3-R1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S3-R2 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S3-R2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S3-R3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S3-R4 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S3-R4 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S3-R5 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S3-R6 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S4-R1 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R1 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R2 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R2 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R3 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R3 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R3 | Phase 3 | E2E | e2e/tests/ui/customers/new-customer-sales-rep-wo-only-role.spec.ts (N4) | Planned |
| S4-R4 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R5 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R6 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R7 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R7 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R7 | Phase 6 | E2E | e2e/tests/ui/customers/customer-default-sales-reps.spec.ts (N3) | Planned |
| S4-R8 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R9 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R9 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R10 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R11 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R11 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R12 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R12 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R13 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R13 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R14 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R14 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R15 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R16 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R17 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S4-R18 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S4-R19 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R19 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-R19 | Phase 6 | E2E | e2e/tests/ui/customers/customer-default-sales-reps.spec.ts (N3) | Planned |
| S4-R20 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R21 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R22 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R23 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R24 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R25 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R25 | Phase 6 | E2E | e2e/tests/ui/customers/customer-default-sales-reps.spec.ts (N3) | Planned |
| S4-R26 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R26 | Phase 6 | E2E | e2e/tests/ui/customers/customer-default-sales-reps.spec.ts (N3) | Planned |
| S4-R27 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R28 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R29 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R30 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R30 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R31 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R31 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S4-R32 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-R32 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S4-N1 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S4-N2 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-N3 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-E1 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-E1 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S4-E2 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| S4-E2 | Phase 3 | App | app/src/components/ts/customers/{CustomerDialog,CustomerSalesRepFields,CustomerLeftSection}.vue, customerSalesReps.ts | Planned |
| S5-R1 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S5-R2 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S5-R2 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R3 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R4 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R5 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R6 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R6 | Phase 9 | E2E | e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts (N1) | Planned |
| S5-R7 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R8 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R9 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R10 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R10 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R11 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R11 | Phase 9 | E2E | e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts (N1) | Planned |
| S5-R12 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R12 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R13 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R13 | Phase 9 | E2E | e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts (N1) | Planned |
| S5-R14 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R14 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R15 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R15 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R15a | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R15a | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R16 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R16 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R17 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R17 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R18 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R19 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R19 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R19 | Phase 9 | E2E | e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts (N1) | Planned |
| S5-R20 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R21 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R22 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-R23 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R24 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-R24 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S5-N1 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-N2 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-E1 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S5-E2 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| S5-E2 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S6-R1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S6-R1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S6-R2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S6-R2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S6-R2 | Phase 5 | E2E | e2e/tests/ui/work-orders/print-work-order.spec.ts (N5) | Planned |
| S6-R3 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S6-R3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S6-R4 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S6-R4 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S6-N1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S6-N1 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S7-R1 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S7-R2 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S7-R2 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S7-R3 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S7-R3 | Phase 5 | App | app/src/components/ts/work-orders/sales-rep/{WorkOrderSalesRepFields.vue,useWorkOrderSalesReps.ts}, components/shared/OrderStatusCard.vue, print/buildPrintModel.ts, history/AuditLogDialog.vue | Planned |
| S7-R4 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| S7-R5 | Phase 6 | API | api/src/VehicleService/WorkOrders/Application/Service/SalesRep/CustomerSalesRepresentativeDefaults.php, Create/*, PartSale/Create/*, SplitWorkOrder/*, PartSaleSplitter.php, PayedWorkOrderReopenedSubscriber.php | Planned |
| S8-R1 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S8-R1 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S8-R2 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S8-R2 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S8-R2 | Phase 9 | E2E | e2e/tests/ui/reporting/sbr-split-invoice-credit.spec.ts (N1) | Planned |
| S8-R3 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S8-R3 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S8-R4 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S8-R4 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S8-R5 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| S8-R5 | Phase 9 | App | app/src/components/ts/reporting/sales-by-representative/{Model.ts,SalesByRepresentativeReport.vue} | Planned |
| S8-R6 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-R7 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-R8 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-R9 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-R9 | Phase 1 | API | api/src/Reporting/Reports/Application/SalesByCustomer/Export/SalesByCustomerExportQueryHandler.php, UI/HTTP/SalesByCustomer/SalesByCustomerExportController.php | Planned |
| S8-R10 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-N1 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| S8-E1 | Phase 1 | App | app/src/components/ts/shared/IconActionButton.vue, shared/sales-rep/AddRepresentativeButton.vue, shared/filters/FilterChip.vue, css/app.scss, reporting/sales-by-customer/* | Planned |
| NFR-001 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| NFR-001 | Phase 8 | API | api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalSalesByRepresentativeFetcher.php, Application/SalesByRepresentative/* | Planned |
| NFR-002 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| NFR-003 | Phase 2 | API | api/src/Customer/Customers/Domain/{Company,CompanySalesRepresentativeAssignment,CompanySalesRepresentatives}.php, Application/{Create,Change,View}/*, Staff/Staff/Application/SalesReps/*, Reporting/Export/Application/SalesRepAssignmentsExport/* | Planned |
| NFR-003 | Phase 4 | API | api/src/VehicleService/WorkOrders/Domain/{WorkOrder,WorkOrderSalesRepresentatives}.php, UI/HTTP/ChangeSalesRep/*, Application/ChangeSalesRep/*, Domain/Service/WorkOrderDetailsFetcher.php | Planned |
| NFR-003 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |
| NFR-004 | Phase 7 | API | api/src/Invoicing/Invoice/Domain/Invoice.php, Application/Service/InvoiceSalesRepResolver.php, Application/HTTP/Builder/InvoiceBuilder.php | Planned |

## 11. Verification Tickets

Created 2026-10-15 under epic SV-10890 (Task, linked "Relates" to each listed story). Each ticket holds its phase's verification checklist.

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-11384](https://shopview.atlassian.net/browse/SV-11384) | Verify Phase 1 - Shared UI pieces + Sales By Customer relabel | Phase 1 / S8-R6..R10, S8-N1, S8-E1 | SV-11272 | Nemanja Djuric |
| [SV-11385](https://shopview.atlassian.net/browse/SV-11385) | Verify Phase 2 - Customer representatives (backend) | Phase 2 / S4 (BE), S1-R8; NFR-002, NFR-003 | SV-11268, SV-11265 | Nemanja Djuric |
| [SV-11386](https://shopview.atlassian.net/browse/SV-11386) | Verify Phase 3 - Customer dialog + customer page (frontend) | Phase 3 / S4-R1..R16, S4-R19, S4-E1/E2, S3-R5 | SV-11268, SV-11267 | Nemanja Djuric |
| [SV-11387](https://shopview.atlassian.net/browse/SV-11387) | Verify Phase 4 - Work order split model, endpoint and log (backend) | Phase 4 / S1/S2 server rules, S4-R32, S6 data, S7-R1..R4; NFR-001, NFR-003 | SV-11265, SV-11266, SV-11270, SV-11271, SV-11268 | Nemanja Djuric |
| [SV-11388](https://shopview.atlassian.net/browse/SV-11388) | Verify Phase 5 - Work order card, print and audit log (frontend) | Phase 5 / S1-R1..R15, S1-N1..N3, S1-E1/E2, S2 UI, S3, S6, S7-R2/R3 | SV-11265, SV-11266, SV-11267, SV-11270, SV-11271 | Nemanja Djuric |
| [SV-11389](https://shopview.atlassian.net/browse/SV-11389) | Verify Phase 6 - Copy representatives onto new, split and reopened documents | Phase 6 / S4-R24..R31, S2-E5, S2-N1, S7-R5 | SV-11268, SV-11266, SV-11271 | Nemanja Djuric |
| [SV-11390](https://shopview.atlassian.net/browse/SV-11390) | Verify Phase 7 - Invoice capture of both representatives | Phase 7 / S5-R1/R2, S4-R17/R18, S4-N1, S2-E3/E4; NFR-003, NFR-004 | SV-11269, SV-11268, SV-11266 | Nemanja Djuric |
| [SV-11391](https://shopview.atlassian.net/browse/SV-11391) | Verify Phase 8 - Sales By Representative per side (backend) | Phase 8 / S5-R2..R24, S5-N1/N2, S5-E1/E2, S2-R13, S8-R1..R5 (API); NFR-001 | SV-11269, SV-11272, SV-11266 | Nemanja Djuric |
| [SV-11392](https://shopview.atlassian.net/browse/SV-11392) | Verify Phase 9 - Sales By Representative screen (frontend) | Phase 9 / S5-R12..R22 (UI), S8-R1..R5 | SV-11269, SV-11272 | Nemanja Djuric |

When all these tickets are marked Done, the feature is ready for QA.