# Filters — Work Order List Filtering (ShopView) — COMPLETE Spec

> **Source:** Confluence page "Filters", Version 1.0, Status: Complete — ingested
> 2026-07-17 from the user-provided Confluence "Export to Word" .doc
> (`18e07e91-Filters_1.doc`, MHTML decoded via python email/quopri + BeautifulSoup).
> **✅ SPEC CONFIRMED CURRENT (designer, via the user, 2026-07-17):** this ingested
> Filters spec V1.0 is confirmed the LATEST version. The sections 5–6 numbering gap
> is a document-numbering artifact, NOT missing content (OQ-1 downgraded to a
> note). The user's export zip `50219798-Filters.zip` is the FINAL design set
> matching this spec (see design-notes.md §D/§Z).
> **Canonical spec URL (Confluence): TO CONFIRM — user provided the exported .doc
> 2026-07-16; ask for the page URL** (Atlassian-SSO login-walled — reference pointer
> only when obtained; do NOT fetch).
> **PO: Branko** (full name TBC — same PO as Global Search; never mix PO attributions
> across projects).
> **Epic / Jira key: ⚠️ NOT AVAILABLE — ASK THE USER when VIU begins** (every story's
> Jira field in the spec reads "TBD"; do NOT invent).
> **Figma design (from spec header):**
> https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11817-27678
> **Figma design capture set (user-provided pointer):** file DR4gEODShYgJqkozs3mF5q
> node 11854-23562 "Work Order Explorations 20.4.2026" — see `design-notes.md`.
> **Claude design prototype (from spec header):**
> https://claude.ai/design/p/fac6efcf-a972-4c02-96a5-def12ed8b037?file=Filters.html
>
> **Ingest fidelity note:** the source document's section numbering jumps from
> "4. Key Decisions" directly to "7. Requirements" — sections 5 and 6 do NOT exist
> in the exported document (verified against the raw HTML: no h2 between them, no
> "Out of Scope" / "Design" / "Open Questions" / dev-plan / permissions sections
> anywhere). The gap is preserved verbatim below and flagged in Open Questions
> (OQ-1). The document ends at S12-N1 — there is NO development plan / phasing,
> NO metrics, NO permissions section, and NO open-questions section in the spec.

---

## 1. Business Case

Users managing large volumes of work orders need to quickly narrow down the list to
a relevant subset: by status, customer, technician, advisor, or on-site asset
status. Currently, the Work Orders page lacks a dedicated filter bar, forcing users
to scroll through long lists or rely on the tab shortcuts (Estimates, Completed) as
the only filtering mechanism. This makes day-to-day triage slower and increases the
chance of missing urgent work orders. Adding a persistent, multi-criteria filter bar
directly addresses this pain point and aligns ShopView with the workflow
expectations of shop managers and service advisors.

## 2. Feature Overview

Core Work Orders Filters

- A filter bar appears below the tab navigation on the Work Orders page, providing
  quick access to five filters: **Status, Customer, Lead Technician, Service
  Advisor, and Asset on Site**
- Each filter is a labelled chip that opens a dropdown panel when clicked
- Status, Customer, Lead Technician, and Service Advisor are **multi-select**
  filters; Asset on Site is a **two-option (Yes / No) dropdown**
- Customer, Lead Technician, and Service Advisor dropdowns include a **search
  field** to quickly locate a specific value
- When one or more values are selected in a filter, the chip updates to display the
  selected values and a **"Clear filters"** button appears in the filter bar
- The filter bar can be **collapsed and expanded** via a toggle in the page toolbar;
  when collapsed with active filters, the toolbar toggle shows a visual indicator
- Filter selections **persist** when the user navigates away from the Work Orders
  page and returns
- The active filter state is reflected in the **page URL**, enabling users to share
  or bookmark a filtered view
- Filters apply to all tabs except where noted (see Tab Behavior, Story 9)
- Supported on both **desktop and mobile**

## 3. Jobs to be Done / Goals

- When I'm opening my work queue at the start of the day, I want to filter work
  orders by technician and status, so I can see exactly what's in progress for my
  team without scrolling through everything.
- When a customer calls about their vehicle, I want to filter by customer name, so
  I can instantly see all their open work orders.
- When I'm doing a lot check, I want to filter by "Asset on Site: Yes", so I can
  see only vehicles currently on premises.

Goals:

- Reduce time to find a relevant subset of work orders
- Allow multi-criteria filtering in a single interaction
- Persist filter state to avoid re-applying filters on every visit
- Enable sharing of filtered views via URL

## 4. Key Decisions

- **Asset on Site changed from toggle to dropdown** to maintain visual and
  interaction consistency with the other four filters, all of which use the
  dropdown chip pattern.
- **No selection limit on multi-select filters** — users can select as many values
  as needed.
- **"Clear filters" clears all active filters at once**; a separate **"Clear
  selection"** action within each dropdown clears only that filter individually.
- **Status filter is hidden on the Estimates and Completed tabs** — those tabs are
  shortcuts that already pre-filter by a single status, so showing a Status filter
  would be redundant and potentially confusing.
- **My Work Orders tab does not remove filters**: filters continue to work on top
  of the user-scoped result set.
- **Filters persist in session and across navigation**: the filter state is saved
  per user and reloaded when they return to the Work Orders page.

## [Sections 5–6: NOT PRESENT in the source document]

The exported document's numbering jumps from section 4 to section 7. No content for
sections 5 or 6 exists in the export (see Open Questions OQ-1).

## 7. Requirements

### Story 1: Filter Bar Layout & Visibility

As a user, I want to see a filter bar on the Work Orders page so that I can quickly
narrow down the list.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page
- The user has access to the Work Orders page

Requirements:

- **S1-R1:** The filter bar is displayed below the tab navigation row (All,
  Estimates, Completed, My Work Orders) by default
- **S1-R2:** The filter bar contains five filter chips in this order: Status,
  Customer, Lead Technician, Service Advisor, Asset on Site
- **S1-R3:** Each chip displays the filter name and a chevron icon indicating it
  opens a dropdown
- **S1-R4:** The page toolbar contains a toggle button that collapses and expands
  the filter bar
- **S1-R5:** When the user collapses the filter bar, the bar is hidden and the
  table expands to use the reclaimed vertical space
- **S1-R6:** When the user expands the filter bar, the bar reappears in its
  previous state (with any active filters still shown)
- **S1-R7:** The collapsed/expanded state of the filter bar persists across
  navigation

Negative Cases:

- **S1-N1:** If no filters are available for the current tab (e.g., Estimates tab
  where Status is hidden), the filter bar still displays the remaining filter chips

### Story 2: Status Filter

As a user, I want to filter work orders by status so that I can focus on a specific
stage of the workflow.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-24194 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page on the All or My Work Orders tab

Requirements:

- **S2-R1:** Clicking the Status chip opens a dropdown panel with a checkbox list
  of all possible work order statuses: **Estimate, Approved, In Progress, Review,
  Complete, Invoiced, Paid, Declined, Imported**
- **S2-R2:** The user can select one or more statuses; the table updates to show
  only work orders matching ANY of the selected statuses
- **S2-R3:** Selected statuses are indicated with a filled checkbox
- **S2-R4:** The dropdown includes a "Clear selection" action at the bottom that
  deselects all selected statuses and removes the filter
- **S2-R5:** Clicking outside the dropdown closes it
- **S2-R6:** The table filters in real time as the user makes selections (no
  confirm/apply button needed)

Negative Cases:

- **S2-N1:** On the Estimates tab, the Status filter chip is not shown: that tab
  already pre-filters by the Estimate status
- **S2-N2:** On the Completed tab, the Status filter chip is not shown: that tab
  already pre-filters by the Complete status
- **S2-N3:** If no work orders match the selected statuses, the table shows an
  empty state (see Story 8)

### Story 3: Customer Filter

As a user, I want to filter work orders by customer so that I can see all work
orders for a specific account.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-19595 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S3-R1:** Clicking the Customer chip opens a dropdown panel with a search input
  at the top and a scrollable list of customers below
- **S3-R2:** As the user types in the search field, the customer list filters to
  show only matching names
- **S3-R3:** The user can select one or more customers; each selected customer
  appears as a tag/chip at the top of the dropdown input area
- **S3-R4:** Selected customers are indicated with a checkmark in the list
- **S3-R5:** The user can remove an individual selected customer by clicking the ×
  on their tag
- **S3-R6:** The table updates to show only work orders belonging to any of the
  selected customers
- **S3-R7:** The dropdown includes a "Clear selection" action at the bottom that
  removes all selected customers
- **S3-R8:** Clicking outside the dropdown closes it; selected tags remain visible

Negative Cases:

- **S3-N1:** If the search query returns no matching customers, the list shows a
  "No results" message
- **S3-N2:** If no work orders match the selected customers, the table shows an
  empty state (see Story 8)

Edge Cases:

- **S3-E1:** If a customer has no open work orders, they still appear in the filter
  list: filtering by them simply returns an empty result set

### Story 4: Lead Technician Filter

As a user, I want to filter work orders by lead technician so that I can see the
workload assigned to a specific technician.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-24452 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S4-R1:** Clicking the Lead Technician chip opens a dropdown panel with a search
  input at the top and a scrollable list of technicians below
- **S4-R2:** As the user types in the search field, the technician list filters to
  show only matching names
- **S4-R3:** The user can select one or more technicians; selected technicians are
  indicated with a filled checkbox
- **S4-R4:** The table updates to show only work orders where the selected users
  are assigned as lead technician
- **S4-R5:** The dropdown includes a "Clear selection" action at the bottom
- **S4-R6:** Clicking outside the dropdown closes it

Negative Cases:

- **S4-N1:** If no work orders match the selected technicians, the table shows an
  empty state (see Story 8)

Edge Cases:

- **S4-E1:** If a technician is no longer active, they are not shown in the filter
  list

### Story 5: Service Advisor Filter

As a user, I want to filter work orders by service advisor so that I can see work
assigned to a specific advisor.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-24553 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S5-R1:** Clicking the Service Advisor chip opens a dropdown panel with a search
  input at the top and a scrollable list of advisors below
- **S5-R2:** As the user types, the list filters to matching names
- **S5-R3:** The user can select one or more advisors; selected advisors are
  indicated with a filled checkbox
- **S5-R4:** The table updates to show only work orders assigned to the selected
  advisors
- **S5-R5:** The dropdown includes a "Clear selection" action at the bottom
- **S5-R6:** Clicking outside the dropdown closes it

Negative Cases:

- **S5-N1:** If no work orders match the selected advisors, the table shows an
  empty state (see Story 8)

Edge Cases:

- **S5-E1:** If an advisor is no longer active, they are not shown in the filter
  list

### Story 6: Asset on Site Filter

As a user, I want to filter by whether an asset is currently on site so that I can
see which vehicles are physically at the shop.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S6-R1:** Clicking the Asset on Site chip opens a dropdown panel with two
  options: Yes and No
- **S6-R2:** The user selects one option; the table updates to show only work
  orders matching that asset on-site status
- **S6-R3:** Only one option can be selected at a time (single-select)
- **S6-R4:** The dropdown includes a "Clear selection" action that removes the
  filter
- **S6-R5:** Clicking outside the dropdown closes it

Negative Cases:

- **S6-N1:** If no work orders match the selected option, the table shows an empty
  state (see Story 8)

### Story 7: Active Filter Chip Appearance

As a user, I want the filter chips to clearly show when a filter is active so that
I can tell at a glance what is being applied.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-26246 — Jira: TBD

Prerequisites:

- At least one filter has a value selected

Requirements:

- **S7-R1:** When a filter has one or more values selected, the chip changes to an
  active/highlighted visual state (blue pill) and displays the selected value(s)
- **S7-R2:** If multiple values are selected for a single filter, the chip displays
  the first value followed by a count of additional selections (e.g., "Status:
  Estimate, In progress, Approved…")
- **S7-R3:** When at least one filter is active, a "Clear filters" button appears
  in the filter bar to the right of all chips
- **S7-R4:** When the filter bar is collapsed and at least one filter is active,
  the toolbar collapse/expand toggle displays a visual indicator (e.g., filters
  icon in primary blue color) signalling that active filters are in effect
- **S7-R5:** When the filter bar is collapsed with active filters, the table
  continues to apply all active filters

Negative Cases:

- **S7-N1:** When no filters are active, the "Clear filters" button is not shown
- **S7-N2:** When no filters are active and the bar is collapsed, the toolbar
  toggle shows no indicator

### Story 8: Clearing Filters & Empty State

As a user, I want to easily clear filters so that I can return to the full list.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S8-R1:** Clicking "Clear filters" removes all active filter selections across
  all filters; all chips return to their default (inactive) state
- **S8-R2:** Each filter dropdown includes a "Clear selection" action that removes
  only the selections for that specific filter without affecting others
- **S8-R3:** When the combination of active filters produces no matching work
  orders, the table shows an empty state with a message indicating no results were
  found for the current filters
- **S8-R4:** The empty state includes a prompt or link to clear filters

Negative Cases:

- **S8-N1:** If no filters are active, the "Clear filters" button is not visible
  and cannot be clicked

### Story 9: Tab Behaviour with Active Filters

As a user, I want filters to work correctly as I switch between Work Orders tabs so
that my filtered view is consistent.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562 — Jira: TBD

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S9-R1:** On the All tab, all five filters (Status, Customer, Lead Technician,
  Service Advisor, Asset on Site) are shown and active
- **S9-R2:** On the Estimates tab, the Status filter chip is hidden; the remaining
  four filters are shown and apply on top of the Estimates pre-filter
- **S9-R3:** On the Completed tab, the Status filter chip is hidden; the remaining
  four filters are shown and apply on top of the Completed pre-filter
- **S9-R4:** On the My Work Orders tab, all five filters are shown; the table
  already scopes results to work orders assigned to the logged-in user, and the
  filters apply on top of that scope
- **S9-R5:** Filter selections are maintained when switching between tabs;
  selections that are incompatible with a tab (e.g., a Status selection on the
  Estimates tab) are not applied but are retained in memory so they reappear if
  the user switches back to the All tab

Negative Cases:

- **S9-N1:** A Status selection made on the All tab does not carry over visually
  to the Estimates or Completed tabs, but is not lost

### Story 10: Filter Persistence

As a user, I want my filter selections to be remembered so that I don't have to
re-apply them every time I visit the Work Orders page.

Jira: TBD (no Design link in the spec for this story)

Prerequisites:

- The user has previously applied one or more filters on the Work Orders page

Requirements:

- **S10-R1:** When the user navigates away from the Work Orders page (e.g., to a
  Work Order detail, then back), the filter selections and collapsed/expanded
  state are restored exactly as they were left
- **S10-R2:** Filter selections persist for the duration of the browser session
- **S10-R3:** Filter selections are saved per user: one user's filters do not
  affect another user's view

Negative Cases:

- **S10-N1:** If a previously selected filter value no longer exists (e.g., a
  customer was deleted), the system silently ignores that value and the filter
  updates to reflect only valid selections

### Story 11: URL State & Shareable Links

As a user, I want the active filter state to be reflected in the page URL so that
I can share or bookmark a filtered view.

Jira: TBD (no Design link in the spec for this story)

Prerequisites:

- The user is on the Work Orders page

Requirements:

- **S11-R1:** When a user applies one or more filters, the page URL updates to
  reflect the active filter state
- **S11-R2:** When a user opens a URL that contains filter state, the Work Orders
  page loads with those filters pre-applied and the table already filtered
- **S11-R3:** If the URL contains a filter value that no longer exists (e.g., a
  deleted customer), the system ignores that value and loads the page without it

Negative Cases:

- **S11-N1:** If the URL filter state is malformed or unrecognizable, the page
  loads without any filters applied and does not show an error

### Story 12: Mobile Filter Bar

As a mobile user, I want to access filters on the Work Orders page so that I can
narrow down results on a smaller screen.

Design: https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11857-31046 — Jira: TBD

Prerequisites:

- The user is accessing Work Orders on a mobile device

Requirements:

- **S12-R1:** The filter chips are displayed in a horizontally scrollable row below
  the tab navigation
- **S12-R2:** The filter chips behave identically to desktop: tapping a chip opens
  its dropdown, selections update the chip appearance, "Clear filters" appears
  when active
- **S12-R3:** Filter dropdowns open as a bottom sheet or overlay appropriate for
  the mobile viewport
- **S12-R4:** The filter bar collapse toggle is not shown on mobile — the filter
  bar is always visible

Negative Cases:

- **S12-N1:** If no work orders match the active filters on mobile, the list shows
  the same empty state as desktop

---

## Open Questions (QA-derived — NOT part of the source spec; the spec has no open-questions section)

- **OQ-1 (doc gap) — RESOLVED/DOWNGRADED 2026-07-17:** the designer (via the
  user) confirmed the spec is current; the section numbering jump "4. Key
  Decisions" → "7. Requirements" is a document-numbering ARTIFACT, not missing
  content. Kept only as a note; no follow-up needed.
- **OQ-2 (canonical spec URL):** Confluence URL for the "Filters" page not yet
  provided — TO CONFIRM with the user (exported .doc received 2026-07-16/17).
- **OQ-3 (Epic/Jira):** Every story's Jira field reads "TBD"; the Epic/Jira key is
  NOT AVAILABLE — ⚠️ ASK THE USER when VIU begins; do NOT invent.
- **OQ-4 (permissions):** The spec has NO permissions/role section. S1
  prerequisite is only "The user has access to the Work Orders page". Confirm
  whether any role-based differences exist (e.g., does the Lead Technician /
  Service Advisor filter list respect role visibility?) or filters are purely
  gated by Work Orders page access.
- **OQ-5 (persistence mechanism/scope):** S10-R2 says "for the duration of the
  browser session" while §2/§4 say state is "saved per user and reloaded when
  they return" — confirm whether persistence is session-only (lost on
  logout/browser close) or durable per-user across sessions, and whether it is
  per-browser or server-side.
- **OQ-6 ("Asset on Site" data source):** Confirm what determines a work order's
  asset on-site status (which field/flag in the build) so Yes/No filtering can be
  seeded and verified.
- **OQ-7 (env/flag):** QA environment, feature-flag status, and API surface for
  the filters (query params / endpoint) unknown — establish at VIU.
- **OQ-8 (design deltas):** Any state present in the Figma capture set (node
  11854-23562 "Work Order Explorations 20.4.2026") but absent from this spec —or
  vice versa — to be reconciled once `design-notes.md` (parallel design capture)
  is complete and the user confirms the full design set.

## Version / Change Log

- **V1.0 (spec "Status: Complete")** — ingested 2026-07-17 from
  `18e07e91-Filters_1.doc`. First and only version received.
