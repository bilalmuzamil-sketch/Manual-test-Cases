# Work Orders — Board View & Tech View Display Options — PRD v33 (source capture)

**Confluence page:** 845185030 · **Status:** Epic Owner Sasha Grosman Status In development: PRD v33, 2026-09-28. Remaining d...
**Owner:** Sasha Grosman · **Epic:** SV-10043 · **Last modified:** yesterday at 9:42 PM ·
**Captured:** 2026-09-30 (verbatim body below). Supersedes the draft-v0.9 capture
(CONFLUENCE-845185030-WO-BoardView-TechView-Draft-v0.9-2026-09-23.md), kept as history.
Verbatim anchor map: ../anchor-quotes.json (v33, 204 anchors).

---

| **Epic** | [SV-10043](https://shopview.atlassian.net/browse/SV-10043) |
| --- | --- |
| **Owner** | Sasha Grosman |
| **Status** | In development: PRD v33, 2026-09-28. Remaining design items with Branko are tracked on the review child page. |
| **Design** | [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share) (Branko Cicovic) |
| **Design authority** | Sasha Grosman |
| **Sources** | Design Review 2026-09-01 (Sasha, Branko, Fabian) · Branko/Sasha 2026-09-03 · Fabian/Sasha 2026-08-26 · Design Review 2026-08-25 · #fs-global-search brief 2026-08-27 |

# Work Orders — Board View & Tech View Display Options

**Latest review:** [Tech View / Kanban live review](https://notes.wisprflow.ai/shared/gyvwCos_zNhCOMwwuYaGEe1gbcrp-4zs8ycYEITIzL4), September 14, 2026 (Pacific), raw transcript t0001–t0036. Decisions below are from the design authority; implementation and remaining design work are tracked separately. [Review table and UX follow-ups](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

## 1. Business Case

The Work Orders page is one long scrollable list. A dispatcher, foreman, or shop manager who wants to know *who is working on what*, *who has capacity*, and *what is still unassigned* has to scroll and read row by row, then open each work order to change the lead technician. Competing products demo a board-style view of work orders and it lands well with prospects; our sales team has asked for the same.

This spec adds two new **display options** to the Work Orders page — a **Tech View** (the familiar table, grouped under each lead technician) and a **Board View** (one column per lead technician) — plus the shared controls that make them usable: choosing which fields appear, choosing density, and reassigning the lead technician by drag-and-drop. Shops pick the display option that fits their size. List remains the default and stays exactly as it is in production today; the only addition to the Work Orders page is the switcher that offers the two new displays.

## 2. Feature Overview

**Core ShopView**

- The Work Orders page gains a display-option switcher with three choices: **List** (today’s table), **Tech View**, and **Board View**. The user's choice is remembered, so the page reopens in the display option they last used.
- The existing **filter views** (the tabs on the left — All, Work Orders, Estimates, Completed) and the filter bar (search, status, assigned to me, and so on) apply the same way in every display option. Switching display option never changes *which* work orders are shown, only *how* they are laid out.
- **Tech View** groups the work order table under each lead technician, with an Unassigned group for work orders that have no lead technician. All table columns remain available.
- **Board View** shows one column per lead technician plus a fixed Unassigned column; each work order is a card. Users can pin up to three technicians, with the same pins shared between Tech View and Board View.
- In both new display options, users can **reassign or unassign the lead technician** by dragging a work order to another technician (or to Unassigned), or through a reassign action on the work order. A confirmation toast is shown.
- **Fields to display** lets the user choose which fields appear on Board View cards; Tech View has its own column chooser. List keeps its existing column chooser exactly as today.
- **Density** lets the user choose Compact, Regular (default), or Comfortable spacing in Tech View and Board View. One density selection is shared by the two. List keeps today’s row size.
- Board View cards and Tech View rows can show the technicians assigned to individual lines as a small avatar group, with names on hover.
- The check-mark indicator that appears on a work order line when a tech story has been entered is removed.

**Out of Scope**

- A Board View grouped by status (columns per work order status). This spec's Board View groups by lead technician only.
- Changes to the assignment model itself (for example, assigning one work order to several technicians at the work order level). The current model — one lead technician per work order, technicians per line — ships as-is; we will gather feedback first.
- Parts-state indicators on Board View cards (waiting on parts, parts requested, ready to order, in stock). These belong to a parts-focused view; "Waiting on parts" is deliberately *not* shown on cards.

## 3. Jobs to be Done / Goals

- **When** I am planning the shop's day, **I want to** see every technician's work orders side by side, including what is still unassigned, **so I can** balance the load without opening each work order.
- **When** a technician is overloaded or out, **I want to** move a work order to someone else in one motion, **so I can** keep the floor moving.
- **When** I run a small shop, **I want to** glance at a board and know where every job stands, **so I can** answer customers and plan without reading a table.
- **When** I open Work Orders, **I want** the page to come up the way I left it, **so I** don't rebuild my view every morning.

**Goals**

- Reassigning a lead technician takes one action from the board or grouped table.
- Unassigned work remains reachable when it extends beyond the viewport, except when excluded by “Assigned to me” or the current filters.
- Value with zero setup: the defaults work; configuration (fields, density, pins) is optional and remembered per user.
- List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher.

## 4. Key Decisions

- **Terminology.** The tabs on the left of the Work Orders page are **filter views** (predefined filter sets). The controls on the right — List, Tech View, Board View — are **display options**. (2026-09-03)
- **Group by lead technician only.** Tech View groups and Board View columns represent the work order's lead technician. Technicians assigned to individual lines do not get their own group or column; they appear as avatars on the card/row instead. (2026-09-03)
- **Ship the current assignment model as-is** and gather user feedback before revisiting work-order-level multi-technician assignment. (2026-09-03)
- **Fields vs. density are separate controls.** Board View has Fields to display plus a separate Density control; Tech View has its own column chooser plus Density. Density changes spacing and element sizing only; it never hides fields. Options are Compact, Regular (default), Comfortable; Simple / Detailed presets do not ship. List has neither new control and stays as it is in production.
- **Unassigned column is fixed** on Board View so it stays visible while scrolling through technicians horizontally; technician names stay pinned at the top while scrolling vertically. Rationale: 5–7 work orders per technician is normal, but 25+ unassigned is plausible and would otherwise push technicians off screen. (2026-09-01)
- **Pin cap of three technicians.** Tech View and Board View use one shared set of up to three pins per user. This September 14 decision replaces the earlier five-pin cap.
- **"Waiting on parts" is removed from Board View cards.** It is one of roughly four parts states; showing one without the others misleads parts staff, and this is not the screen parts staff will work from. (2026-09-03)
- **More-actions appears as a hover overlay** on the card so the status badge sits in a fixed spot instead of floating. (2026-09-03)
- **Default display option remains List.** Existing users see no change until they choose otherwise.
- **Permissions.** Work Orders view permits viewing all four filter tabs and reordering technician groups/columns. Dragging work orders and changing lead technicians require Work Orders create and edit. No new permission is introduced.
- **Manual ordering is in scope, and the order of work orders is shared.** Work orders can be reordered within a technician or moved between technicians. That order is the shop’s priority plan, so it is saved once per location and everyone at the location sees the same order, in Tech View and Board View alike. Technician groups/columns can also be reordered, and that order, like pins, is saved per user because it is personal layout. Work that gets a new lead from the Reassign dialog or the work order detail page goes to the bottom of the new technician’s list; a work order dragged to a technician goes where it is dropped. New technicians are added after the existing unpinned technicians. (Chris, 2026-09-25: the dispatcher’s plan has to reach the technicians, advisors and owner who read it, which a per-user order cannot do.)
- **No feature flag.** The 2026-09-13 PM revision includes this feature without a flag; List remains the default.
- **The technician picker is the eligibility boundary, not the API.** The set of technicians offered for a lead assignment (S2-R7, S3-R1) is what enforces eligibility. The lead-assignment endpoint deliberately does **not** re-validate the chosen technician against active status, location, or role, and no server-side validation is added by this spec. This follows the platform's existing front-end-as-boundary policy. Consequence to accept knowingly: a caller that bypasses the UI can set an ineligible technician, and today production accepts any well-formed identifier on this endpoint. This is acceptable while the API is consumed only by our own front end, and must be revisited if a public API is exposed. (2026-09-13)
- **Lead technician cannot be changed once a work order is Invoiced or Paid.** This is a product rule, not only a screen rule, so it must hold on every path that changes the lead technician — board drag, Reassign dialog, and the work order detail page. Production currently enforces this only in the interface; the underlying endpoints accept the change in Invoiced and Paid today. Implementing this rule server-side is in scope for Story 4. (2026-09-13)
- **Deactivating a technician does not change work orders they already lead.** They remain the lead technician on those work orders so the work stays visible and attributable; they simply receive no new assignments (S2-N2, S3-N2, S3-E3). This preserves today's behavior deliberately; no sweep or reassignment is triggered by deactivation. (2026-09-13)

Questions, answers and status live on the [review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions); Section 7 links there.

- **Optional clearing of work-order shifts.** Changing the lead in Board View or Tech View asks whether to clear the outgoing lead’s work-order-level scheduled shifts. Clearing is an explicit user choice; line-level shifts and active, recorded, or locked time remain protected. Schedule changes do not change the work order lead. This resolves the prior prompt-scope uncertainty. *Basis: DR-31, direct owning-PM instruction, 2026-09-14.*

## 5. Terminology

- **Tech View** → In this spec, a *display option* on the Work Orders page that groups the work order table by lead technician. It is distinct from the “Tech View” terminology used in roles and permissions. Where both could be confused, this document says "Tech View display option".
- **Filter view** → One of the tabs on the left of the Work Orders page (All, Work Orders, Estimates, Completed). Each is a predefined set of status filters.
- **Display option** → How the filtered work orders are laid out: List, Tech View, or Board View.
- **Board View** → A board with one column per lead technician, not per work order status. Name confirmed by the design authority 2026-09-21, superseding the “Column View” candidate from the September 14 review; Branko still owns the Tech View icon ([SQ-8](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions)).
- **Technician** → A staff member who meets all four criteria: Clockable is enabled; the staff record is Active; their role is neither Office nor Time Clock User; and they are enrolled in the current location. Billable is not a criterion. These criteria control eligible new assignments and the normal technician groups/columns; matching work already led by an inactive technician remains visible under S2-N2/S3-N2.
- **Implicit line assignment** → An assignment inherited when a lead technician is assigned to otherwise unassigned work order lines. **Explicit line assignment** → A technician manually assigned to a specific work order line. Lead changes may update implicit assignments; explicit assignments are preserved.
- **Logged labor** → Recorded technician time against a work order line. A line with logged labor is treated as work already performed by a specific person and is never moved by a lead technician change (S4-R8).
- **Lead Technician** → The single technician assigned to the work order as a whole. Distinct from **line technicians**, who are assigned to (and clock into) individual work order lines.
- **Fields to display** → Which pieces of information appear on a Board View card. **Density** → Spacing and sizing of rows and cards (padding, margins, line height, and in-row/card elements) in Tech View and Board View (List is unchanged); it never changes which information is shown. Design must define the three variants without reducing text below the application’s minimum body size.

## 6. Assumptions

No separate operating assumptions are required. Preference, technician-eligibility and assignment behavior are requirements in Stories 1–6 and 9. Unsettled behavior is tracked on the [review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

## 7. Review decisions

Questions, answers, assignees and Open/Answered status are maintained on the [Review Decisions and Open Questions child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions). Related requirements below link to the consolidated entries there.

## 8. Requirements

### Story 1: Switch between display options

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** Work Orders page user, **I want** to switch between List, Tech View, and Board View **so that** I can look at the same work orders in the layout that suits my task.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10044](https://shopview.atlassian.net/browse/SV-10044)

**Prerequisites:**

- User has Work Orders view permission.

**Requirements:**

- **S1-R1:** The Work Orders toolbar offers List, Tech View, and Board View display options.
- **S1-R9:** The switcher visually indicates the active display option.
- **S1-R2:** List is the default display option for every user until they choose another.
- **S1-R3:** Switching display options immediately re-lays out the current results without changing the filter view, search text, or filters.
- **S1-R4:** Save the selected display option per user. It follows the user after logout/login, on other devices, and in other locations.
- **S1-R11:** Apply existing search, filter persistence, and result-set rules in all three displays.
- **S1-R7:** When the user switches back to List, it uses the List sort they last chose there (for example, by Created date). The manual order from Tech View and Board View never changes the List sort (S9-R13).
- **S1-R8:** In Tech View and Board View, browser Back restores both vertical and horizontal scroll position. List behaves as it does today.
- **S1-R12:** In Tech View and Board View, opening a filter view any way other than browser Back (for example clicking its tab, a link, or a menu item) starts scrolled to the top and all the way to the left. List behaves as it does today.
- **S1-R13:** With Assigned to me enabled, show only the work orders that match the existing Assigned to me rules, in every display option.
- **S1-R14:** The display options follow the same screen-width switch the List uses in production today. On a screen narrower than 1024px, the Work Orders page shows List exactly as it does today (the phone card layout), with no display switcher. At 1024px and wider, Tech View and Board View are offered, whatever the device: a tablet held sideways at 1024px or wider gets them too. The switch is by screen width only; the app never detects the device type.

**Negative Cases:**

- **S1-N1:** When filters return no results, show the existing List empty state and Clear filters action in every display: “No work orders match your filters”.
- **S1-N2:** If a display preference cannot load, fall back to List.
- **S1-N3:** A failed preference save retains the previously saved preference.
- **S1-N4:** A failed preference save does not prevent view switching or retrying the save.
- **S1-N5:** For the same user in simultaneous tabs, the last preference request wins.

**Edge Cases:**

- **S1-E2:** Changing location opens that location’s existing default page.
- **S1-E3:** Assigned to me resets on location change, as it does today.

### Story 2: Tech View — table grouped by lead technician

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** dispatcher or shop manager, **I want** the work order table grouped under each lead technician **so that** I can see each person's load with full work order detail.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10045](https://shopview.atlassian.net/browse/SV-10045)

**Prerequisites:**

- User has Work Orders view permission and has selected Tech View (Story 1).

*\* Context note: dragging work orders also needs the Work Orders create and edit permission. That rule lives in Story 9.*

**Requirements:**

- **S2-R1:** Group work orders by lead technician with visible separators.
- **S2-R12:** Each group header shows the technician’s name, avatar, and a count of the work orders currently shown in that group, after the filter view and filters are applied, so the count always matches the rows listed.
- **S2-R2:** Keep Unassigned, containing work orders without a lead technician, fixed before all technician groups.
- **S2-R3:** Initially sort technicians by first name A–Z, then last name A–Z. Technicians with identical names are ordered by when their user account was created, oldest first and newest last.
- **S2-R4:** Tech View offers the same columns as List, plus the Assigned Techs column (Story 7), through its own column chooser (Story 5).
- **S2-R5:** Allow each technician group to be collapsed or expanded.
- **S2-R13:** Save group collapse state per user. It is kept after refreshes, logout/login, new tabs, and reopening the page.
- **S2-R6:** Before a manual order is saved, use the List’s default work order sort.
- **S2-R7:** Include staff who are Clockable, Active, enrolled in the current location, and whose role is neither Office nor Time Clock User.
- **S2-R14:** Show every eligible technician even without matching work, except while Assigned to me is enabled (S2-R9), subject to the filtered-empty state in S1-N1.
- **S2-R15:** A technician group with no work orders under the current filters, and an empty Unassigned group, show the text “No work orders”.
- **S2-R8:** Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag.
- **S2-R10:** Hovering a technician header or avatar reveals the technician’s name.
- **S2-R11:** Allow up to three pinned technician groups in Tech View.

**Negative Cases:**

- **S2-N1:** When Unassigned has no work, the group stays on screen with its empty state as a drop target, except while Assigned to me is enabled (S2-R9), and following S1-N1 when no work orders match the filters.
- **S2-N2:** Keep matching work visible under its deactivated lead technician.
- **S2-N3:** Indicate deactivated technicians as inactive in group headers.

**Edge Cases:**

- **S2-E1:** Keep the technician group header visible while scrolling within a tall group.
- **S2-E2:** After a lead change elsewhere, move the work order to its new technician group on the next refresh.

**Additional Tech View requirements:**

- **S2-R9:** With Assigned to me enabled, Tech View shows only the technician groups, including Unassigned, that hold at least one work order matching Assigned to me (S1-R13). Every other group is hidden, including pinned technicians.

### Story 3: Board View — board by lead technician

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** shop owner or foreman, **I want** a board with a column per technician **so that** I can see at a glance who has what and what is unassigned.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10046](https://shopview.atlassian.net/browse/SV-10046)

**Prerequisites:**

- User has Work Orders view permission and has selected Board View (Story 1).

*\* Context note: dragging work orders also needs the Work Orders create and edit permission. That rule lives in Story 9.*

**Requirements:**

- **S3-R1:** Show one Board View column per eligible technician under S2-R7, plus Unassigned.
- **S3-R12:** Each column header shows the technician’s name, avatar, and a count of the work orders currently shown in that column, after the filter view and filters are applied, so the count always matches the cards listed.
- **S3-R2:** The Unassigned column is the first column and is **fixed**: it stays in place while the user scrolls the technician columns horizontally.
- **S3-R3:** Column headers (technician names and counts) stay pinned at the top of the board while the user scrolls vertically, so long columns never hide whose column is being viewed.
- **S3-R4:** Board View cards include the mandatory fields specified in S5-R3.
- **S3-R5:** Keep each card’s status badge in a fixed position.
- **S3-R13:** Reveal the card’s more-actions overlay on hover or keyboard focus.
- **S3-R14:** Include Reassign lead technician in the card’s more-actions menu.
- **S3-R6:** Clicking a card (outside the more-actions control) opens the work order.
- **S3-R7:** Allow users to pin a technician from the column header.
- **S3-R15:** Place pinned technicians after fixed Unassigned and before unpinned technicians.
- **S3-R16:** Append each newly pinned technician after the existing pins.
- **S3-R17:** Share the same saved pin selection between Tech View and Board View.
- **S3-R18:** Persist pins per user across sessions, logout/login, and devices.
- **S3-R8:** At three pinned technicians, disable other pin controls with: “You can pin up to 3 technicians.”
- **S3-R19:** Unpinning frees a slot in both Tech View and Board View.
- **S3-R9:** Keep empty eligible technician columns visible as drop targets, except while Assigned to me is enabled (S3-N1), subject to S1-N1.
- **S3-R22:** Keep the Unassigned column visible even when it has no work, showing its empty state, so work orders can be dragged to it. This follows S3-N1 while Assigned to me is enabled, S1-N1 when no work orders match the filters, and the same rule as Tech View (S2-N1).
- **S3-R20:** A technician column with no work orders under the current filters, and an empty Unassigned column, show the text “No work orders”.
- **S3-R21:** Do not offer a control to hide empty eligible technician columns.

**Negative Cases:**

- **S3-N1:** With Assigned to me enabled, Board View shows only the technician columns, including Unassigned, that hold at least one work order matching Assigned to me (S1-R13). Every other column is hidden, including pinned technicians.
- **S3-N3:** Do not offer pinning while Assigned to me is enabled.
- **S3-N2:** Keep matching work visible in its deactivated technician’s column.
- **S3-N4:** Show an inactive indicator on deactivated technician columns.

**Edge Cases:**

- **S3-E1:** Every Board View column, including Unassigned, scrolls vertically on its own when its cards exceed the available viewport, while adjacent columns and pinned headers remain visible. The page itself does not scroll vertically; only the content inside each column does.
- **S3-E2:** Allow horizontal scrolling when technician columns exceed the available viewport; never hide technicians automatically.
- **S3-E3:** Retain a technician’s pin after deactivation.
- **S3-E5:** Allow users to manually unpin deactivated technicians.
- **S3-E4:** Keep all selected card content reachable by scrolling, regardless of card height or density.

**S3-R11:** Provide the shared Density control from Story 6 in Board View.

### Story 4: Reassign or unassign the lead technician from the board or grouped table

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** dispatcher, **I want** to move a work order to another technician (or back to Unassigned) directly from Tech View or Board View **so that** rebalancing work takes one action.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10047](https://shopview.atlassian.net/browse/SV-10047)

**Prerequisites:**

- User is in Tech View or Board View.
- User has Work Orders view permission and the existing Work Orders create and edit permission. No new permission is introduced.
- The work order status is Estimate, Approved, In Progress, Review, Complete, or Declined. The lead technician cannot be changed in Invoiced, Paid, or Imported.

**Requirements:**

- **S4-R1:** Apply this story’s reassignment rules to the drag interactions in Story 9.
- **S4-R4:** The card or row more-actions menu opens the Reassign lead technician dialog.
- **S4-R12:** The dialog offers eligible active technicians in the current location and Unassigned.
- **S4-R13:** Confirming the dialog changes the lead to the selected technician or Unassigned.
- **S4-R14:** Canceling the dialog leaves the lead unchanged.
- **S4-R15:** The dialog’s N open count includes Approved, In Progress, Ready for Review, and Complete work orders.
- **S4-R5:** After successful reassignment, show “Lead technician updated”; after unassigning, show “Lead technician removed”.
- **S4-R16:** Success toasts dismiss automatically.
- **S4-R6:** Preserve existing work order detail-page notification behavior when the lead technician changes.
- **S4-R7:** Counts in column/group headers update immediately after a successful change.
- **S4-R8:** Apply the line-movement rules below on every path that assigns, changes, or removes the lead technician.

| Work order line | Moves to the incoming lead technician? |
| --- | --- |
| Has no technician assigned | **Yes** |
| Assigned to the outgoing lead technician (an implicit assignment) | **Yes** |
| Explicitly assigned to a different technician | **No** — the explicit assignment is preserved |
| Status is Complete | **No** |
| Has logged labor against it | **No** |
| Has an active clock-in on the line, including an implicit assignment with no previously logged labor | No — preserve the clock-in and that technician’s line assignment |

- Removing the lead technician follows the same table: lines that were following the outgoing lead return to unassigned, and every other line is left as it is.
- Selecting the technician who is already the lead makes no assignment change (S4-N4).
- Acceptance criteria must cover all six rows for assign, reassign and remove. Any No condition overrides a Yes condition. Explicitly test active clock-in with zero previously logged labor as well as Complete and logged-labor exclusions.
- **S4-R9:** Every lead-change path records one audit entry with the previous lead, new lead, logged-in actor, and time.
- **S4-R17:** Do not create separate audit entries for implicit line movements caused by a lead change.
- **S4-R18:** Continue existing line auditing for technician changes made directly on a work order line.
- **S4-R10:** Enforce the prohibited-status rule in S4-N2 on every lead-change path, including requests that bypass interface controls.
- **S4-R11:** When changing the lead technician in Board View or Tech View, ask whether to clear the outgoing lead’s work-order-level scheduled shifts.
- **S4-R19:** Moving, resizing, or reassigning a shift on the Schedule does not change the work order’s lead technician. This is how the Schedule behaves today, and it stays that way.
- **S4-R20:** A lead change leaves work order status unchanged.
- **S4-R21:** Lead changes and optional shift clearing leave active, recorded, and locked time unchanged.
- **S4-R22:** If the user chooses to clear shifts, remove only the outgoing lead’s shifts scheduled against that whole work order.
- **S4-R23:** If the user chooses to keep shifts, change the lead technician and retain the existing shifts.
- **S4-R24:** Never clear shifts scheduled against individual work order lines through this prompt.
- **S4-R25:** When the user chooses to clear shifts: a shift that has already ended stays as it is; a shift that has not started yet is removed; a shift that is under way at the moment of the lead change is ended at that moment, so the part already under way stays on the schedule and the rest is removed. Example: Jeremy’s shift runs 8:00 to 12:00 and the lead changes to Dana at 10:00; Jeremy’s shift now runs 8:00 to 10:00.
- **S4-R26:** Removing the lead technician (moving the work order to Unassigned) shows the same shift-clearing prompt as changing it (S4-R11).
- **S4-R27:** The lead change and the shift clearing succeed or fail together. If clearing fails, the lead technician is not changed and S4-N8 shows.

**Negative Cases:**

- **S4-N1:** Require Work Orders create and edit permission to drag work orders or access Reassign lead technician.
- **S4-N2:** Do not allow the lead technician to change in Invoiced, Paid, or Imported status. An Invoiced or Paid work order can still be dragged to reorder it within its current technician (or within Unassigned), but it cannot be moved to another technician, to Unassigned, or out of Unassigned. Declined and Complete work orders can be moved freely, as today.
- **S4-N6:** The disabled Reassign lead technician action on an Invoiced or Paid work order shows this tooltip: “The lead technician can’t be changed once a work order is Invoiced or Paid.”
- **S4-N9:** The disabled Reassign lead technician action on an Imported work order shows this tooltip: “The lead technician can’t be changed on an imported work order.”
- **S4-N7:** Visually indicate that an Invoiced or Paid work order can only be reordered within its current technician, not moved to another one.
- **S4-N3:** If reassignment fails, return the card or row to its original column or group.
- **S4-N8:** Failed reassignment shows a user-dismissible alert: “Failed to update lead technician, please try again.”
- **S4-N4:** Selecting the current lead again leaves all assignments unchanged and produces no reassignment toast.
- **S4-N5:** Nothing can be dropped onto an inactive technician's column/group (S2-N2, S3-N2).

**Edge Cases:**

- **S4-E1:** Allow lead changes while the outgoing lead is clocked into a work order line.
- **S4-E6:** An actively clocked-in line retains its assigned technician, even if assignment is implicit or no earlier labor exists.
- **S4-E2:** When two users reassign the same work order, the later change wins.
- **S4-E7:** After concurrent reassignment, both users see the final lead after refresh.
- **S4-E3:** If status becomes prohibited during a drag, reject the drop using S4-N3 and S4-N8, with a status explanation.
- **S4-E4:** The Reassign dialog allows destinations outside the current filter.
- **S4-E8:** After reassignment, remove the work order from results if it no longer matches the filter.
- **S4-E5:** For mixed line assignments, apply S4-R8 independently to each line.

**Scenario — reassignment while clocked in**

- Jeremy is lead technician on WO 8535, is explicitly assigned to its “Brake inspection” line, and is clocked into that line.
- Joe, the foreman, drags WO 8535 from Jeremy's column to Dana's column on the Board View.
- The card moves to Dana's column; toast "Lead technician updated".
- Jeremy stays clocked into "Brake inspection"; his time keeps accruing to WO 8535. On the work order page, the lead technician now reads Dana, and Jeremy still appears as the technician on the line.

### Story 5: Choose what is shown — Fields to display (Board View) and columns (tables)

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** user, **I want** to choose which information appears on cards and in table columns **so that** I see what matters to my role without clutter.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10048](https://shopview.atlassian.net/browse/SV-10048)

**Prerequisites:**

- User has Work Orders view permission and is on the Work Orders page in any display option.

**Requirements:**

- **S5-R1:** Tech View has its own optional-column selection, separate from List. Changing columns in Tech View never changes List, and changing columns in List never changes Tech View.
- **S5-R8:** Save the Tech View column selection per user across logout/login, devices, and locations. List keeps saving its columns exactly as it does today.
- **S5-R2:** Board View offers a separate Fields to display picker in the same toolbar position and with the same interaction as the column chooser.
- **S5-R9:** Allow optional Board View fields to be turned on or off.
- **S5-R10:** Save Board View field selection per user across sessions, logout/login, devices, and locations.
- **S5-R3:** Work order number, unit number when present, and status are mandatory and cannot be deselected.
- **S5-R11:** Offer the optional fields listed below using their existing production meaning.
- *Optional fields:* lead technician name, customer, asset (year/make/model), VIN/serial, progress, service advisor, clocked in (the names of the technicians currently clocked in to the work order, shown the way List’s Clocked In column shows them today: first name, then +N, with every name on hover), line count, line technicians, estimated hours, total price, on-site indicator, and created date.
- **S5-R4:** Until the user changes Tech View’s columns, Tech View shows the current production List default columns.
- **S5-R12:** Existing saved List column selections stay exactly as they are.
- **S5-R13:** Board View’s default selection is lead technician name, work order number, customer, unit number, asset, progress, total price, and mandatory status, subject to financial permission.
- **S5-R5:** Changes apply immediately to all visible cards; no page reload.
- **S5-R7:** Measure display, field, and density usage as specified in Story 12.

**Negative Cases:**

- **S5-N1:** If every optional field is disabled, retain only mandatory fields and the missing-unit fallback in S5-E1.
- **S5-N2:** If field preferences cannot load, use Tech View’s starting columns (S5-R4) or Board View’s default fields for the current display.
- **S5-N3:** Save the user’s next field selection after a preference-load failure.

**Edge Cases:**

- **S5-E1:** If unit number is missing, use available asset year/make/model in its place.
- **S5-E3:** Omit optional fields without values.
- **S5-E4:** Do not treat a valid zero as a missing value.
- **S5-E5:** If both unit number and fallback asset details are missing, omit that content.
- **S5-E2:** Without see financial data permission, hide all dollar-amount fields from displays, filters, and field/column pickers.
- **S5-E6:** Saved filters and field selections must not reveal financial values when see financial data is off.

### Story 6: Density in Tech View and Board View

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** user with a small screen or a preference for larger text, **I want** to choose row and card density **so that** the table is comfortable for my eyes and shows as many rows as I want.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10049](https://shopview.atlassian.net/browse/SV-10049)

**Prerequisites:**

- User has Work Orders view permission and is in Tech View or Board View.

**Requirements:**

- **S6-R1:** Offer Compact, Regular, and Comfortable density in Tech View and Board View.
- **S6-R5:** Use Regular as the default density.
- **S6-R2:** Density adjusts spacing and the size of rows, cards, and their elements.
- **S6-R6:** Changing density never changes which fields, columns, or values are displayed.
- **S6-R3:** Share one density selection between Tech View and Board View.
- **S6-R7:** Save density per user across sessions, logout/login, devices, and locations.
- **S6-R4:** Compact density must not reduce text below the application’s minimum body text size.

**Negative Cases:**

- **S6-N2:** If saved density cannot be loaded, use Regular.

**Edge Cases:**

- **S6-E1:** Density applies to Tech View rows and Board View cards on Work Orders. List keeps today’s row size, and other application tables are unchanged.

### Story 7: Show line technicians on cards and rows

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

**As a** dispatcher, **I want** to see which technicians are working on a work order's lines **so that** I understand who is involved beyond the lead technician.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10050](https://shopview.atlassian.net/browse/SV-10050)

**Prerequisites:**

- The work order has a lead technician or at least one line with an assigned technician.

**Requirements:**

- **S7-R1:** Board View cards (when the line technicians field is on) and a new optional Assigned Techs column in Tech View show a compact avatar group: the lead technician plus the distinct technicians assigned to work order lines. List does not get this column.
- **S7-R2:** Use each visible avatar’s own visible area as its hover target.
- **S7-R3:** Place the lead technician first in the avatar group.
- **S7-R5:** Show each technician once, even when they are both lead and assigned to lines.
- **S7-R4:** When avatars exceed available space, show the first avatars followed by a +N overflow indicator.
- **S7-R6:** Keep every involved technician discoverable by name.

**Negative Cases:**

- **S7-N1:** The field/column is blank only when there is no lead technician and no assigned line technician.

**Edge Cases:**

- **S7-E1:** A technician assigned to several lines of the same work order appears once.

### Story 8: Remove the tech story check-mark indicator

**As a** shop user, **I want** the unexplained check mark next to work order lines to go away **so that** the line view only shows indicators that mean something.

**Design:** N/A (removal)   
**Jira:** [SV-10051](https://shopview.atlassian.net/browse/SV-10051)

**Prerequisites:**

- A work order line has a tech story entered (today this displays a check-mark indicator on the line, introduced with the original Simple Flow release).

**Requirements:**

- **S8-R1:** The check-mark indicator that appears on a work order line when a tech story has been entered is removed everywhere it appears (work order page line list, including the Simple Flow tech view mode).
- **S8-R2:** Entering, editing, or requiring a tech story continues to work exactly as today; only the indicator is removed.

**Negative Cases:**

- **S8-N1:** Lines without a tech story look the same before and after this change.

**Edge Cases:**

- **S8-E1:** Any future required-tech-story indicator requires a separate spec.

### Story 9: Drag to reorder work and technician groups/columns

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

As a dispatcher, I want to order work within technicians and move work between them so that the board reflects my priorities.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share)   
**Jira:** [SV-10052](https://shopview.atlassian.net/browse/SV-10052)

**Prerequisites:**

- View permission permits technician-only group/column reordering.
- Dragging work orders or changing lead technicians requires Work Orders create and edit.

**Requirements:**

- **S9-R1:** Allow dragging work orders within or between technician groups/columns in Tech View and Board View.
- **S9-R6:** Between-technician moves reassign the lead under Story 4.
- **S9-R7:** Moving a work order to Unassigned removes its lead; moving it out assigns the destination lead.
- **S9-R2:** Users with Work Orders view permission can reorder technician groups and columns. The order is saved per user.
- **S9-R8:** Keep Unassigned fixed during technician reordering.
- **S9-R9:** Allow pinned technicians to reorder only within the pinned area.
- **S9-R10:** Reordering technicians does not change work order assignments.
- **S9-R3:** Once anyone at the location has reordered a technician’s work orders, use that saved order instead of the initial sort. Once a user has reordered technician groups/columns, use their saved order instead of the initial technician sort.
- **S9-R11:** Save the manual order of work orders once per location. Everyone at the location sees the same order, in both Tech View and Board View. If two people reorder at the same time, the later save wins; the other person sees the saved order on their next refresh and is not warned.
- **S9-R12:** The manual order of work orders stays until someone changes it. Technician group/column order and pins are saved per user (S9-R2, S3-R18).
- **S9-R13:** Dragging does not change List’s selected sort.
- **S9-R4:** When a staff member newly counts as a technician (Clockable, Active, role neither Office nor Time Clock User, and enrolled in the current location), for example when a new staff record is created, add them after the existing unpinned technicians.
- **S9-R14:** A work order that gets a new lead from the Reassign lead technician dialog or from its detail page goes to the bottom of the new technician’s work, for everyone at the location, in both views. A work order dragged to a technician goes where it is dropped. Removing the lead from the Reassign lead technician dialog or the detail page puts the work order at the bottom of Unassigned. A work order created or split off with a lead keeps the initial sort (S9-R3).
- **S9-R5:** Successful between-technician moves use Story 4’s feedback and count updates.
- **S9-R15:** Reordering within one technician changes position without changing assignments or showing a reassignment toast.

**Negative Cases:**

- **S9-N1:** Apply S4-N1 and S4-N2’s permission and status restrictions to every work order drag.
- **S9-N2:** Apply S4-N5’s inactive-destination restriction and S4-N3/S4-N8’s failure recovery to drag reassignment.
- **S9-N3:** A canceled drag leaves order and assignment unchanged.

**Edge Cases:**

- **S9-E1:** If status or permission changes before a drop completes, revalidate and reject unauthorized reassignment under S4-E3/S4-N3.
- **S9-E2:** When reordering filtered results, place the moved item immediately before or after an unmoved visible anchor.
- **S9-E3:** Retain that relative position when filters clear.
- **Filtered-order examples — confirmed:** Full order A, B, C, D; the filter shows A, C. Move C immediately above A: clearing the filter yields C, A, B, D. Starting again from A, B, C, D, move A immediately below C: clearing the filter yields B, C, A, D. Hidden items keep their relative order. Apply to work orders within a technician and technician groups/columns, subject to fixed Unassigned and pinned-area boundaries.

### Story 11: Keyboard access and focus — design questions to resolve

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

As a keyboard user, I want to navigate work orders and their actions so that these controls are usable without a mouse.

**Design:** [Claude Design — Work Orders](https://claude.ai/design/p/787fef1a-9523-43cc-bd06-f88765051d21?file=Work+Orders.dc.html&via=share) — keyboard interaction design pending   
**Jira:** [SV-10054](https://shopview.atlassian.net/browse/SV-10054)

**Prerequisites:** User has Work Orders view permission; each mutation keeps its existing permission requirements.

**Requirements:**

- **S11-R1:** Design must define how keyboard focus enters a work order card or row.
- **S11-R3:** Design must define keyboard navigation between cards/rows and technician groups/columns.
- **S11-R4:** Design must define what Enter activates.
- **S11-R5:** Design must define how Escape cancels an interaction.
- **S11-R6:** Design must define where focus returns after a dialog closes.
- **S11-R2:** Design must define keyboard access to the more-actions menu.
- **S11-R7:** Design must define keyboard access to pin and unpin.
- **S11-R8:** Design must define keyboard access to group collapse and expand.
- **S11-R9:** Design must define keyboard reorder and reassignment interactions.
- **S11-R10:** Design must define how opening a work order coexists with dragging.

**Negative Cases:**

- **S11-N1:** Keyboard access must not bypass action permissions or work order status restrictions.

**Edge Cases:**

- **S11-E1:** Design must define focus recovery when a work order leaves the filter result.
- **S11-E2:** Design must define focus recovery when a technician becomes inactive.

### Story 12: Google Analytics for display and field usage

*Design and engineering follow-ups:* [See the review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

As the product team, we want to understand which views, fields and density settings people use so that future defaults reflect observed usage.

**Source:** R4 t0021–t0022. Functional measurement requirements below derive from the requested analytics story. The prior AI-authored event contract is preserved on the review child. **Design:** N/A. **Jira:** [SV-10593](https://shopview.atlassian.net/browse/SV-10593).

**Prerequisites:** Reuse the application’s existing Google Analytics setup and analytics identity/consent policy. Work Orders view permission is required; field visibility follows S5-E2.

**Report owner:** Milos Vasic owns building and maintaining the reports in S12-R4 and S12-R10 to S12-R12. Engineering’s part of this story ends at sending the events; Story 12 is complete when both are done.

- **S12-R1:** Measure display usage after successful initial loading and each display or filter-view switch.
- **S12-R6:** Do not count ordinary row refreshes as new display views.
- **S12-R2:** Measure selected and unselected fields available to each user, including untouched defaults and restored preferences. Record this snapshot once per display per session, the first time the user opens that display in the session, not on every open. Field changes are still recorded each time they are saved (S12-R3).
- **S12-R7:** Exclude unavailable financial fields from field-exposure measurement and its denominator.
- **S12-R3:** Measure field-selection changes after successful saves.
- **S12-R8:** Measure density changes after successful saves.
- **S12-R9:** Do not count canceled or failed saves as successful preference changes.
- **S12-R4:** Report weekly display usage by distinct users.
- **S12-R10:** Report field selection rate by field and display: distinct exposed users selecting the field divided by distinct users exposed to that available field.
- **S12-R11:** Report density distribution.
- **S12-R12:** Separate default, saved, and fallback preference cohorts in reports.
- **S12-R13:** Do not count repeated events from one user as additional users.
- **S12-R14:** Do not change product defaults automatically based on analytics.
- **S12-R5:** Analytics may contain predefined field keys and setting values, but no displayed record values, names, identifiers, search text, or dollar amounts.
- **S12-R15:** Reuse existing analytics identity without introducing another customer identifier.

**S12-N1:** Analytics failure, opt-out, or unavailability must not block loading, preference changes, or reassignment.

**S12-E1:** Verify analytics for first use, restored preferences, fallback loading, view changes, successful/failed saves, and financial visibility off.

**S12-E2:** Verify event multiplicity and sample reporting calculations.

### Design updates required from Branko

- Tech View grouped-row icon and clearer board naming; pinned Unassigned group and technician-header hover details.
- Separate field selection from density. Show the Board View picker using the existing columns-picker pattern, and show Compact, Regular, Comfortable in Tech View and Board View.
- Filtered-empty results with Clear filters, and an organization with no technicians, in both new views.
- Inactive technicians and retained pins; disabled/non-draggable work orders in restricted statuses.
- Reassign dialog content, search, grouping, avatars, and exact “N open” count.
- A visual distinction on the work order between implicit and explicit line assignments. This is a requested design addition; the specific indicator remains for design. It is what makes the S4-R8 table legible to a user before they move a work order.
- Keyboard/focus behavior, row click versus drag, and access to hover controls on touch.

  UX-21 now covers the confirmed Board View/Tech View shift-clearing prompt; Branko must complete its interaction and failure states. Lead-first avatars and per-avatar hover remain UX-22. See the [review child page](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions).

### Validation and measurement requirements

**V-1:** During the build, engineering and QA obtain representative production-scale volumes for Foothills Group and Haylock Truck and Trailer, define fixtures and numeric response targets, and test load times and UI behavior before acceptance. No numerical target was selected in the meeting.

**V-2:** During the build, identify and test a one-to-two-person shop on desktop, including empty and overflow states.

**R-1 (release note):** The release note for this feature tells shops, in plain language, about these changes to how the lead technician works today, including on the work order page: (1) a line assigned to a specific technician no longer follows a lead change; (2) a line whose time was logged against a task, not the line, no longer moves on a lead change; (3) choosing the same lead technician again no longer assigns the unassigned lines; (4) the lead of an Invoiced or Paid work order cannot be changed by any route, where before only the screen blocked it.

**Evidence basis:** The owning PM accepts the load-balancing use case as somewhat speculative input from the user proxy. This is an explicit product judgment, not validated customer prevalence. Review OQ-3 is answered on that basis.

## 9. User Feedback Summary

| Trigger | Message | Behavior |
| --- | --- | --- |
| Lead technician changed by drag or dialog (S4-R5) | "Lead technician updated" | Success toast, auto-fades |
| Work order moved to Unassigned (S4-R5) | "Lead technician removed" | Success toast, auto-fades |
| Reassignment fails (S4-N3) | "Failed to update lead technician, please try again." | Alert; card/row returns to origin; user dismisses |
| Fourth pin attempted (S3-R8) | You can pin up to 3 technicians. | Disabled pin control with tooltip/explanation |
| Reassignment not allowed in current status (S4-N2) | “The lead technician can’t be changed once a work order is Invoiced or Paid.” | Tooltip on disabled action; drag not offered |
| Imported work order, reassignment not allowed (S4-N9) | “The lead technician can’t be changed on an imported work order.” | Tooltip on disabled action; drag not offered |
| No work orders match filters (S1-N1) | “No work orders match your filters” + Clear filters | Existing List empty state and clear-filter behavior in all display options |

## 10. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
