# Filters — COVERAGE RE-DERIVATION, both directions, per assertion

**Re-derived from scratch on 2026-08-04** from the live spec body and the live case bodies — not patched from a previous matrix (Standing Rule 43).

## Completeness proof (Standing Rule 50 — exhaustive, zero remainder)

| Measure | Count |
|---|---|
| spec non-blank lines | **369** |
| of which REQUIREMENT lines | **128** |
| of which NON-REQUIREMENT content, each with a stated reason | **241** |
| reconciles with ZERO remainder | **True** (128 + 241 = 369) |
| distinct requirement anchors | **128**, no duplicates |
| our cases | **110** |
| tester-facing assertions inside those cases | **348** |

**Direction 2 — case → requirement:** every anchor cited by every case was checked against the live spec. **0 cases cite a requirement that no longer exists** (0 stale anchors, 0 orphans). 13 cases cite a section-level or extension anchor rather than a numbered requirement; each says so in its own References field.

## Uncovered requirements — 4 of 128, each with its own verdict

### S12-R6

> **Requirement, verbatim:** "Unlike desktop, mobile does not filter in real time. Selections made inside a dropdown / bottom sheet are staged, and the table updates only when the user taps an "Apply filters" button within the sheet. This confirms intent on smaller screens and avoids repeated table reflows / data fetches while the user scrolls a long option list. "Clear selection" and "Clear filters" behave as on desktop."

**NOT COVERED — and deliberately so.** This requirement was ADDED to the spec at 2026-08-04 12:33:56Z and it says the OPPOSITE of what the product owner told us in his answer sheet the same day and of what the build does. The question is open as [SV-8825](https://shopview.atlassian.net/browse/SV-8825). Authoring a case for it now would assert behaviour the build does not have on the strength of a source that contradicts another source from the same person on the same day. The 8 mobile cases carry the DO-NOT-AUTOMATE line instead.

### S13-R21

> **Requirement, verbatim:** "All query behaviour is identical across breakpoints: additive with filters (S13-R10), tab scoping (S13-R11, S13-R24), clearing (S13-R13), retention (S13-R14) and the four component states (S13-R2 to S13-R6). Only the expanded width differs, and that is a fill rule rather than a distinct behaviour"

**COVERED BY EQUIVALENCE, no case of its own — stated, not hidden.** The requirement asserts nothing new: it says every query behaviour already specified elsewhere is identical across breakpoints and only the expanded width differs. Each referenced behaviour has its own case (S13-R10 → FLT-PSRCH-05, S13-R11/R24 → FLT-PSRCH-06, S13-R13 → FLT-PSRCH-04, S13-R14 → FLT-PSRCH-07, S13-R2..R6 → FLT-PSRCH-01/02/03) and the width rule has FLT-MOB-09. No new assertion is left unverdicted.

### S13-R23

> **Requirement, verbatim:** "Each table searches the fields its existing search endpoint already covers today. This is deliberate reuse rather than a newly defined set, so that no page changes behaviour it already has. Where a table needs to search fields beyond what its endpoint covers today, that is scoped separately as backend work and called out against that table. Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against. Five of the surfaces listed under S14-R6 (Customer Contacts, Customer Assets, Customer Fees & Discounts, Administration Locations, Administration Fees & Discounts) narrow rows already loaded in the browser rather than querying an endpoint. For those, no list of covered fields exists to document: the searchable set is whatever the client-side filter happens to match today. Closing this item for them means either scoping the fields as new backend work or stating that the existing client-side narrowing is accepted as-is"

**NOT INDEPENDENTLY TESTABLE.** It is a scoping statement about implementation reuse — "each table searches the fields its existing search endpoint already covers today" — with no observable outcome a tester can pass or fail without a per-table field inventory that the spec deliberately does not give.

### S13-N3

> **Requirement, verbatim:** "Hover states for the expanded field, and disabled and loading states, are not defined and are out of scope for this release"

**EXPLICITLY OUT OF SCOPE in the requirement itself:** "Hover states for the expanded field, and disabled and loading states, are not defined and are out of scope for this release." Nothing to author.

## Every covered requirement — BOTH TEXTS QUOTED SIDE BY SIDE (Standing Rule 45e)

A "covered" verdict with no quoted text is unfalsifiable, so each row quotes the requirement and the covering case's own assertion.

### S1-R1 — covered

> **Requirement, verbatim:** "The filter bar is displayed below the tab navigation row (All, Estimates, Completed, My Work Orders) by default"

- **FLT-BAR-01 = [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A filter bar is visible directly below the tab row and above the work order table. The filter bar is shown by default (expanded) without having to turn anything on."

### S1-R2 — covered

> **Requirement, verbatim:** "The filter bar contains five filter chips in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site"

- **FLT-BAR-02 = [C29558](https://shopview.testrail.io/index.php?/cases/view/29558)** — verdict **PASS**
    - assertion 1, verbatim: "Exactly five filter chips appear, in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site."
    - assertion 2, verbatim: "Each chip shows the filter name and a down arrow (chevron) indicating it opens a dropdown."
    - assertion 3, verbatim: "Each chip shows only the filter name and the arrow - there is no picture icon in front of the name."

### S1-R3 — covered

> **Requirement, verbatim:** "Each chip displays the filter name and a chevron icon indicating it opens a dropdown"

- **FLT-BAR-02 = [C29558](https://shopview.testrail.io/index.php?/cases/view/29558)** — verdict **PASS**
    - assertion 1, verbatim: "Exactly five filter chips appear, in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site."
    - assertion 2, verbatim: "Each chip shows the filter name and a down arrow (chevron) indicating it opens a dropdown."
    - assertion 3, verbatim: "Each chip shows only the filter name and the arrow - there is no picture icon in front of the name."

### S1-R4 — covered

> **Requirement, verbatim:** "The page toolbar contains a toggle button that collapses and expands the filter bar"

- **FLT-COLL-01 = [C29601](https://shopview.testrail.io/index.php?/cases/view/29601)** — verdict **PASS**
    - assertion 1, verbatim: "The filter bar row is hidden."
    - assertion 2, verbatim: "The work order table moves up and uses the reclaimed vertical space."
    - assertion 3, verbatim: "The filter icon shows a pressed/active look while the bar is collapsed."

### S1-R5 — covered

> **Requirement, verbatim:** "When the user collapses the filter bar, the bar is hidden and the table expands to use the reclaimed vertical space"

- **FLT-COLL-01 = [C29601](https://shopview.testrail.io/index.php?/cases/view/29601)** — verdict **PASS**
    - assertion 1, verbatim: "The filter bar row is hidden."
    - assertion 2, verbatim: "The work order table moves up and uses the reclaimed vertical space."
    - assertion 3, verbatim: "The filter icon shows a pressed/active look while the bar is collapsed."

### S1-R6 — covered

> **Requirement, verbatim:** "When the user expands the filter bar, the bar reappears in its previous state (with any active filters still shown)"

- **FLT-COLL-02 = [C29602](https://shopview.testrail.io/index.php?/cases/view/29602)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The filter bar reappears below the tab row."
    - assertion 2, verbatim: "The previously selected filters are still shown on their chips in the active (blue) state - nothing was lost while collapsed."
    - assertion 3, verbatim: "The 'Clear Filters' link is still shown at the right end of the chip row."

### S1-R7 — covered

> **Requirement, verbatim:** "The collapsed/expanded state of the filter bar persists across navigation"

- **FLT-COLL-03 = [C29603](https://shopview.testrail.io/index.php?/cases/view/29603)** — verdict **PASS**
    - assertion 1, verbatim: "After step 2 the filter bar is still collapsed (your choice was remembered)."
    - assertion 2, verbatim: "After step 4 the filter bar is expanded again when you return - whichever state you left it in is restored."
- **FLT-PERS-01 = [C29613](https://shopview.testrail.io/index.php?/cases/view/29613)** — verdict **PASS**
    - assertion 1, verbatim: "After step 2 the same Status and Customer selections are still applied - chips active with the same values, table filtered the same way. The filter bar is still expanded (as you left it). After step 4 the filter bar comes back collapsed - the collapsed/expanded state is restored too. This is the expected behaviour as per epic SV-8785 and the Filters specification version 1.6 (S10-R1, S1-R7)."

### S1-N1 — covered

> **Requirement, verbatim:** "If no filters are available for the current tab (e.g., Estimates tab where Status is hidden), the filter bar still displays the remaining filter chips"

- **FLT-BAR-03 = [C29559](https://shopview.testrail.io/index.php?/cases/view/29559)** — verdict **PASS**
    - assertion 1, verbatim: "The filter bar is still shown - it does not disappear on this tab."
    - assertion 2, verbatim: "The Customer, Lead Technician, Service Advisor and Asset on Site chips are all displayed and usable."
    - assertion 3, verbatim: "The Status chip is not shown on this tab at all - only four chips appear."

### S2-R1 — covered

> **Requirement, verbatim:** "Clicking the Status chip opens a dropdown panel with a checkbox list of all possible work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined, Imported"

- **FLT-STAT-01 = [C29560](https://shopview.testrail.io/index.php?/cases/view/29560)** — verdict **PASS**
    - assertion 1, verbatim: "A dropdown panel opens under the Status chip. It lists all nine statuses as checkboxes, in this order: Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported. All checkboxes are unticked (nothing selected yet). A 'Clear Selection' action is shown at the bottom of the dropdown."
- **FLT-MOB-03 = [C29623](https://shopview.testrail.io/index.php?/cases/view/29623)** — verdict **HELD**
    - assertion 1, verbatim: "Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) plus 'Clear Selection'."
    - assertion 2, verbatim: "After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."
    - assertion 3, verbatim: "The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)', and the Status accordion header is highlighted with the selected values ticked."

### S2-R2 — covered

> **Requirement, verbatim:** "The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"

- **FLT-STAT-02 = [C29561](https://shopview.testrail.io/index.php?/cases/view/29561)** — verdict **PASS**
    - assertion 1, verbatim: "The ticked checkbox appears filled (checked)."
    - assertion 2, verbatim: "The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop."
    - assertion 3, verbatim: "Work orders in other statuses are no longer listed."
- **FLT-STAT-03 = [C29562](https://shopview.testrail.io/index.php?/cases/view/29562)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Every ticked status shows a filled checkbox."
    - assertion 2, verbatim: "The table shows work orders whose status matches ANY of the ticked statuses (both Estimate and Approved rows appear)."
    - assertion 3, verbatim: "Work orders in statuses that are not ticked are hidden."
    - assertion 4, verbatim: "There is no limit on how many statuses you can tick."
- **FLT-API-01 = [C29631](https://shopview.testrail.io/index.php?/cases/view/29631)** — verdict **PASS**
    - assertion 1, verbatim: "The list request includes the active filter selections as request parameters (status values and customer identifiers)."
    - assertion 2, verbatim: "The request succeeds (HTTP 200)."
    - assertion 3, verbatim: "The response contains only work orders matching the filters - the filtering is done by the backend, not just hidden client-side."
- **FLT-API-02 = [C29632](https://shopview.testrail.io/index.php?/cases/view/29632)** — verdict **PASS**
    - assertion 1, verbatim: "One request carries both filters together (both statuses and the customer)."
    - assertion 2, verbatim: "The response returns customer A's Estimate and Approved work orders only."
    - assertion 3, verbatim: "Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or."

### S2-R3 — covered

> **Requirement, verbatim:** "Selected statuses are indicated with a filled checkbox"

- **FLT-STAT-02 = [C29561](https://shopview.testrail.io/index.php?/cases/view/29561)** — verdict **PASS**
    - assertion 1, verbatim: "The ticked checkbox appears filled (checked)."
    - assertion 2, verbatim: "The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop."
    - assertion 3, verbatim: "Work orders in other statuses are no longer listed."

### S2-R4 — covered

> **Requirement, verbatim:** "The dropdown includes a "Clear selection" action at the bottom that deselects all selected statuses and removes the filter"

- **FLT-STAT-01 = [C29560](https://shopview.testrail.io/index.php?/cases/view/29560)** — verdict **PASS**
    - assertion 1, verbatim: "A dropdown panel opens under the Status chip. It lists all nine statuses as checkboxes, in this order: Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported. All checkboxes are unticked (nothing selected yet). A 'Clear Selection' action is shown at the bottom of the dropdown."
- **FLT-STAT-04 = [C29563](https://shopview.testrail.io/index.php?/cases/view/29563)** — verdict **DEVIATION**
    - assertion 1, verbatim: "All status checkboxes become unticked."
    - assertion 2, verbatim: "The Status filter is removed and the table returns to showing work orders of every status."
    - assertion 3, verbatim: "Only the Status filter is affected - any other active filters stay applied."

### S2-R5 — covered

> **Requirement, verbatim:** "Clicking outside the dropdown closes it"

- **FLT-STAT-05 = [C29564](https://shopview.testrail.io/index.php?/cases/view/29564)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The dropdown closes."
    - assertion 2, verbatim: "The ticked statuses stay selected - the Status chip stays in its active state showing the selection."
    - assertion 3, verbatim: "The table stays filtered by the selected statuses."

### S2-R6 — covered

> **Requirement, verbatim:** "The table filters in real time as the user makes selections (no confirm/apply button needed)"

- **FLT-STAT-02 = [C29561](https://shopview.testrail.io/index.php?/cases/view/29561)** — verdict **PASS**
    - assertion 1, verbatim: "The ticked checkbox appears filled (checked)."
    - assertion 2, verbatim: "The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop."
    - assertion 3, verbatim: "Work orders in other statuses are no longer listed."
- **FLT-CUST-05 = [C29570](https://shopview.testrail.io/index.php?/cases/view/29570)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The table shows only work orders whose customer is one of the two selected customers."
    - assertion 2, verbatim: "Work orders belonging to any other customer are hidden."
    - assertion 3, verbatim: "The table updates in real time as you make the selections (no apply button on desktop)."
- **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."
    - assertion 2, verbatim: "The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection')."
    - assertion 3, verbatim: "There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step."
    - assertion 4, verbatim: "The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter."
- **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."
    - assertion 2, verbatim: "The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection')."
    - assertion 3, verbatim: "There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step."
    - assertion 4, verbatim: "The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter."

### S2-R7 — covered

> **Requirement, verbatim:** "Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips. This is current production behaviour and is unchanged by this work"

- **FLT-STAT-07 = [C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** — verdict **PASS**
    - assertion 1, verbatim: "The table switches to showing imported work orders only."
    - assertion 2, verbatim: "While Imported is ticked, the other filter chips are greyed out and cannot be used."
    - assertion 3, verbatim: "Imported cannot be combined with other statuses - selecting it works alone."
    - assertion 4, verbatim: "Unticking Imported re-enables the other chips and the normal list returns."

### S2-N1 — covered

> **Requirement, verbatim:** "On the Estimates tab, the Status filter chip is not shown: that tab already pre-filters by the Estimate status"

- **FLT-TAB-02 = [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)** — verdict **PASS**
    - assertion 1, verbatim: "The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed - the tab already pre-filters the list to Estimate."
    - assertion 2, verbatim: "Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable."
    - assertion 3, verbatim: "After step 4 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list."

### S2-N2 — covered

> **Requirement, verbatim:** "On the Completed tab, the Status filter chip is not shown: that tab already pre-filters by the Complete status"

- **FLT-TAB-03 = [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)** — verdict **PASS**
    - assertion 1, verbatim: "The Status chip is not shown on this tab at all - only four chips appear. The tab already pre-filters the list to Complete."
    - assertion 2, verbatim: "Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable."
    - assertion 3, verbatim: "After step 4 the table shows only that customer's COMPLETE work orders."

### S2-N3 — covered

> **Requirement, verbatim:** "If no work orders match the selected statuses, the table shows an empty state (see Story 8)"

- **FLT-STAT-06 = [C29565](https://shopview.testrail.io/index.php?/cases/view/29565)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows."
    - assertion 2, verbatim: "An empty state is displayed saying no results were found for the current filters (see the Empty State cases for its full content)."
    - assertion 3, verbatim: "The app does not show an error."
- **FLT-API-05 = [C29635](https://shopview.testrail.io/index.php?/cases/view/29635)** — verdict **PASS**
    - assertion 1, verbatim: "The request succeeds (HTTP 200)."
    - assertion 2, verbatim: "The response contains an empty result set (zero work orders) - an empty match is a normal outcome, not an error."
    - assertion 3, verbatim: "The page renders the no-results empty state from this response."

### S2-N4 — covered

> **Requirement, verbatim:** "Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 rather than returning an empty result"

- **FLT-STAT-07 = [C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** — verdict **PASS**
    - assertion 1, verbatim: "The table switches to showing imported work orders only."
    - assertion 2, verbatim: "While Imported is ticked, the other filter chips are greyed out and cannot be used."
    - assertion 3, verbatim: "Imported cannot be combined with other statuses - selecting it works alone."
    - assertion 4, verbatim: "Unticking Imported re-enables the other chips and the normal list returns."

### S3-R1 — covered

> **Requirement, verbatim:** "Clicking the Customer chip opens a dropdown panel with a search input at the top and a scrollable list of customers below"

- **FLT-CUST-01 = [C29566](https://shopview.testrail.io/index.php?/cases/view/29566)** — verdict **PASS**
    - assertion 1, verbatim: "A dropdown panel opens under the Customer chip. A search box with the placeholder 'Search' is at the top of the panel. Click it before you type - it is not focused for you automatically. Below it is a scrollable list of customer names. A 'Clear Selection' action is shown at the bottom of the panel."

### S3-R2 — covered

> **Requirement, verbatim:** "As the user types in the search field, the customer list filters to show only matching names"

- **FLT-CUST-02 = [C29567](https://shopview.testrail.io/index.php?/cases/view/29567)** — verdict **PASS**
    - assertion 1, verbatim: "The customer list narrows as you type, showing only names that match what you entered."
    - assertion 2, verbatim: "Customers that do not match are removed from the list."
    - assertion 3, verbatim: "Deleting the text brings the full list back."
- **FLT-MOB-05 = [C29625](https://shopview.testrail.io/index.php?/cases/view/29625)** — verdict **HELD**
    - assertion 1, verbatim: "The list narrows to matching names as you type. Each selected customer appears as a tag with an x in the input area, and its list row shows a checkmark. Removing a tag deselects just that customer. After 'Apply filters' the list shows only work orders of the remaining selected customers, and the sheet title counts the applied filters (for example 'All Filters (2)')."

### S3-R3 — covered

> **Requirement, verbatim:** "The user can select one or more customers; each selected customer appears as a tag/chip at the top of the dropdown input area"

- **FLT-CUST-03 = [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Each selected customer appears as a tag (small chip) with an x in the input area at the top of the dropdown. Each selected customer's row in the list shows a checkmark on the right. Long customer names on tags are shortened with an ellipsis (for example 'Texas Truck And Aut...'). You can keep selecting as many customers as needed - there is no selection limit."

### S3-R4 — covered

> **Requirement, verbatim:** "Selected customers are indicated with a checkmark in the list"

- **FLT-CUST-03 = [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Each selected customer appears as a tag (small chip) with an x in the input area at the top of the dropdown. Each selected customer's row in the list shows a checkmark on the right. Long customer names on tags are shortened with an ellipsis (for example 'Texas Truck And Aut...'). You can keep selecting as many customers as needed - there is no selection limit."

### S3-R5 — covered

> **Requirement, verbatim:** "The user can remove an individual selected customer by clicking the × on their tag"

- **FLT-CUST-04 = [C29569](https://shopview.testrail.io/index.php?/cases/view/29569)** — verdict **PASS**
    - assertion 1, verbatim: "That customer's tag disappears from the input area."
    - assertion 2, verbatim: "The checkmark next to that customer in the list is removed."
    - assertion 3, verbatim: "The other selected customers keep their tags and checkmarks."
    - assertion 4, verbatim: "The table updates to no longer include that customer's work orders."

### S3-R6 — covered

> **Requirement, verbatim:** "The table updates to show only work orders belonging to any of the selected customers"

- **FLT-CUST-05 = [C29570](https://shopview.testrail.io/index.php?/cases/view/29570)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The table shows only work orders whose customer is one of the two selected customers."
    - assertion 2, verbatim: "Work orders belonging to any other customer are hidden."
    - assertion 3, verbatim: "The table updates in real time as you make the selections (no apply button on desktop)."
- **FLT-API-01 = [C29631](https://shopview.testrail.io/index.php?/cases/view/29631)** — verdict **PASS**
    - assertion 1, verbatim: "The list request includes the active filter selections as request parameters (status values and customer identifiers)."
    - assertion 2, verbatim: "The request succeeds (HTTP 200)."
    - assertion 3, verbatim: "The response contains only work orders matching the filters - the filtering is done by the backend, not just hidden client-side."
- **FLT-API-02 = [C29632](https://shopview.testrail.io/index.php?/cases/view/29632)** — verdict **PASS**
    - assertion 1, verbatim: "One request carries both filters together (both statuses and the customer)."
    - assertion 2, verbatim: "The response returns customer A's Estimate and Approved work orders only."
    - assertion 3, verbatim: "Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or."

### S3-R7 — covered

> **Requirement, verbatim:** "The dropdown includes a "Clear selection" action at the bottom that removes all selected customers"

- **FLT-CUST-06 = [C29571](https://shopview.testrail.io/index.php?/cases/view/29571)** — verdict **PASS**
    - assertion 1, verbatim: "All customer tags are removed from the input area."
    - assertion 2, verbatim: "All checkmarks in the list are removed."
    - assertion 3, verbatim: "The Customer filter is removed and the table shows work orders of all customers again."
    - assertion 4, verbatim: "Other active filters (if any) are not affected."

### S3-R8 — covered

> **Requirement, verbatim:** "Clicking outside the dropdown closes it; selected tags remain visible"

- **FLT-CUST-07 = [C29572](https://shopview.testrail.io/index.php?/cases/view/29572)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The dropdown closes when you click outside it."
    - assertion 2, verbatim: "The Customer chip stays in the active (blue) state showing the selection and the table stays filtered."
    - assertion 3, verbatim: "When reopened, the selected customers' tags are still visible in the input area."

### S3-N1 — covered

> **Requirement, verbatim:** "If the search query returns no matching customers, the list shows a "No results" message"

- **FLT-CUST-08 = [C29573](https://shopview.testrail.io/index.php?/cases/view/29573)** — verdict **PASS**
    - assertion 1, verbatim: "The list shows a message saying there are no results (instead of an empty gap). The app does not show an error. Clearing the search text brings the customer list back."

### S3-N2 — covered

> **Requirement, verbatim:** "If no work orders match the selected customers, the table shows an empty state (see Story 8)"

- **FLT-CUST-09 = [C29574](https://shopview.testrail.io/index.php?/cases/view/29574)** — verdict **PASS**
    - assertion 1, verbatim: "The customer with no work orders IS shown in the filter list (they are not hidden)."
    - assertion 2, verbatim: "After selecting only that customer, the table shows no rows and the filtered empty state is displayed."
    - assertion 3, verbatim: "No error is shown."

### S4-R1 — covered

> **Requirement, verbatim:** "Clicking the Lead Technician chip opens a dropdown panel with a search input at the top and a scrollable list of technicians below"

- **FLT-TECH-01 = [C29575](https://shopview.testrail.io/index.php?/cases/view/29575)** — verdict **PASS**
    - assertion 1, verbatim: "A dropdown panel opens under the Lead Technician chip. A search input with the placeholder 'Search' is at the top. Below it is a scrollable list of technician names. A 'Clear Selection' action is shown at the bottom."
- **FLT-MOB-06 = [C29626](https://shopview.testrail.io/index.php?/cases/view/29626)** — verdict **HELD**
    - assertion 1, verbatim: "The Lead Technician row opens with a 'Search' field and the technician list."
    - assertion 2, verbatim: "The Service Advisor row opens with a 'Search' field and the advisor list."
    - assertion 3, verbatim: "Applying a selection filters the work order list just like on desktop."

### S4-R2 — covered

> **Requirement, verbatim:** "As the user types in the search field, the technician list filters to show only matching names"

- **FLT-TECH-02 = [C29576](https://shopview.testrail.io/index.php?/cases/view/29576)** — verdict **PASS**
    - assertion 1, verbatim: "The technician list narrows to only the names matching what you typed."
    - assertion 2, verbatim: "Deleting the text brings the full list back."

### S4-R3 — covered

> **Requirement, verbatim:** "The user can select one or more technicians; selected technicians are indicated with a filled checkbox"

- **FLT-TECH-03 = [C29577](https://shopview.testrail.io/index.php?/cases/view/29577)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Selected technicians show a checkmark on the row, and as a small removable tag above the list in the list."
    - assertion 2, verbatim: "The table shows only work orders where one of the selected technicians is assigned as the LEAD technician."
    - assertion 3, verbatim: "A work order where the technician is assigned only in a non-lead role does not appear."
    - assertion 4, verbatim: "The table updates in real time as you select."

### S4-R4 — covered

> **Requirement, verbatim:** "The table updates to show only work orders where the selected users are assigned as lead technician"

- **FLT-TECH-03 = [C29577](https://shopview.testrail.io/index.php?/cases/view/29577)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Selected technicians show a checkmark on the row, and as a small removable tag above the list in the list."
    - assertion 2, verbatim: "The table shows only work orders where one of the selected technicians is assigned as the LEAD technician."
    - assertion 3, verbatim: "A work order where the technician is assigned only in a non-lead role does not appear."
    - assertion 4, verbatim: "The table updates in real time as you select."

### S4-R5 — covered

> **Requirement, verbatim:** "The dropdown includes a "Clear selection" action at the bottom"

- **FLT-TECH-04 = [C29578](https://shopview.testrail.io/index.php?/cases/view/29578)** — verdict **PASS**
    - assertion 1, verbatim: "All technician selections are removed (checkboxes unticked)."
    - assertion 2, verbatim: "The Lead Technician filter no longer restricts the table."
    - assertion 3, verbatim: "Other active filters are not affected."

### S4-R6 — covered

> **Requirement, verbatim:** "Clicking outside the dropdown closes it"

- **FLT-TECH-05 = [C29579](https://shopview.testrail.io/index.php?/cases/view/29579)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The dropdown closes."
    - assertion 2, verbatim: "The selection stays applied - the chip stays active and the table stays filtered."

### S4-N1 — covered

> **Requirement, verbatim:** "If no work orders match the selected technicians, the table shows an empty state (see Story 8)"

- **FLT-TECH-06 = [C29580](https://shopview.testrail.io/index.php?/cases/view/29580)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."

### S5-R1 — covered

> **Requirement, verbatim:** "Clicking the Service Advisor chip opens a dropdown panel with a search input at the top and a scrollable list of advisors below"

- **FLT-ADV-01 = [C29582](https://shopview.testrail.io/index.php?/cases/view/29582)** — verdict **PASS**
    - assertion 1, verbatim: "A dropdown panel opens under the Service Advisor chip. A search input with the placeholder 'Search' is at the top. Below it is a scrollable list of advisor names. A 'Clear Selection' action is shown at the bottom."
- **FLT-MOB-06 = [C29626](https://shopview.testrail.io/index.php?/cases/view/29626)** — verdict **HELD**
    - assertion 1, verbatim: "The Lead Technician row opens with a 'Search' field and the technician list."
    - assertion 2, verbatim: "The Service Advisor row opens with a 'Search' field and the advisor list."
    - assertion 3, verbatim: "Applying a selection filters the work order list just like on desktop."

### S5-R2 — covered

> **Requirement, verbatim:** "As the user types, the list filters to matching names"

- **FLT-ADV-02 = [C29583](https://shopview.testrail.io/index.php?/cases/view/29583)** — verdict **PASS**
    - assertion 1, verbatim: "The advisor list narrows to only the names matching what you typed."
    - assertion 2, verbatim: "Deleting the text brings the full list back."

### S5-R3 — covered

> **Requirement, verbatim:** "The user can select one or more advisors; selected advisors are indicated with a filled checkbox"

- **FLT-ADV-03 = [C29584](https://shopview.testrail.io/index.php?/cases/view/29584)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Selected advisors show a checkmark on the row, and as a small removable tag above the list in the list."
    - assertion 2, verbatim: "The table shows only work orders assigned to any of the selected advisors."
    - assertion 3, verbatim: "The table updates in real time as you select."

### S5-R4 — covered

> **Requirement, verbatim:** "The table updates to show only work orders assigned to the selected advisors"

- **FLT-ADV-03 = [C29584](https://shopview.testrail.io/index.php?/cases/view/29584)** — verdict **DEVIATION**
    - assertion 1, verbatim: "Selected advisors show a checkmark on the row, and as a small removable tag above the list in the list."
    - assertion 2, verbatim: "The table shows only work orders assigned to any of the selected advisors."
    - assertion 3, verbatim: "The table updates in real time as you select."

### S5-R5 — covered

> **Requirement, verbatim:** "The dropdown includes a "Clear selection" action at the bottom"

- **FLT-ADV-04 = [C29585](https://shopview.testrail.io/index.php?/cases/view/29585)** — verdict **PASS**
    - assertion 1, verbatim: "All advisor selections are removed."
    - assertion 2, verbatim: "The Service Advisor filter no longer restricts the table."
    - assertion 3, verbatim: "Other active filters are not affected."

### S5-R6 — covered

> **Requirement, verbatim:** "Clicking outside the dropdown closes it"

- **FLT-ADV-05 = [C29586](https://shopview.testrail.io/index.php?/cases/view/29586)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The dropdown closes."
    - assertion 2, verbatim: "The selection stays applied - the chip stays active and the table stays filtered."

### S5-N1 — covered

> **Requirement, verbatim:** "If no work orders match the selected advisors, the table shows an empty state (see Story 8)"

- **FLT-ADV-06 = [C29587](https://shopview.testrail.io/index.php?/cases/view/29587)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."

### S6-R1 — covered

> **Requirement, verbatim:** "Clicking the Asset on Site chip opens a dropdown panel with two options: Yes and No"

- **FLT-ASSET-01 = [C29589](https://shopview.testrail.io/index.php?/cases/view/29589)** — verdict **PASS**
    - assertion 1, verbatim: "A small dropdown panel opens under the Asset on Site chip."
    - assertion 2, verbatim: "It contains exactly two options: Yes and No."
    - assertion 3, verbatim: "A 'Clear Selection' action is shown at the bottom."
    - assertion 4, verbatim: "It is a dropdown (like the other filters), not an on/off toggle."
- **FLT-MOB-07 = [C29627](https://shopview.testrail.io/index.php?/cases/view/29627)** — verdict **HELD**
    - assertion 1, verbatim: "The Asset on Site row opens showing the two options Yes and No plus 'Clear Selection'."
    - assertion 2, verbatim: "Only one option can be selected at a time."
    - assertion 3, verbatim: "After applying, the list shows only work orders matching the chosen on-site state."

### S6-R2 — covered

> **Requirement, verbatim:** "The user selects one option; the table updates to show only work orders matching that asset on-site status"

- **FLT-ASSET-02 = [C29590](https://shopview.testrail.io/index.php?/cases/view/29590)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows only work orders whose asset is currently on site."
    - assertion 2, verbatim: "Work orders whose asset is not on site are hidden."
- **FLT-ASSET-07 = [C38878](https://shopview.testrail.io/index.php?/cases/view/38878)** — verdict **PASS**
    - assertion 1, verbatim: "Only work orders whose asset is NOT on site remain in the list."
    - assertion 2, verbatim: "Every work order with the asset on site is excluded."
    - assertion 3, verbatim: "The chip shows the active No selection."

### S6-R3 — covered

> **Requirement, verbatim:** "Only one option can be selected at a time (single-select)"

- **FLT-ASSET-03 = [C29591](https://shopview.testrail.io/index.php?/cases/view/29591)** — verdict **PASS**
    - assertion 1, verbatim: "No becomes the selected option and Yes is deselected automatically - only one option can be selected at a time."
    - assertion 2, verbatim: "The table switches to showing only the not-on-site work orders."
    - assertion 3, verbatim: "The chip shows the currently selected value."

### S6-R4 — covered

> **Requirement, verbatim:** "The dropdown includes a "Clear selection" action that removes the filter"

- **FLT-ASSET-04 = [C29592](https://shopview.testrail.io/index.php?/cases/view/29592)** — verdict **PASS**
    - assertion 1, verbatim: "The selection is removed and the chip returns to its default (inactive) state."
    - assertion 2, verbatim: "The table shows work orders regardless of on-site status again."
    - assertion 3, verbatim: "Other active filters are not affected."

### S6-R5 — covered

> **Requirement, verbatim:** "Clicking outside the dropdown closes it"

- **FLT-ASSET-05 = [C29593](https://shopview.testrail.io/index.php?/cases/view/29593)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The dropdown closes."
    - assertion 2, verbatim: "The Yes selection stays applied - the chip stays active and the table stays filtered."

### S6-N1 — covered

> **Requirement, verbatim:** "If no work orders match the selected option, the table shows an empty state (see Story 8)"

- **FLT-ASSET-06 = [C29594](https://shopview.testrail.io/index.php?/cases/view/29594)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."

### S7-R1 — covered

> **Requirement, verbatim:** "When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)"

- **FLT-CHIP-01 = [C29595](https://shopview.testrail.io/index.php?/cases/view/29595)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The Status chip changes to an active/highlighted look (blue pill)."
    - assertion 2, verbatim: "The chip displays the selected value (for example 'Status: Estimate')."
    - assertion 3, verbatim: "The other chips stay in their default state."
- **FLT-MOB-08 = [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The chip for the applied filter shows the active state with the selected value(s), like on desktop."
    - assertion 2, verbatim: "A 'Clear Filters' control appears while at least one filter is active."
    - assertion 3, verbatim: "Using it removes all active filters, the chips return to default and the full list comes back."

### S7-R2 — covered

> **Requirement, verbatim:** "If multiple values are selected for a single filter, the chip displays the first value followed by a count of additional selections (e.g., "Status: Estimate, In progress, Approved…")"

- **FLT-CHIP-02 = [C29596](https://shopview.testrail.io/index.php?/cases/view/29596)** — verdict **PASS**
    - assertion 1, verbatim: "The chip lists the selected values starting with the first one and shortens the label when it gets too long (the design shows 'Status: Estimate, In progress, Approved...')."
    - assertion 2, verbatim: "The chip stays a single compact pill - it does not grow to show every value in full."

### S7-R3 — covered

> **Requirement, verbatim:** "When at least one filter is active, a "Clear filters" button appears in the filter bar to the right of all chips"

- **FLT-CHIP-03 = [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)** — verdict **PASS**
    - assertion 1, verbatim: "With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."
    - assertion 2, verbatim: "As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."
    - assertion 3, verbatim: "When the last active filter is removed, 'Clear Filters' disappears again."

### S7-R4 — covered

> **Requirement, verbatim:** "When the filter bar is collapsed and at least one filter is active, the toolbar collapse/expand toggle displays a visual indicator (e.g., filters icon in primary blue color) signalling that active filters are in effect"

- **FLT-COLL-04 = [C29604](https://shopview.testrail.io/index.php?/cases/view/29604)** — verdict **PASS**
    - assertion 1, verbatim: "After step 1 the filter icon shows no special indicator (only its normal pressed look)."
    - assertion 2, verbatim: "After step 3 the filter icon shows a visual indicator (filters icon in primary blue) signalling that active filters are in effect while the bar is hidden."

### S7-R5 — covered

> **Requirement, verbatim:** "When the filter bar is collapsed with active filters, the table continues to apply all active filters"

- **FLT-COLL-05 = [C29605](https://shopview.testrail.io/index.php?/cases/view/29605)** — verdict **PASS**
    - assertion 1, verbatim: "The table content does not change when the bar collapses - it still shows only the work orders matching the active filters."
    - assertion 2, verbatim: "Hiding the bar only hides the chips; it does not remove or pause the filtering."

### S7-N1 — covered

> **Requirement, verbatim:** "When no filters are active, the "Clear filters" button is not shown"

- **FLT-CHIP-03 = [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)** — verdict **PASS**
    - assertion 1, verbatim: "With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."
    - assertion 2, verbatim: "As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."
    - assertion 3, verbatim: "When the last active filter is removed, 'Clear Filters' disappears again."

### S7-N2 — covered

> **Requirement, verbatim:** "When no filters are active and the bar is collapsed, the toolbar toggle shows no indicator"

- **FLT-COLL-04 = [C29604](https://shopview.testrail.io/index.php?/cases/view/29604)** — verdict **PASS**
    - assertion 1, verbatim: "After step 1 the filter icon shows no special indicator (only its normal pressed look)."
    - assertion 2, verbatim: "After step 3 the filter icon shows a visual indicator (filters icon in primary blue) signalling that active filters are in effect while the bar is hidden."

### S8-R1 — covered

> **Requirement, verbatim:** "Clicking "Clear filters" removes all active filter selections across all filters; all chips return to their default (inactive) state"

- **FLT-CHIP-04 = [C29598](https://shopview.testrail.io/index.php?/cases/view/29598)** — verdict **PASS**
    - assertion 1, verbatim: "Every active filter is cleared in one click."
    - assertion 2, verbatim: "All chips return to their default (inactive) look with no values shown."
    - assertion 3, verbatim: "The table shows the full unfiltered list again (no text is in the page Search box, so nothing else is narrowing it)."
    - assertion 4, verbatim: "The 'Clear Filters' link disappears."
- **FLT-MOB-08 = [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The chip for the applied filter shows the active state with the selected value(s), like on desktop."
    - assertion 2, verbatim: "A 'Clear Filters' control appears while at least one filter is active."
    - assertion 3, verbatim: "Using it removes all active filters, the chips return to default and the full list comes back."

### S8-R2 — covered

> **Requirement, verbatim:** "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"

- **FLT-STAT-04 = [C29563](https://shopview.testrail.io/index.php?/cases/view/29563)** — verdict **DEVIATION**
    - assertion 1, verbatim: "All status checkboxes become unticked."
    - assertion 2, verbatim: "The Status filter is removed and the table returns to showing work orders of every status."
    - assertion 3, verbatim: "Only the Status filter is affected - any other active filters stay applied."
- **FLT-CUST-06 = [C29571](https://shopview.testrail.io/index.php?/cases/view/29571)** — verdict **PASS**
    - assertion 1, verbatim: "All customer tags are removed from the input area."
    - assertion 2, verbatim: "All checkmarks in the list are removed."
    - assertion 3, verbatim: "The Customer filter is removed and the table shows work orders of all customers again."
    - assertion 4, verbatim: "Other active filters (if any) are not affected."
- **FLT-TECH-04 = [C29578](https://shopview.testrail.io/index.php?/cases/view/29578)** — verdict **PASS**
    - assertion 1, verbatim: "All technician selections are removed (checkboxes unticked)."
    - assertion 2, verbatim: "The Lead Technician filter no longer restricts the table."
    - assertion 3, verbatim: "Other active filters are not affected."
- **FLT-ADV-04 = [C29585](https://shopview.testrail.io/index.php?/cases/view/29585)** — verdict **PASS**
    - assertion 1, verbatim: "All advisor selections are removed."
    - assertion 2, verbatim: "The Service Advisor filter no longer restricts the table."
    - assertion 3, verbatim: "Other active filters are not affected."
- **FLT-ASSET-04 = [C29592](https://shopview.testrail.io/index.php?/cases/view/29592)** — verdict **PASS**
    - assertion 1, verbatim: "The selection is removed and the chip returns to its default (inactive) state."
    - assertion 2, verbatim: "The table shows work orders regardless of on-site status again."
    - assertion 3, verbatim: "Other active filters are not affected."
- **FLT-CHIP-05 = [C29599](https://shopview.testrail.io/index.php?/cases/view/29599)** — verdict **PASS**
    - assertion 1, verbatim: "Only the Status filter is cleared - its chip returns to default."
    - assertion 2, verbatim: "The Customer filter stays selected and active (blue) and keeps filtering the table."
    - assertion 3, verbatim: "'Clear Filters' remains visible because a filter is still active."

### S8-R3 — covered

> **Requirement, verbatim:** "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"

- **FLT-STAT-06 = [C29565](https://shopview.testrail.io/index.php?/cases/view/29565)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows."
    - assertion 2, verbatim: "An empty state is displayed saying no results were found for the current filters (see the Empty State cases for its full content)."
    - assertion 3, verbatim: "The app does not show an error."
- **FLT-CUST-09 = [C29574](https://shopview.testrail.io/index.php?/cases/view/29574)** — verdict **PASS**
    - assertion 1, verbatim: "The customer with no work orders IS shown in the filter list (they are not hidden)."
    - assertion 2, verbatim: "After selecting only that customer, the table shows no rows and the filtered empty state is displayed."
    - assertion 3, verbatim: "No error is shown."
- **FLT-TECH-06 = [C29580](https://shopview.testrail.io/index.php?/cases/view/29580)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."
- **FLT-ADV-06 = [C29587](https://shopview.testrail.io/index.php?/cases/view/29587)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."
- **FLT-ASSET-06 = [C29594](https://shopview.testrail.io/index.php?/cases/view/29594)** — verdict **PASS**
    - assertion 1, verbatim: "The table shows no rows and the filtered empty state is displayed."
    - assertion 2, verbatim: "No error is shown."
- **FLT-CHIP-06 = [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)** — verdict **PASS**
    - assertion 1, verbatim: "Only customer A's Estimate work order is shown."
    - assertion 2, verbatim: "Customer A's Approved work order is hidden (wrong status) and customer B's Estimate work order is hidden (wrong customer) - each additional filter narrows the result further."
    - assertion 3, verbatim: "Both chips are in the active state and 'Clear Filters' is visible."
- **FLT-EMPTY-01 = [C29606](https://shopview.testrail.io/index.php?/cases/view/29606)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The table body is replaced by an empty state (not just a bare empty grid)."
    - assertion 2, verbatim: "The empty state shows a message indicating no results were found for the current filters."
    - assertion 3, verbatim: "No error message or broken layout appears."
- **FLT-EMPTY-03 = [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — verdict **PASS**
    - assertion 1, verbatim: "The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."
    - assertion 2, verbatim: "The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."
    - assertion 3, verbatim: "Clearing the search brings back the list as narrowed by the filter only - the filter is still on."
    - assertion 4, verbatim: "Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."
- **FLT-MOB-10 = [C29630](https://shopview.testrail.io/index.php?/cases/view/29630)** — verdict **HELD**
    - assertion 1, verbatim: "The list shows the same no-results empty state as desktop, saying no results were found for the current filters."
    - assertion 2, verbatim: "The empty state includes the prompt to clear filters."
    - assertion 3, verbatim: "No error appears."
- **FLT-API-02 = [C29632](https://shopview.testrail.io/index.php?/cases/view/29632)** — verdict **PASS**
    - assertion 1, verbatim: "One request carries both filters together (both statuses and the customer)."
    - assertion 2, verbatim: "The response returns customer A's Estimate and Approved work orders only."
    - assertion 3, verbatim: "Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or."
- **FLT-API-05 = [C29635](https://shopview.testrail.io/index.php?/cases/view/29635)** — verdict **PASS**
    - assertion 1, verbatim: "The request succeeds (HTTP 200)."
    - assertion 2, verbatim: "The response contains an empty result set (zero work orders) - an empty match is a normal outcome, not an error."
    - assertion 3, verbatim: "The page renders the no-results empty state from this response."

### S8-R4 — covered

> **Requirement, verbatim:** "The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"

- **FLT-EMPTY-02 = [C29607](https://shopview.testrail.io/index.php?/cases/view/29607)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The empty state includes a prompt or link to clear the filters."
    - assertion 2, verbatim: "Clicking it removes the active filters and the full work order list is shown again (with no text in the Search box, nothing else is narrowing the list)."
    - assertion 3, verbatim: "The chips return to their default state."
- **FLT-EMPTY-03 = [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — verdict **PASS**
    - assertion 1, verbatim: "The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."
    - assertion 2, verbatim: "The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."
    - assertion 3, verbatim: "Clearing the search brings back the list as narrowed by the filter only - the filter is still on."
    - assertion 4, verbatim: "Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."

### S8-R5 — covered

> **Requirement, verbatim:** "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"

- **FLT-EMPTY-02 = [C29607](https://shopview.testrail.io/index.php?/cases/view/29607)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The empty state includes a prompt or link to clear the filters."
    - assertion 2, verbatim: "Clicking it removes the active filters and the full work order list is shown again (with no text in the Search box, nothing else is narrowing the list)."
    - assertion 3, verbatim: "The chips return to their default state."
- **FLT-EMPTY-03 = [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — verdict **PASS**
    - assertion 1, verbatim: "The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."
    - assertion 2, verbatim: "The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."
    - assertion 3, verbatim: "Clearing the search brings back the list as narrowed by the filter only - the filter is still on."
    - assertion 4, verbatim: "Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."
- **FLT-PSRCH-02 = [C38884](https://shopview.testrail.io/index.php?/cases/view/38884)** — verdict **DEVIATION**
    - assertion 1, verbatim: "With both active, the results match the filter AND the search together (both narrow the list at once)."
    - assertion 2, verbatim: "Clearing the search keeps the filter applied."
    - assertion 3, verbatim: "Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."

### S8-N1 — covered

> **Requirement, verbatim:** "If no filters are active, the "Clear filters" button is not visible and cannot be clicked"

- **FLT-CHIP-03 = [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)** — verdict **PASS**
    - assertion 1, verbatim: "With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."
    - assertion 2, verbatim: "As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."
    - assertion 3, verbatim: "When the last active filter is removed, 'Clear Filters' disappears again."

### S9-R1 — covered

> **Requirement, verbatim:** "On the All tab, all five filters (Status, Customer, Lead Technician, Service Advisor, Asset on Site) are shown and active"

- **FLT-TAB-01 = [C29608](https://shopview.testrail.io/index.php?/cases/view/29608)** — verdict **PASS**
    - assertion 1, verbatim: "All five chips are shown: Status, Customer, Lead Technician, Service Advisor, Asset on Site."
    - assertion 2, verbatim: "Each chip opens its dropdown and can be used."

### S9-R2 — covered

> **Requirement, verbatim:** "On the Estimates tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"

- **FLT-BAR-03 = [C29559](https://shopview.testrail.io/index.php?/cases/view/29559)** — verdict **PASS**
    - assertion 1, verbatim: "The filter bar is still shown - it does not disappear on this tab."
    - assertion 2, verbatim: "The Customer, Lead Technician, Service Advisor and Asset on Site chips are all displayed and usable."
    - assertion 3, verbatim: "The Status chip is not shown on this tab at all - only four chips appear."
- **FLT-TAB-02 = [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)** — verdict **PASS**
    - assertion 1, verbatim: "The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed - the tab already pre-filters the list to Estimate."
    - assertion 2, verbatim: "Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable."
    - assertion 3, verbatim: "After step 4 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list."
- **FLT-TAB-05 = [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)** — verdict **PASS**
    - assertion 1, verbatim: "On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is not shown on that tab. The Customer selection is still shown and still filters the list."
    - assertion 2, verbatim: "Back on the All tab the Status chip reappears with the SAME selection (Approved) still applied - the selection was retained in memory, not lost."
    - assertion 3, verbatim: "The Customer selection is unchanged throughout."

### S9-R3 — covered

> **Requirement, verbatim:** "On the Completed tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Completed pre-filter"

- **FLT-TAB-03 = [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)** — verdict **PASS**
    - assertion 1, verbatim: "The Status chip is not shown on this tab at all - only four chips appear. The tab already pre-filters the list to Complete."
    - assertion 2, verbatim: "Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable."
    - assertion 3, verbatim: "After step 4 the table shows only that customer's COMPLETE work orders."

### S9-R4 — covered

> **Requirement, verbatim:** "On the My Work Orders tab, all five filters are shown; the table already scopes results to work orders assigned to the logged-in user, and the filters apply on top of that scope"

- **FLT-TAB-04 = [C29611](https://shopview.testrail.io/index.php?/cases/view/29611)** — verdict **PASS**
    - assertion 1, verbatim: "All five filter chips are shown on the My Work Orders tab."
    - assertion 2, verbatim: "The table only ever shows work orders assigned to you (the tab's own scope stays)."
    - assertion 3, verbatim: "After step 2 it shows only YOUR work orders in the ticked status - the filters narrow the user-scoped list, they do not widen it to other users' work orders."

### S9-R5 — covered

> **Requirement, verbatim:** "Filter selections are maintained when switching between tabs; selections that are incompatible with a tab (e.g., a Status selection on the Estimates tab) are not applied but are retained in memory so they reappear if the user switches back to the All tab"

- **FLT-TAB-05 = [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)** — verdict **PASS**
    - assertion 1, verbatim: "On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is not shown on that tab. The Customer selection is still shown and still filters the list."
    - assertion 2, verbatim: "Back on the All tab the Status chip reappears with the SAME selection (Approved) still applied - the selection was retained in memory, not lost."
    - assertion 3, verbatim: "The Customer selection is unchanged throughout."

### S9-N1 — covered

> **Requirement, verbatim:** "A Status selection made on the All tab does not carry over visually to the Estimates or Completed tabs, but is not lost"

- **FLT-TAB-05 = [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)** — verdict **PASS**
    - assertion 1, verbatim: "On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is not shown on that tab. The Customer selection is still shown and still filters the list."
    - assertion 2, verbatim: "Back on the All tab the Status chip reappears with the SAME selection (Approved) still applied - the selection was retained in memory, not lost."
    - assertion 3, verbatim: "The Customer selection is unchanged throughout."

### S10-R1 — covered

> **Requirement, verbatim:** "When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left"

- **FLT-COLL-03 = [C29603](https://shopview.testrail.io/index.php?/cases/view/29603)** — verdict **PASS**
    - assertion 1, verbatim: "After step 2 the filter bar is still collapsed (your choice was remembered)."
    - assertion 2, verbatim: "After step 4 the filter bar is expanded again when you return - whichever state you left it in is restored."
- **FLT-PERS-01 = [C29613](https://shopview.testrail.io/index.php?/cases/view/29613)** — verdict **PASS**
    - assertion 1, verbatim: "After step 2 the same Status and Customer selections are still applied - chips active with the same values, table filtered the same way. The filter bar is still expanded (as you left it). After step 4 the filter bar comes back collapsed - the collapsed/expanded state is restored too. This is the expected behaviour as per epic SV-8785 and the Filters specification version 1.6 (S10-R1, S1-R7)."
- **FLT-PERS-02 = [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** — verdict **PASS**
    - assertion 1, verbatim: "After moving around the app (step 2) the filter selections are still applied - you do not have to re-apply them."
    - assertion 2, verbatim: "After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session."
    - assertion 3, verbatim: "The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."

### S10-R2 — covered

> **Requirement, verbatim:** "Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"

- **FLT-PERS-02 = [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** — verdict **PASS**
    - assertion 1, verbatim: "After moving around the app (step 2) the filter selections are still applied - you do not have to re-apply them."
    - assertion 2, verbatim: "After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session."
    - assertion 3, verbatim: "The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."
- **FLT-PERS-06 = [C38881](https://shopview.testrail.io/index.php?/cases/view/38881)** — verdict **PASS**
    - assertion 1, verbatim: "The old saved choices appear in the new filter bar on the first visit - the update does not lose them (old status choices show in the Status chip, the old asset-here choice shows as Asset on Site: Yes, the old My-Work-Orders toggle maps to the My Work Orders tab, columns and sorting stay)."
    - assertion 2, verbatim: "Those carried-over choices are now saved to the account: the other computer shows them too."
- **FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895)** — verdict **EXTDEP**
    - assertion 1, verbatim: "Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200)."
    - assertion 2, verbatim: "On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them."
    - assertion 3, verbatim: "The second user does NOT receive the first user's saved state - each account's saved filters are isolated."
    - assertion 4, verbatim: "Asking for a never-saved key returns success with an empty value, not an error page. Step 3 needs a SECOND sign-in of your own. We could not run it for you: impersonating another user on this branch returns an error, and a new staff member cannot finish signing up because the invitation email cannot be received here. If you have a second account, run step 3 normally. If you do not, mark this test "

### S10-R3 — covered

> **Requirement, verbatim:** "Filter selections are saved per user: one user's filters do not affect another user's view"

- **FLT-PERS-02 = [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** — verdict **PASS**
    - assertion 1, verbatim: "After moving around the app (step 2) the filter selections are still applied - you do not have to re-apply them."
    - assertion 2, verbatim: "After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session."
    - assertion 3, verbatim: "The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."
- **FLT-PERS-03 = [C29615](https://shopview.testrail.io/index.php?/cases/view/29615)** — verdict **PASS**
    - assertion 1, verbatim: "User B does not see user A's filters - user B's page opens with user B's own (or no) filters."
    - assertion 2, verbatim: "User B's new filter does not change what user A sees; each user keeps their own saved filter state."
- **FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895)** — verdict **EXTDEP**
    - assertion 1, verbatim: "Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200)."
    - assertion 2, verbatim: "On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them."
    - assertion 3, verbatim: "The second user does NOT receive the first user's saved state - each account's saved filters are isolated."
    - assertion 4, verbatim: "Asking for a never-saved key returns success with an empty value, not an error page. Step 3 needs a SECOND sign-in of your own. We could not run it for you: impersonating another user on this branch returns an error, and a new staff member cannot finish signing up because the invitation email cannot be received here. If you have a second account, run step 3 normally. If you do not, mark this test "

### S10-R4 — covered

> **Requirement, verbatim:** "Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions. Persistence and scope are separate concerns: each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2"

- **FLT-PERS-05 = [C38880](https://shopview.testrail.io/index.php?/cases/view/38880)** — verdict **PASS**
    - assertion 1, verbatim: "The second Parts view does NOT show the first view's selections - each view keeps its own."
    - assertion 2, verbatim: "Returning to the first view restores that view's own selections."
    - assertion 3, verbatim: "Report tabs likewise keep separate filter choices, each remembered and restored on its own tab."
- **FLT-PSRCH-11 = [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."
    - assertion 2, verbatim: "Going back to the first view brings its own word back and narrows its list again."
    - assertion 3, verbatim: "Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."
    - assertion 4, verbatim: "No search is ever applied to a table it was not typed on."

### S10-R5 — covered

> **Requirement, verbatim:** "The search query is not covered by this story. It is scoped to the browser tab session and is never written to the user account. See S13-R14 and S13-R25"

- **FLT-PSRCH-03 = [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** — verdict **PASS**
    - assertion 1, verbatim: "Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed."
    - assertion 2, verbatim: "Leaving the page and coming back also keeps your text in the box and the list still narrowed."
    - assertion 3, verbatim: "The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search."
    - assertion 4, verbatim: "After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."

### S10-N1 — covered

> **Requirement, verbatim:** "If a previously selected filter value no longer exists (e.g., a customer was deleted), the system silently ignores that value and the filter updates to reflect only valid selections"

- **FLT-PERS-04 = [C29616](https://shopview.testrail.io/index.php?/cases/view/29616)** — verdict **PASS**
    - assertion 1, verbatim: "The deleted customer is silently ignored - no error or warning appears."
    - assertion 2, verbatim: "The Customer filter now reflects only the still-valid selection (the real customer)."
    - assertion 3, verbatim: "The table is filtered by the remaining valid selection only."
- **FLT-API-03 = [C29633](https://shopview.testrail.io/index.php?/cases/view/29633)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The backend does not fail with a server error (no HTTP 5xx)."
    - assertion 2, verbatim: "The response is a normal, successful list response - the invalid value is ignored or simply matches nothing."
    - assertion 3, verbatim: "Any still-valid filter values in the same request are applied normally."

### S11-R1 — covered

> **Requirement, verbatim:** "When a user applies one or more filters, the page URL updates to reflect the active filter state"

- **FLT-URL-01 = [C29617](https://shopview.testrail.io/index.php?/cases/view/29617)** — verdict **PASS**
    - assertion 1, verbatim: "After step 1 the URL changes to include the active filter state."
    - assertion 2, verbatim: "After step 3 the filter part of the URL is removed again."

### S11-R2 — covered

> **Requirement, verbatim:** "When a user opens a URL that contains filter state, the Work Orders page loads with those filters pre-applied and the table already filtered"

- **FLT-URL-02 = [C29618](https://shopview.testrail.io/index.php?/cases/view/29618)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The page opens with the same filters already applied - chips active with the same values."
    - assertion 2, verbatim: "The table is already filtered accordingly on load (no need to re-apply anything)."
    - assertion 3, verbatim: "The same works from a saved bookmark."

### S11-R3 — covered

> **Requirement, verbatim:** "If the URL contains a filter value that no longer exists (e.g., a deleted customer), the system ignores that value and loads the page without it"

- **FLT-URL-03 = [C29619](https://shopview.testrail.io/index.php?/cases/view/29619)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The page loads normally - no error."
    - assertion 2, verbatim: "The deleted value is ignored; only the still-valid filter value is applied and shown on the chips."
    - assertion 3, verbatim: "The table reflects only the valid filter."
- **FLT-API-03 = [C29633](https://shopview.testrail.io/index.php?/cases/view/29633)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The backend does not fail with a server error (no HTTP 5xx)."
    - assertion 2, verbatim: "The response is a normal, successful list response - the invalid value is ignored or simply matches nothing."
    - assertion 3, verbatim: "Any still-valid filter values in the same request are applied normally."

### S11-R4 — covered

> **Requirement, verbatim:** "The active search query is reflected in the page URL alongside the filter state, so a filtered-and-searched view can be shared or bookmarked"

- **FLT-PSRCH-04 = [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)** — verdict **PASS**
    - assertion 1, verbatim: "The address contains the search term after step 1."
    - assertion 2, verbatim: "The fresh tab opens with the search box filled and the list already narrowed."
    - assertion 3, verbatim: "The malformed part is ignored - the page loads cleanly without an error."
    - assertion 4, verbatim: "A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."

### S11-R5 — covered

> **Requirement, verbatim:** "Opening a URL that contains a search query loads the page with that query pre-applied and the search control in its filled state, matching the filter behaviour in S11-R2"

- **FLT-PSRCH-04 = [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)** — verdict **PASS**
    - assertion 1, verbatim: "The address contains the search term after step 1."
    - assertion 2, verbatim: "The fresh tab opens with the search box filled and the list already narrowed."
    - assertion 3, verbatim: "The malformed part is ignored - the page loads cleanly without an error."
    - assertion 4, verbatim: "A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."

### S11-R6 — covered

> **Requirement, verbatim:** "Filter state arriving from a URL applies at runtime only. It never overwrites the user's saved filter state (S10-R2). Changes the user makes to filters while viewing a shared link are also not written back to their saved state: the entire visit is treated as a temporary view"

- **FLT-URL-05 = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The link's filters apply for viewing only - the page shows the shared view."
    - assertion 2, verbatim: "Changes made during the link visit are also NOT saved to your account."
    - assertion 3, verbatim: "A 'Back To My Saved Filters' option is shown while you are looking at the shared link. (If the wording on screen is slightly different, note what it says and carry on.)"
    - assertion 4, verbatim: "Clicking 'Back To My Saved Filters' brings back your own saved filters and removes the filter part from the web address."
    - assertion 5, verbatim: "It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back."
    - assertion 6, verbatim: "Returning normally later still shows your own saved filters, untouched by the link visit."

### S11-R7 — covered

> **Requirement, verbatim:** "While viewing filter state that arrived from a URL, a "Back to my view" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately "my view" rather than "my filters", since the action affects both filters and search"

- **FLT-URL-05 = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The link's filters apply for viewing only - the page shows the shared view."
    - assertion 2, verbatim: "Changes made during the link visit are also NOT saved to your account."
    - assertion 3, verbatim: "A 'Back To My Saved Filters' option is shown while you are looking at the shared link. (If the wording on screen is slightly different, note what it says and carry on.)"
    - assertion 4, verbatim: "Clicking 'Back To My Saved Filters' brings back your own saved filters and removes the filter part from the web address."
    - assertion 5, verbatim: "It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back."
    - assertion 6, verbatim: "Returning normally later still shows your own saved filters, untouched by the link visit."
- **FLT-URL-06 = [C38896](https://shopview.testrail.io/index.php?/cases/view/38896)** — verdict **DEVIATION**
    - assertion 1, verbatim: "On your own view there is no 'Back To My Saved Filters' option anywhere - it only belongs to a shared-link visit."
    - assertion 2, verbatim: "Changing your own filters does not make it appear."
    - assertion 3, verbatim: "When you open the shared link, 'Back To My Saved Filters' does appear."
    - assertion 4, verbatim: "After you click it and you are back on your own view, the option disappears again."

### S11-R8 — covered

> **Requirement, verbatim:** "S11-R6 does not need to protect the search query. Because the query is never saved (S13-R25), a query arriving from a URL has no stored value to overwrite: it simply becomes that browser tab's session query"

- **FLT-URL-05 = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The link's filters apply for viewing only - the page shows the shared view."
    - assertion 2, verbatim: "Changes made during the link visit are also NOT saved to your account."
    - assertion 3, verbatim: "A 'Back To My Saved Filters' option is shown while you are looking at the shared link. (If the wording on screen is slightly different, note what it says and carry on.)"
    - assertion 4, verbatim: "Clicking 'Back To My Saved Filters' brings back your own saved filters and removes the filter part from the web address."
    - assertion 5, verbatim: "It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back."
    - assertion 6, verbatim: "Returning normally later still shows your own saved filters, untouched by the link visit."
- **FLT-PSRCH-04 = [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)** — verdict **PASS**
    - assertion 1, verbatim: "The address contains the search term after step 1."
    - assertion 2, verbatim: "The fresh tab opens with the search box filled and the list already narrowed."
    - assertion 3, verbatim: "The malformed part is ignored - the page loads cleanly without an error."
    - assertion 4, verbatim: "A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."

### S11-N1 — covered

> **Requirement, verbatim:** "If the URL filter state is malformed or unrecognizable, the page loads without any filters applied and does not show an error"

- **FLT-URL-04 = [C29620](https://shopview.testrail.io/index.php?/cases/view/29620)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The Work Orders page loads normally."
    - assertion 2, verbatim: "No filters are applied (chips in default state, full list shown) - the unrecognizable state is discarded."
    - assertion 3, verbatim: "No error message or broken page appears."
- **FLT-API-04 = [C29634](https://shopview.testrail.io/index.php?/cases/view/29634)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The backend responds gracefully - no HTTP 5xx / crash; either a normal (unfiltered or empty) list or a clean validation response."
    - assertion 2, verbatim: "In the browser the page still loads without filters and without an error message, matching the malformed-URL requirement."

### S11-N2 — covered

> **Requirement, verbatim:** "If the URL search parameter is malformed, the page loads without a query applied and does not show an error, matching S11-N1"

- **FLT-PSRCH-04 = [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)** — verdict **PASS**
    - assertion 1, verbatim: "The address contains the search term after step 1."
    - assertion 2, verbatim: "The fresh tab opens with the search box filled and the list already narrowed."
    - assertion 3, verbatim: "The malformed part is ignored - the page loads cleanly without an error."
    - assertion 4, verbatim: "A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."

### S11-N3 — covered

> **Requirement, verbatim:** ""Back to my view" is not shown when the user is viewing their own state rather than state that arrived from a URL"

- **FLT-URL-06 = [C38896](https://shopview.testrail.io/index.php?/cases/view/38896)** — verdict **DEVIATION**
    - assertion 1, verbatim: "On your own view there is no 'Back To My Saved Filters' option anywhere - it only belongs to a shared-link visit."
    - assertion 2, verbatim: "Changing your own filters does not make it appear."
    - assertion 3, verbatim: "When you open the shared link, 'Back To My Saved Filters' does appear."
    - assertion 4, verbatim: "After you click it and you are back on your own view, the option disappears again."

### S12-R1 — covered

> **Requirement, verbatim:** "The filter chips are displayed in a horizontally scrollable row below the tab navigation"

- **FLT-MOB-01 = [C29621](https://shopview.testrail.io/index.php?/cases/view/29621)** — verdict **HELD**
    - assertion 1, verbatim: "A filter chip row is shown below the tabs, starting with an 'All Filters' chip (with a filter icon) followed by the individual filter chips (Status, Customer, Lead Technician, ...)."
    - assertion 2, verbatim: "The row scrolls horizontally - chips that do not fit are reachable by swiping."
    - assertion 3, verbatim: "An arrow at the right-hand edge shows that the row can be scrolled. (This is what the design shows - if your screen looks different, write down what you actually see and carry on.)"

### S12-R2 — covered

> **Requirement, verbatim:** "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"

- **FLT-MOB-03 = [C29623](https://shopview.testrail.io/index.php?/cases/view/29623)** — verdict **HELD**
    - assertion 1, verbatim: "Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) plus 'Clear Selection'."
    - assertion 2, verbatim: "After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."
    - assertion 3, verbatim: "The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)', and the Status accordion header is highlighted with the selected values ticked."
- **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."
    - assertion 2, verbatim: "The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection')."
    - assertion 3, verbatim: "There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step."
    - assertion 4, verbatim: "The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter."
- **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."
    - assertion 2, verbatim: "The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection')."
    - assertion 3, verbatim: "There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step."
    - assertion 4, verbatim: "The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter."
- **FLT-MOB-05 = [C29625](https://shopview.testrail.io/index.php?/cases/view/29625)** — verdict **HELD**
    - assertion 1, verbatim: "The list narrows to matching names as you type. Each selected customer appears as a tag with an x in the input area, and its list row shows a checkmark. Removing a tag deselects just that customer. After 'Apply filters' the list shows only work orders of the remaining selected customers, and the sheet title counts the applied filters (for example 'All Filters (2)')."
- **FLT-MOB-06 = [C29626](https://shopview.testrail.io/index.php?/cases/view/29626)** — verdict **HELD**
    - assertion 1, verbatim: "The Lead Technician row opens with a 'Search' field and the technician list."
    - assertion 2, verbatim: "The Service Advisor row opens with a 'Search' field and the advisor list."
    - assertion 3, verbatim: "Applying a selection filters the work order list just like on desktop."
- **FLT-MOB-07 = [C29627](https://shopview.testrail.io/index.php?/cases/view/29627)** — verdict **HELD**
    - assertion 1, verbatim: "The Asset on Site row opens showing the two options Yes and No plus 'Clear Selection'."
    - assertion 2, verbatim: "Only one option can be selected at a time."
    - assertion 3, verbatim: "After applying, the list shows only work orders matching the chosen on-site state."
- **FLT-MOB-08 = [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The chip for the applied filter shows the active state with the selected value(s), like on desktop."
    - assertion 2, verbatim: "A 'Clear Filters' control appears while at least one filter is active."
    - assertion 3, verbatim: "Using it removes all active filters, the chips return to default and the full list comes back."

### S12-R3 — covered

> **Requirement, verbatim:** "Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"

- **FLT-MOB-02 = [C29622](https://shopview.testrail.io/index.php?/cases/view/29622)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet slides up with a drag handle at the top, the centered title 'All Filters' and a close (x) button."
    - assertion 2, verbatim: "It lists the five filters as expandable accordion rows, each with its icon, name and a down arrow: Status, Customer, Lead Technician, Service Advisor, Asset on Site."
    - assertion 3, verbatim: "A sticky blue 'Apply filters' button sits at the bottom of the sheet."
- **FLT-MOB-03 = [C29623](https://shopview.testrail.io/index.php?/cases/view/29623)** — verdict **HELD**
    - assertion 1, verbatim: "Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) plus 'Clear Selection'."
    - assertion 2, verbatim: "After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."
    - assertion 3, verbatim: "The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)', and the Status accordion header is highlighted with the selected values ticked."
- **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — verdict **HELD**
    - assertion 1, verbatim: "A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."
    - assertion 2, verbatim: "The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection')."
    - assertion 3, verbatim: "There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step."
    - assertion 4, verbatim: "The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter."

### S12-R4 — covered

> **Requirement, verbatim:** "The filter bar collapse toggle is not shown on mobile; the filter bar is always visible"

- **FLT-MOB-09 = [C29629](https://shopview.testrail.io/index.php?/cases/view/29629)** — verdict **DEVIATION**
    - assertion 1, verbatim: "There is no filter-bar collapse/expand (filter icon) toggle on mobile."
    - assertion 2, verbatim: "The filter chip row is always visible on the mobile Work Orders page."

### S12-R5 — covered

> **Requirement, verbatim:** "The page search control is shown on mobile and behaves as it does on desktop (Story 13, S13-R16 to S13-R21). S12-R4, which hides the filter bar collapse toggle on mobile, does not apply to the search control"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S12-N1 — covered

> **Requirement, verbatim:** "If no work orders match the active filters on mobile, the list shows the same empty state as desktop"

- **FLT-MOB-10 = [C29630](https://shopview.testrail.io/index.php?/cases/view/29630)** — verdict **HELD**
    - assertion 1, verbatim: "The list shows the same no-results empty state as desktop, saying no results were found for the current filters."
    - assertion 2, verbatim: "The empty state includes the prompt to clear filters."
    - assertion 3, verbatim: "No error appears."

### S13-R1 — covered

> **Requirement, verbatim:** "A Search control is displayed in the page toolbar, in the right-hand action group, positioned before any icon-only actions and before the primary CTA"

- **FLT-PSRCH-01 = [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The control expands in place into a small search box showing the placeholder 'Type to search'."
    - assertion 2, verbatim: "The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."
    - assertion 3, verbatim: "The round x clears the text and the full list returns."
    - assertion 4, verbatim: "Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."

### S13-R2 — covered

> **Requirement, verbatim:** "In its default state the control is a low-emphasis text button: magnifier icon (20×20) and the label "Search", Inter Medium 14/20, grey/600 (#4B5565), 8px corner radius, transparent background, 10px padding"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R3 — covered

> **Requirement, verbatim:** "On hover the control takes a grey/100 (#EEF2F6) background fill; the label colour is unchanged"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R4 — covered

> **Requirement, verbatim:** "On desktop, clicking the control expands it in place into a text input and moves focus into the input. The field grows leftward from its anchor and the remaining toolbar actions stay in position. The expanded width is 180px"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R5 — covered

> **Requirement, verbatim:** "The expanded empty state shows the magnifier icon, the text caret, and the placeholder "Type to search" in grey/500 (#697586)"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R6 — covered

> **Requirement, verbatim:** "Once the user types, the entered text is shown in grey/900 (#121926) and an X-circle clear icon (16×16) appears at the right edge of the field"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R7 — covered

> **Requirement, verbatim:** "The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required. Inventory uses 350ms because of its load characteristics. Any other table needing a longer interval must be listed here rather than deviating silently"

- **FLT-PSRCH-09 = [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The list narrows on its own a moment after you stop typing (about a third of a second) - you never press Enter or any button."
    - assertion 2, verbatim: "The matching rows appear in the table you were already looking at; no separate results page, results list or pop-up window opens."
    - assertion 3, verbatim: "There is no Apply or Submit button anywhere next to the Search box."
    - assertion 4, verbatim: "Pressing Enter changes nothing that has not already happened - the same rows stay listed and no page reload happens."
    - assertion 5, verbatim: "Parts Inventory behaves the same way, only it waits a fraction longer before reacting; that longer wait is on purpose because that page carries more data."

### S13-R8 — covered

> **Requirement, verbatim:** "Long queries use standard text input behaviour: the field neither grows nor truncates, the text scrolls horizontally within it, and the caret follows the insertion point. Keyboard navigation and click-and-drag selection behave as in any text input"

- **FLT-PSRCH-08 = [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — verdict **DEVIATION**
    - assertion 1, verbatim: "A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."
    - assertion 2, verbatim: "Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."
    - assertion 3, verbatim: "Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."
    - assertion 4, verbatim: "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."
    - assertion 5, verbatim: "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."
    - assertion 6, verbatim: "A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."

### S13-R9 — covered

> **Requirement, verbatim:** "Search is scoped strictly to the records in the current table. It never returns results from another table, another page, another module, or any content outside that table. There is no cross-page lookup and no fallback to a wider search when the query returns nothing"

- **FLT-PSRCH-01 = [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The control expands in place into a small search box showing the placeholder 'Type to search'."
    - assertion 2, verbatim: "The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."
    - assertion 3, verbatim: "The round x clears the text and the full list returns."
    - assertion 4, verbatim: "Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."

### S13-R10 — covered

> **Requirement, verbatim:** "Search and filters are additive (AND). A query narrows within the active filters; applying a filter narrows within the active query"

- **FLT-PSRCH-02 = [C38884](https://shopview.testrail.io/index.php?/cases/view/38884)** — verdict **DEVIATION**
    - assertion 1, verbatim: "With both active, the results match the filter AND the search together (both narrow the list at once)."
    - assertion 2, verbatim: "Clearing the search keeps the filter applied."
    - assertion 3, verbatim: "Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."

### S13-R11 — covered

> **Requirement, verbatim:** "On pages with tabs, search applies within the active tab only"

- **FLT-PSRCH-10 = [C38900](https://shopview.testrail.io/index.php?/cases/view/38900)** — verdict **DEVIATION**
    - assertion 1, verbatim: "On the All tab only the rows matching your word remain."
    - assertion 2, verbatim: "On the Estimates tab your word is still in the Search box, and the list shows only Estimates rows that match it - no rows from the other tabs appear."
    - assertion 3, verbatim: "The Completed tab behaves the same way: your word is still there and only that tab's matching rows are listed."
    - assertion 4, verbatim: "Clearing the search clears it for all the Work Orders tabs - they share one search - and each tab shows its full list again."
- **FLT-PSRCH-11 = [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."
    - assertion 2, verbatim: "Going back to the first view brings its own word back and narrows its list again."
    - assertion 3, verbatim: "Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."
    - assertion 4, verbatim: "No search is ever applied to a table it was not typed on."

### S13-R12 — covered

> **Requirement, verbatim:** "Results replace the table contents in place. There is no separate results view or results page"

- **FLT-PSRCH-01 = [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The control expands in place into a small search box showing the placeholder 'Type to search'."
    - assertion 2, verbatim: "The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."
    - assertion 3, verbatim: "The round x clears the text and the full list returns."
    - assertion 4, verbatim: "Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."
- **FLT-PSRCH-09 = [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The list narrows on its own a moment after you stop typing (about a third of a second) - you never press Enter or any button."
    - assertion 2, verbatim: "The matching rows appear in the table you were already looking at; no separate results page, results list or pop-up window opens."
    - assertion 3, verbatim: "There is no Apply or Submit button anywhere next to the Search box."
    - assertion 4, verbatim: "Pressing Enter changes nothing that has not already happened - the same rows stay listed and no page reload happens."
    - assertion 5, verbatim: "Parts Inventory behaves the same way, only it waits a fraction longer before reacting; that longer wait is on purpose because that page carries more data."

### S13-R13 — covered

> **Requirement, verbatim:** "Clicking the X-circle clears the query and restores the list to its filtered-but-unsearched state. "Clear filters" (S8-R1) does not clear the search query, and clearing the search query does not clear any filters"

- **FLT-CHIP-04 = [C29598](https://shopview.testrail.io/index.php?/cases/view/29598)** — verdict **PASS**
    - assertion 1, verbatim: "Every active filter is cleared in one click."
    - assertion 2, verbatim: "All chips return to their default (inactive) look with no values shown."
    - assertion 3, verbatim: "The table shows the full unfiltered list again (no text is in the page Search box, so nothing else is narrowing it)."
    - assertion 4, verbatim: "The 'Clear Filters' link disappears."
- **FLT-PSRCH-02 = [C38884](https://shopview.testrail.io/index.php?/cases/view/38884)** — verdict **DEVIATION**
    - assertion 1, verbatim: "With both active, the results match the filter AND the search together (both narrow the list at once)."
    - assertion 2, verbatim: "Clearing the search keeps the filter applied."
    - assertion 3, verbatim: "Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."

### S13-R14 — covered

> **Requirement, verbatim:** "The search query is retained for the browser tab session. It survives sorting, pagination, and navigating away from the page and returning. Tab-switch behaviour within a page is governed by S13-R24"

- **FLT-PSRCH-03 = [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** — verdict **PASS**
    - assertion 1, verbatim: "Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed."
    - assertion 2, verbatim: "Leaving the page and coming back also keeps your text in the box and the list still narrowed."
    - assertion 3, verbatim: "The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search."
    - assertion 4, verbatim: "After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."

### S13-R15 — covered

> **Requirement, verbatim:** "On desktop, blur with an empty field collapses the control to its default state. Blur with a query keeps the field expanded so the active query stays visible"

- **FLT-PSRCH-01 = [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The control expands in place into a small search box showing the placeholder 'Type to search'."
    - assertion 2, verbatim: "The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."
    - assertion 3, verbatim: "The round x clears the text and the full list returns."
    - assertion 4, verbatim: "Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."

### S13-R16 — covered

> **Requirement, verbatim:** "Mobile uses the same inline expansion as desktop. There is no modal, no separate search screen, and no mobile-only state in the component. Tapping the collapsed control expands it in place within the action row, moves focus into the field and raises the keyboard"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S13-R17 — covered

> **Requirement, verbatim:** "On mobile the expanded field fills the remaining width of the action row rather than taking the fixed 180px desktop width. On Work Orders that resolves to 162px. All other toolbar actions remain visible and in position throughout; nothing is hidden while searching"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S13-R18 — covered

> **Requirement, verbatim:** "To create that room, the primary CTA on mobile uses its natural hug width instead of stretching to fill the row: "New Work Order" is 144px, the same width it has on desktop, not 211px. The action group is right-aligned as on desktop, so the free space sits to the left and the field expands into it"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S13-R19 — covered

> **Requirement, verbatim:** "Where a page has more than one icon-only action in its toolbar, those actions collapse into a single "more" kebab on mobile. This applies to Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), and any other page carrying two or more icon actions"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S13-R20 — covered

> **Requirement, verbatim:** "No separate active-query indicator is needed on mobile. Because the field stays expanded and visible whenever a query is present, the desktop blur rules (S13-R15) apply unchanged: empty collapses, non-empty stays expanded showing the query"

- **FLT-PSRCH-05 = [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — verdict **PASS**
    - assertion 1, verbatim: "The search expands inline inside the toolbar - no separate popup window opens."
    - assertion 2, verbatim: "The list narrows as you type, same as desktop."
    - assertion 3, verbatim: "To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."
    - assertion 4, verbatim: "The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."
    - assertion 5, verbatim: "There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."

### S13-R22 — covered

> **Requirement, verbatim:** "Every table in the application carries a search control, delivered through the shared table component. This covers the list pages across Work Orders, Parts and Reports, and also tables on detail pages and tables inside dialogs (see S14-R6). Any exception must be listed explicitly here; there are none at time of writing. This replaces the enumerated page list used in earlier versions, which did not account for tables outside list pages. Note the scope of this requirement is wider than the S14-R6 surface list: that list covers only tables global search filters today, so tables it never touched still fall under this rule"

- **FLT-PSRCH-06 = [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — verdict **PASS**
    - assertion 1, verbatim: "Every table listed above has its own Search box - no table lost the ability to narrow by text."
    - assertion 2, verbatim: "Each Search box narrows only its own table; nothing else in the app changes."
    - assertion 3, verbatim: "Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."
    - assertion 4, verbatim: "The work order Parts tab keeps the local search input it already had - it was deliberately left as it is."

### S13-R24 — covered

> **Requirement, verbatim:** "On pages with tabs, the query scopes the same way that page's filters do. The Work Orders tabs share a single query, because they are views of one dataset. Reports sub-tabs and Parts views each keep their own query, matching their per-view filter scoping, because carrying a query between them would apply it to a different table with different columns"

- **FLT-PSRCH-10 = [C38900](https://shopview.testrail.io/index.php?/cases/view/38900)** — verdict **DEVIATION**
    - assertion 1, verbatim: "On the All tab only the rows matching your word remain."
    - assertion 2, verbatim: "On the Estimates tab your word is still in the Search box, and the list shows only Estimates rows that match it - no rows from the other tabs appear."
    - assertion 3, verbatim: "The Completed tab behaves the same way: your word is still there and only that tab's matching rows are listed."
    - assertion 4, verbatim: "Clearing the search clears it for all the Work Orders tabs - they share one search - and each tab shows its full list again."
- **FLT-PSRCH-11 = [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."
    - assertion 2, verbatim: "Going back to the first view brings its own word back and narrows its list again."
    - assertion 3, verbatim: "Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."
    - assertion 4, verbatim: "No search is ever applied to a table it was not typed on."

### S13-R25 — covered

> **Requirement, verbatim:** "The query is stored in the browser tab session, never against the user account. This is deliberately different from filters, which are stored server-side and sync across devices (S10-R2). The query does not sync across devices, does not survive the tab session ending, and two browser tabs open on the same page each keep their own independent query. A shared link opened in a new tab therefore starts clean"

- **FLT-PSRCH-03 = [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** — verdict **PASS**
    - assertion 1, verbatim: "Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed."
    - assertion 2, verbatim: "Leaving the page and coming back also keeps your text in the box and the list still narrowed."
    - assertion 3, verbatim: "The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search."
    - assertion 4, verbatim: "After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."

### S13-N1 — covered

> **Requirement, verbatim:** "If no records match the query, the table shows an empty state (see Story 8)"

- **FLT-EMPTY-03 = [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — verdict **PASS**
    - assertion 1, verbatim: "The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."
    - assertion 2, verbatim: "The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."
    - assertion 3, verbatim: "Clearing the search brings back the list as narrowed by the filter only - the filter is still on."
    - assertion 4, verbatim: "Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."

### S13-N2 — covered

> **Requirement, verbatim:** "If the query is cleared while filters remain active, the table returns to the filtered result set rather than the unfiltered list"

- **FLT-EMPTY-03 = [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — verdict **PASS**
    - assertion 1, verbatim: "The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."
    - assertion 2, verbatim: "The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."
    - assertion 3, verbatim: "Clearing the search brings back the list as narrowed by the filter only - the filter is still on."
    - assertion 4, verbatim: "Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."

### S13-N4 — covered

> **Requirement, verbatim:** "A query is never restored on a later visit after the tab session has ended. A user returning the next day sees an unsearched list"

- **FLT-PSRCH-03 = [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** — verdict **PASS**
    - assertion 1, verbatim: "Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed."
    - assertion 2, verbatim: "Leaving the page and coming back also keeps your text in the box and the list still narrowed."
    - assertion 3, verbatim: "The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search."
    - assertion 4, verbatim: "After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."

### S14-R1 — covered

> **Requirement, verbatim:** "The global header search returns navigational results only. It takes the user to a record or page and does not modify the contents of the list the user is currently viewing"

- **FLT-PSRCH-07 = [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)** — verdict **PASS**
    - assertion 1, verbatim: "The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."
    - assertion 2, verbatim: "The same holds on the other pages checked."
    - assertion 3, verbatim: "Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."
- **FLT-PSRCH-12 = [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list."
    - assertion 2, verbatim: "The page's own Search box is empty; nothing was carried into it."
    - assertion 3, verbatim: "No error is shown - the leftover search part in the address is simply ignored. (Whether it also disappears from the address is not important; note what you see.)"
    - assertion 4, verbatim: "After typing in the top-of-screen search and reloading, the list is still not narrowed and nothing about that word was remembered for the list."

### S14-R2 — covered

> **Requirement, verbatim:** "The existing code path that applies a global search query as a filter on the current page's table is removed, not hidden behind a flag or left dormant"

- **FLT-PSRCH-07 = [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)** — verdict **PASS**
    - assertion 1, verbatim: "The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."
    - assertion 2, verbatim: "The same holds on the other pages checked."
    - assertion 3, verbatim: "Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."
- **FLT-PSRCH-12 = [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list."
    - assertion 2, verbatim: "The page's own Search box is empty; nothing was carried into it."
    - assertion 3, verbatim: "No error is shown - the leftover search part in the address is simply ignored. (Whether it also disappears from the address is not important; note what you see.)"
    - assertion 4, verbatim: "After typing in the top-of-screen search and reloading, the list is still not narrowed and nothing about that word was remembered for the list."

### S14-R3 — covered

> **Requirement, verbatim:** "Any state, URL parameters or persisted values that carry a global search term into page-level filtering are removed with it"

- **FLT-PSRCH-12 = [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)** — verdict **DEVIATION**
    - assertion 1, verbatim: "The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list."
    - assertion 2, verbatim: "The page's own Search box is empty; nothing was carried into it."
    - assertion 3, verbatim: "No error is shown - the leftover search part in the address is simply ignored. (Whether it also disappears from the address is not important; note what you see.)"
    - assertion 4, verbatim: "After typing in the top-of-screen search and reloading, the list is still not narrowed and nothing about that word was remembered for the list."

### S14-R4 — covered

> **Requirement, verbatim:** "Entering a query in the global search while on a list page leaves that list untouched"

- **FLT-PSRCH-07 = [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)** — verdict **PASS**
    - assertion 1, verbatim: "The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."
    - assertion 2, verbatim: "The same holds on the other pages checked."
    - assertion 3, verbatim: "Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."

### S14-R5 — covered

> **Requirement, verbatim:** "This applies to every page in the application. Global search must no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and Reports, and pages with no design in the current explorations. QA should treat this as an app-wide sweep, not a per-module check"

- **FLT-PSRCH-06 = [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — verdict **PASS**
    - assertion 1, verbatim: "Every table listed above has its own Search box - no table lost the ability to narrow by text."
    - assertion 2, verbatim: "Each Search box narrows only its own table; nothing else in the app changes."
    - assertion 3, verbatim: "Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."
    - assertion 4, verbatim: "The work order Parts tab keeps the local search input it already had - it was deliberately left as it is."
- **FLT-PSRCH-07 = [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)** — verdict **PASS**
    - assertion 1, verbatim: "The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."
    - assertion 2, verbatim: "The same holds on the other pages checked."
    - assertion 3, verbatim: "Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."

### S14-R6 — covered

> **Requirement, verbatim:** "The audit of surfaces where global search currently filters content is complete. No surface loses text narrowing: every affected surface keeps a search control, delivered through the shared table component (S13-R22). The audit identified 42 surfaces across 39 components, listed under Affected Surfaces below. It confirmed that global search filters tables well outside the list pages, including Work Order notes, Customer notes, Work Order history, customer and vendor transaction tabs, and the audit log dialog. One candidate was examined and excluded: Work Order Parts, which already has its own local search input independent of global search and therefore loses nothing"

- **FLT-PSRCH-06 = [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — verdict **PASS**
    - assertion 1, verbatim: "Every table listed above has its own Search box - no table lost the ability to narrow by text."
    - assertion 2, verbatim: "Each Search box narrows only its own table; nothing else in the app changes."
    - assertion 3, verbatim: "Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."
    - assertion 4, verbatim: "The work order Parts tab keeps the local search input it already had - it was deliberately left as it is."

### S14-N1 — covered

> **Requirement, verbatim:** "Page search (Story 13) is a hard prerequisite. Removing global-search filtering from a page before page search is available there would leave that page with no way to narrow by text. If the rollout is phased, S14-R2 is scoped per page and S14-R5 is verified once at the end"

- **FLT-PSRCH-06 = [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — verdict **PASS**
    - assertion 1, verbatim: "Every table listed above has its own Search box - no table lost the ability to narrow by text."
    - assertion 2, verbatim: "Each Search box narrows only its own table; nothing else in the app changes."
    - assertion 3, verbatim: "Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."
    - assertion 4, verbatim: "The work order Parts tab keeps the local search input it already had - it was deliberately left as it is."
