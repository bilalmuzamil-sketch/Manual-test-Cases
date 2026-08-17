# Filters — Fabian redesign reconciliation — CASES CREATED AND UPDATED

Pass `build/filters/fabian-review-2026-08-17/`. Every case is TestRail user id 3 (ours).
All carry `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (Rule 69,
build deferred) and a Rule-54 provenance line sourced from spec v21 + epic SV-8785 stories,
read on 17 August 2026 (no build sentence).

## NEW cases created (9) — add_case, byte-verified, custom_atmstatus=1

| Internal ID | C-ID | Title | Link |
|---|---|---|---|
| FLT-ASSIGN-01 | C43841 | Assigned to me is a toggle chip with no arrow that turns on and off | https://shopview.testrail.io/index.php?/cases/view/43841 |
| FLT-ASSIGN-02 | C43842 | Turning Assigned to me on highlights the chip with no value and no clear X | https://shopview.testrail.io/index.php?/cases/view/43842 |
| FLT-ASSIGN-03 | C43843 | Assigned to me narrows to my work orders on top of the tab and filters | https://shopview.testrail.io/index.php?/cases/view/43843 |
| FLT-BANNER-01 | C43844 | A shared-link banner appears above the tabs when you open a filtered link | https://shopview.testrail.io/index.php?/cases/view/43844 |
| FLT-TAB-WO-01 | C43845 | The Work Orders tab pre-filters to Estimate, Approved and In Progress | https://shopview.testrail.io/index.php?/cases/view/43845 |
| FLT-LAYOUT-01 | C43846 | Filter chips sit in the toolbar row; on pages with no tabs, the title row | https://shopview.testrail.io/index.php?/cases/view/43846 |
| FLT-LAYOUT-02 | C43847 | Toolbar order is search, filter chips, icon actions, then the main button | https://shopview.testrail.io/index.php?/cases/view/43847 |
| FLT-CHIP-07 | C43848 | A selected chip shows an X to clear on hover and shortens a long value | https://shopview.testrail.io/index.php?/cases/view/43848 |
| FLT-PANEL-01 | C43849 | A filter panel opens under its chip and stays applied when you click away | https://shopview.testrail.io/index.php?/cases/view/43849 |

## Existing cases updated / repurposed (60) — update_case, byte-verified

| Internal ID | C-ID | Title | Link |
|---|---|---|---|
| FLT-BAR-01 | C29557 | Filter chips sit in the Work Orders toolbar row, not a separate filter bar | https://shopview.testrail.io/index.php?/cases/view/29557 |
| FLT-BAR-02 | C29558 | Work Orders shows three filter chips: Status, Assigned to me, Asset on Site | https://shopview.testrail.io/index.php?/cases/view/29558 |
| FLT-BAR-03 | C29559 | On the Estimates tab the Assigned to me and Asset on Site chips still show | https://shopview.testrail.io/index.php?/cases/view/29559 |
| FLT-STAT-01 | C29560 | Status chip opens a checkbox list of all nine statuses plus Clear selection | https://shopview.testrail.io/index.php?/cases/view/29560 |
| FLT-CUST-01 | C29566 | An entity filter opens a searchable panel with a list and Clear selection | https://shopview.testrail.io/index.php?/cases/view/29566 |
| FLT-CUST-02 | C29567 | Typing in an entity filter search narrows the list to matching values | https://shopview.testrail.io/index.php?/cases/view/29567 |
| FLT-CUST-03 | C29568 | Selected entity values show as removable pills and as ticks in the list | https://shopview.testrail.io/index.php?/cases/view/29568 |
| FLT-CUST-04 | C29569 | Clicking the X on an entity value pill removes just that one value | https://shopview.testrail.io/index.php?/cases/view/29569 |
| FLT-CUST-05 | C29570 | An entity filter narrows the table to records matching any selected value | https://shopview.testrail.io/index.php?/cases/view/29570 |
| FLT-CUST-06 | C29571 | Clear selection in an entity filter panel removes all its selected values | https://shopview.testrail.io/index.php?/cases/view/29571 |
| FLT-CUST-07 | C29572 | Clicking outside an entity filter panel closes it and keeps the selection | https://shopview.testrail.io/index.php?/cases/view/29572 |
| FLT-CUST-08 | C29573 | An entity filter search that matches nothing shows No matches | https://shopview.testrail.io/index.php?/cases/view/29573 |
| FLT-CUST-09 | C29574 | Selecting an entity value that has no records shows the empty state | https://shopview.testrail.io/index.php?/cases/view/29574 |
| FLT-TECH-01 | C29575 | Lead Technician is removed from Work Orders; its panel survives elsewhere | https://shopview.testrail.io/index.php?/cases/view/29575 |
| FLT-TECH-02 | C29576 | Typing in a technician filter search narrows the list to matching names | https://shopview.testrail.io/index.php?/cases/view/29576 |
| FLT-TECH-03 | C29577 | A technician filter shows only records where they are the lead technician | https://shopview.testrail.io/index.php?/cases/view/29577 |
| FLT-TECH-04 | C29578 | Clear selection in the technician filter panel removes all technicians | https://shopview.testrail.io/index.php?/cases/view/29578 |
| FLT-TECH-05 | C29579 | Clicking outside the technician filter panel closes it and keeps the selection | https://shopview.testrail.io/index.php?/cases/view/29579 |
| FLT-TECH-06 | C29580 | Selecting a technician who leads no records shows the empty state | https://shopview.testrail.io/index.php?/cases/view/29580 |
| FLT-TECH-07 | C29581 | A deactivated technician does not appear in the technician filter list | https://shopview.testrail.io/index.php?/cases/view/29581 |
| FLT-ADV-01 | C29582 | Service Advisor is removed from Work Orders; its panel survives elsewhere | https://shopview.testrail.io/index.php?/cases/view/29582 |
| FLT-ADV-02 | C29583 | Typing in an advisor filter search narrows the list to matching names | https://shopview.testrail.io/index.php?/cases/view/29583 |
| FLT-ADV-03 | C29584 | An advisor filter shows only records assigned to the selected advisors | https://shopview.testrail.io/index.php?/cases/view/29584 |
| FLT-ADV-04 | C29585 | Clear selection in the advisor filter panel removes all advisors | https://shopview.testrail.io/index.php?/cases/view/29585 |
| FLT-ADV-05 | C29586 | Clicking outside the advisor filter panel closes it and keeps the selection | https://shopview.testrail.io/index.php?/cases/view/29586 |
| FLT-ADV-06 | C29587 | Selecting an advisor with no assigned records shows the empty state | https://shopview.testrail.io/index.php?/cases/view/29587 |
| FLT-ADV-07 | C29588 | A deactivated advisor does not appear in the advisor filter list | https://shopview.testrail.io/index.php?/cases/view/29588 |
| FLT-ASSET-01 | C29589 | Asset on Site opens a single-select list with a checkmark on the chosen row | https://shopview.testrail.io/index.php?/cases/view/29589 |
| FLT-ASSET-03 | C29591 | Asset on Site is single-select: choosing the other option replaces the first | https://shopview.testrail.io/index.php?/cases/view/29591 |
| FLT-CHIP-03 | C29597 | There is no global Clear filters button; each filter is cleared on its own | https://shopview.testrail.io/index.php?/cases/view/29597 |
| FLT-CHIP-04 | C29598 | Clearing a filter does not clear a typed search, and vice versa | https://shopview.testrail.io/index.php?/cases/view/29598 |
| FLT-CHIP-05 | C29599 | Clear selection in one panel clears only that filter, leaving others | https://shopview.testrail.io/index.php?/cases/view/29599 |
| FLT-CHIP-06 | C29600 | Status and Asset on Site together show only work orders matching both | https://shopview.testrail.io/index.php?/cases/view/29600 |
| FLT-COLL-01 | C29601 | There is no control to collapse or hide the filter chips on any page | https://shopview.testrail.io/index.php?/cases/view/29601 |
| FLT-COLL-02 | C29602 | There is no remembered collapsed or expanded state, because there is no toggle | https://shopview.testrail.io/index.php?/cases/view/29602 |
| FLT-COLL-03 | C29603 | There is no collapsed-state indicator, because the chips are always shown | https://shopview.testrail.io/index.php?/cases/view/29603 |
| FLT-COLL-04 | C29604 | Active filters always keep filtering the table; there is no bar to collapse | https://shopview.testrail.io/index.php?/cases/view/29604 |
| FLT-COLL-05 | C29605 | Every page shows its filter chips with no toggle, whatever the filter count | https://shopview.testrail.io/index.php?/cases/view/29605 |
| FLT-EMPTY-02 | C29607 | The filtered empty state names the active filters and search and clears each | https://shopview.testrail.io/index.php?/cases/view/29607 |
| FLT-TAB-01 | C29608 | The All tab shows the three Work Orders filter chips, all working | https://shopview.testrail.io/index.php?/cases/view/29608 |
| FLT-TAB-02 | C29609 | Estimates tab: Assigned to me and Asset on Site chips work; Status pre-set | https://shopview.testrail.io/index.php?/cases/view/29609 |
| FLT-TAB-03 | C29610 | Completed tab: Assigned to me and Asset on Site chips work; Status pre-set | https://shopview.testrail.io/index.php?/cases/view/29610 |
| FLT-TAB-04 | C29611 | The My Work Orders tab is gone; the Assigned to me chip does its job | https://shopview.testrail.io/index.php?/cases/view/29611 |
| FLT-TAB-05 | C29612 | A Status choice is kept while you switch tabs and returns on the All tab | https://shopview.testrail.io/index.php?/cases/view/29612 |
| FLT-PERS-01 | C29613 | Leaving the page and returning restores your filter selections | https://shopview.testrail.io/index.php?/cases/view/29613 |
| FLT-PERS-04 | C29616 | A remembered filter value that was deleted is silently ignored | https://shopview.testrail.io/index.php?/cases/view/29616 |
| FLT-MOB-01 | C29621 | On a phone the toolbar splits into a tabs row, an action row and a chips row | https://shopview.testrail.io/index.php?/cases/view/29621 |
| FLT-MOB-02 | C29622 | On a phone each filter chip opens its own bottom sheet, not one combined drawer | https://shopview.testrail.io/index.php?/cases/view/29622 |
| FLT-MOB-03 | C29623 | On a phone, choices in a filter sheet apply only when you tap Apply filters | https://shopview.testrail.io/index.php?/cases/view/29623 |
| FLT-MOB-04 | C29624 | On a phone the same deferred-apply rule applies to every single filter sheet | https://shopview.testrail.io/index.php?/cases/view/29624 |
| FLT-MOB-05 | C29625 | On a phone, Assigned to me toggles on and off in the chips row with no sheet | https://shopview.testrail.io/index.php?/cases/view/29625 |
| FLT-MOB-06 | C29626 | On a phone a filter sheet appears over a dimmed page and closes on X or scrim | https://shopview.testrail.io/index.php?/cases/view/29626 |
| FLT-MOB-07 | C29627 | On a phone the Asset on Site sheet is a single-select list with a checkmark | https://shopview.testrail.io/index.php?/cases/view/29627 |
| FLT-MOB-08 | C29628 | On a phone active chips clear one at a time; there is no Clear filters button | https://shopview.testrail.io/index.php?/cases/view/29628 |
| FLT-PERS-06 | C38881 | Filters saved before the redesign carry over after the update | https://shopview.testrail.io/index.php?/cases/view/38881 |
| FLT-RPTS-23 | C38882 | The date-range panel offers set periods and a custom start and end range | https://shopview.testrail.io/index.php?/cases/view/38882 |
| FLT-PSRCH-13 | C38903 | Your typed search keeps working as you sort, page and leave and return | https://shopview.testrail.io/index.php?/cases/view/38903 |
| FLT-PARTS-12 | C38907 | Parts filters allow several choices and are cleared one filter at a time | https://shopview.testrail.io/index.php?/cases/view/38907 |
| FLT-PARTS-14 | C43562 | Parts and Reports filter chips share by link and work on a phone, no collapse | https://shopview.testrail.io/index.php?/cases/view/43562 |
| FLT-COLL-06 | C43590 | No collapse control exists even on a page that has only one filter | https://shopview.testrail.io/index.php?/cases/view/43590 |

## Foreign cases (NOT touched — user id 7 Ahtasham Amjad, Story 14)

C43576, C43577, C43578, C43579, C43580 — proven byte-identical START vs END (only local
annotation keys differ). We never edit a case we did not author (Standing Rule 38).
