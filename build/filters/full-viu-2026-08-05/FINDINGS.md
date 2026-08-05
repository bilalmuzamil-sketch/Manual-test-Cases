# FINDINGS — Filters full live VIU, 2026-08-05

**Every one of the 110 rows below was driven live in this pass on build `v3.4.2-d00239b`** (index.html last-modified Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41718b5e871432064ed914e2e7`, byte-identical at 19:53Z, 21:00Z and 21:34Z). Nothing here is carried forward from an earlier pass.

Expected behaviour comes from the documents — Filters specification at **Confluence version 18** (published 4 August 2026), epic **SV-8785** and its stories, and Branko's recorded answers. The build supplied only the on-screen labels and the pass/fail verdict (Standing Rule 57).

**Verdicts: PASS 81 · DEVIATION 14 · HOLD 15 = 110.** Every DEVIATION keeps its documented expectation and carries a labelled note telling the tester to record a fail.


## Filter Bar Layout and Visibility  (3 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | Filter bar is shown below the tab row on the Work Orders page | **DEVIATION** | READY - EXPECT FAIL | b1.json geom: tabs y85 h40 x35-391, filter bar y90 h30 x407-1170 - beside the tabs, not below them |
| FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | Five filter chips appear in a fixed order with an icon, name and arrow | **PASS** | READY | b1.json chips: 5 in order x452<564<696<864<1030, each name + keyboard_arrow_down, no leading icon (matches S1-R3; SV-8904 is the open design-vs-PRD clarification) |
| FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Estimates tab | **PASS** | READY | b1c.json estimatesTab: Status chip absent, other four present, bar visible |

## Status Filter  (7 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | Status chip opens a checkbox list of all nine statuses plus Clear Sele | **PASS** | READY | b1.json statusPanel: exactly 9 statuses + Clear Selection, no apply button |
| FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | Ticking one status filters the table immediately, with no apply button | **PASS** | READY | b1.json tickOne: 1 list request, url ?status=declined, chip 'Status: Declined', no apply button |
| FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | Ticking several statuses shows work orders matching any of them | **PASS** | READY | b1c.json multiSelectOR distinct statuses [paid,declined]; b11-api C29632 arithmetic 1+3=4 |
| FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | Clear Selection in the Status dropdown unticks every status | **PASS** | READY | b1c.json clearSelection: 0 checked, chip back to 'Status', status dropped from url |
| FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | Clicking outside the Status dropdown closes it and keeps the selection | **PASS** | READY | b1c.json clickOutside: panel closed, chip still 'Status: Declined', 10 rows |
| FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | Selecting statuses that no work order has shows the empty state | **PASS** | READY | b2b.json filterOnly: in_progress has 0 work orders -> 0 data rows + empty state |
| FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters | **PASS** | READY | b1c.json importedAlone: other four chips aria-disabled=true with a disabled class |

## Customer Filter  (9 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | Customer chip opens a dropdown with a search field and a customer list | **PASS** | READY | b3.json customer.opened: search box placeholder 'Search', 4728 items, Clear Selection |
| FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | Typing in the customer search narrows the list to matching names | **PASS** | READY | b3.json customer.narrowed: 'Iiba' -> 2 items, every one matching |
| FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | Selected customers show as removable tags and as ticks in the list | **PASS** | READY | b3.json customer.sel: tag 'Iibay Landscapingcancel' + chip shows the value |
| FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | Clicking the x on a customer tag removes just that customer from the s | **PASS** | READY | b3.json customer.tagRemoved: removed Iibay, Zecrest remained, url updated to the remaining one |
| FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | The table shows only work orders belonging to any of the selected cust | **PASS** | READY | b4.json customerPositive: Customer column distinct = ['Ceview Builders'] over 31 rows |
| FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | Clear Selection in the Customer dropdown removes all selected customer | **PASS** | READY | b3.json customer.cleared: tags [], chip 'Customer', 31 rows |
| FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | Clicking outside the Customer dropdown closes it and the selections re | **PASS** | READY | b5b.json customerSelectionKeptOnOutsideClick: panel closed, chip still 'Customer: Ceview Builders' |
| FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | Customer search with no matching name shows a no-results message in th | **PASS** | READY | b3.json customer.noMatch: 'No results' |
| FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | A customer with no work orders is still listed; picking them shows no  | **PASS** | READY | b3.json customer.sel: Iibay Landscaping listed and selectable, 0 rows |

## Lead Technician Filter  (7 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | Lead Technician chip opens a dropdown with a search field and a list | **PASS** | READY | b3.json leadTech.opened: search box 'Search', 43 items, Clear Selection |
| FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | Typing in the technician search narrows the list to matching names | **PASS** | READY | b3.json leadTech.narrowed: 'Admi' -> 1 item, matching |
| FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | Selecting technicians shows only work orders where they are the lead t | **PASS** | READY | b4.json leadTechPositive: Lead Technician column distinct = ['Colleen Guerrero'] |
| FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | Clear Selection in the Lead Technician dropdown removes all selected t | **PASS** | READY | b3.json leadTech.cleared: tags [], chip 'Lead Technician', 31 rows |
| FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | Clicking outside the Lead Technician dropdown closes it | **PASS** | READY | b3.json leadTech.panelOpenAfterOutsideClick=false |
| FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | Selecting a technician who leads no work orders shows the empty state | **PASS** | READY | b3.json leadTech.sel: Admin ShopView leads no work orders -> 0 rows |
| FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | A deactivated technician does not appear in the Lead Technician filter | **PASS** | READY | b6-deact.json leadTechnician: 0 of the 34 deactivated staff appear in the dropdown |

## Service Advisor Filter  (7 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | Service Advisor chip opens a dropdown with a search field and a list | **PASS** | READY | b3.json advisor.opened: search box 'Search', 56 items, Clear Selection |
| FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | Typing in the advisor search narrows the list to matching names | **PASS** | READY | b3.json advisor.narrowed: 'Admi' -> 1 item |
| FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | Selecting advisors shows only work orders assigned to those advisors | **PASS** | READY | b4.json advisorPositive: Service Advisor column distinct = ['Lauren Knight'] |
| FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | Clear Selection in the Service Advisor dropdown removes all selected a | **PASS** | READY | b3.json advisor.cleared: tags [], chip 'Service Advisor', 31 rows |
| FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | Clicking outside the Service Advisor dropdown closes it | **PASS** | READY | b3.json advisor.panelOpenAfterOutsideClick=false |
| FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | Selecting an advisor with no assigned work orders shows the empty stat | **PASS** | READY | b6.json advisorZero: Ayesha Khan has 0 work orders -> 0 rows, 'No work orders match your filters' |
| FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | A deactivated advisor does not appear in the Service Advisor filter li | **PASS** | READY | b6-deact.json serviceAdvisor: 0 of the 34 deactivated staff appear in the dropdown |

## Asset on Site Filter  (7 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | Asset on Site chip opens a dropdown with Yes and No plus Clear Selecti | **PASS** | READY | b9.json mobileAsset + b4.json assetFull: panel offers Yes, No and Clear Selection |
| FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | Choosing Yes shows only work orders whose asset is on site | **PASS** | READY | b4-asset-ui.json + asset.mjs: vehicleHere=1 returns 500/500 true; UI pins green rgb(33,186,69); UI first row S2-9576 == API first row |
| FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | Asset on Site is single-select: choosing the other option replaces the | **PASS** | READY | b5b.json assetSingleSelect: choosing No replaced Yes - one value in the url and one in the request |
| FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | Clear Selection in the Asset on Site dropdown removes the filter | **PASS** | READY | b4.json assetFull.cleared: chip 'Asset on Site', url clean |
| FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | Clicking outside the Asset on Site dropdown closes it | **PASS** | READY | b4.json assetFull.panelOpenAfterOutside=false |
| FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | An Asset on Site choice that matches no work orders shows the empty st | **PASS** | READY | b6c.json: Bahampton Holdings has 6 work orders all off-site; + Asset on Site Yes -> 0 rows, empty state, no error |
| FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | Choosing No shows only work orders whose asset is not on site | **PASS** | READY | b4-asset-ui.json + asset.mjs: vehicleHere=0 returns 500/500 false; UI pins red rgb(193,0,21) |

## Active Filter Chips and Clear Filters  (6 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | A chip with a selected value turns blue and shows the value | **PASS** | READY | b4.json chipAppearance: inactive transparent grey rgb(97,97,97) -> active background rgb(227,242,253) text rgb(56,116,255), value shown |
| FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | A chip with several values shows the first ones and shortens the rest | **PASS** | READY | b4.json chipAppearance.manyValues: 'Status: Declined, Paid, Invoiced, Comple...' truncated |
| FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | 'Clear Filters' shows right of the chips only when a filter is active | **PASS** | READY | b2.json clearFiltersVisibility: absent with no filter; present at x1475 right of the chips with one |
| FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | 'Clear Filters' removes every active filter and resets all chips | **PASS** | READY | b2.json clearFiltersAction: 9 rows -> 33, every chip back to default, url clean |
| FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | 'Clear Selection' in one dropdown clears only that filter | **PASS** | READY | b5b.json clearSelectionScoped: clearing Status left 'Asset on Site: Yes' and vehicleHere=1 in the url |
| FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Customer filters together show only work orders matching bo | **PASS** | READY | b5b.json statusPlusCustomerPositive: status=paid + Ceview Builders -> Status column ['Paid'], Customer column ['Ceview Builders'] |

## Collapse and Expand  (5 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | The toolbar filter button collapses the bar and the table takes the sp | **PASS** | READY | b5.json collapseCycle: table top 184 -> 144, 40px reclaimed, chips hidden |
| FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | Expanding the filter bar brings it back with active filters still show | **PASS** | READY | b5.json collapseCycle.reExpanded: 5 chips back, chip still 'Status: Declined' |
| FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | The filter bar's collapsed or expanded state is remembered on return | **PASS** | READY | b5b.json collapsePersistClean: saved collapsed=true after toggling, still collapsed after navigating away and back |
| FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | Collapsed filter button shows a blue indicator only when filters are a | **PASS** | READY | b6.json collapsedIndicatorClean: no filter -> grey rgb(97,97,97) no badge; with filter -> blue rgb(56,116,255) with badge |
| FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | Active filters keep filtering the table while the filter bar is collap | **PASS** | READY | b5.json collapseCycle: 8 rows identical expanded, collapsed and re-expanded |

## Empty State  (3 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | A filter combination with no matches shows a no-results empty state | **DEVIATION** | READY - EXPECT FAIL | b2b.json: message is always 'No work orders match your filters' and never mentions the search, even when the search is the only thing narrowing |
| FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | The filtered empty state offers a way to clear the filters | **DEVIATION** | READY - EXPECT FAIL | b2b.json: the only empty-state control is empty_state_clear_filters ('Clear Filters'); there is no way to clear just the search from that screen |
| FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | When filters and a search find nothing, each can be cleared on its own | **DEVIATION** | READY - EXPECT FAIL **(changed)** | b2b.json searchOnly: mentionsSearch=false - the message names filters even when only a search is applied, and the empty state offers no separate search clear |

## Tab Behaviour  (6 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | The All tab shows all five filter chips, all working | **PASS** | READY | b5b.json allTabFive: 5 chips, none disabled, each opens with its options and Clear Selection |
| FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: the Status chip is not shown; the other four still work | **PASS** | READY | b1c.json estimatesTab: Status chip absent, other four present and usable |
| FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: the Status chip is not shown; the other four still work | **PASS** | READY | b1c.json completedTab: Status chip absent, other four present |
| FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | My Work Orders tab shows all five filters and they narrow that list | **PASS** | READY | b5b.json myWorkOrdersTab: 5 chips, showMyWorkOrders=1 kept, status applied on top |
| FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs and comes back on the Al | **PASS** | READY | b5.json statusAcrossTabs: status kept through Estimates and restored on All |
| FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | First visit opens the Estimates tab; your last-used tab is remembered | **PASS** | READY | b6b.json firstVisitTabClean: with no saved tab, Estimates is aria-selected=true while All is first in the row; after choosing All and returning, All is selected and the saved tab reads 'all' |

## Persistence  (6 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | Leaving the page and coming back restores the filters and the bar stat | **DEVIATION** | READY - EXPECT FAIL | b7.json persistence.navBack and .reloaded: Status keeps 'Paid' but Customer comes back as plain 'Customer' with no value name |
| FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser | **PASS** | READY | b7.json freshContext: a fresh browser context restored the filters without any action - 31 rows, chip 'Status: Paid' |
| FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | Saved filters are per user: one user's filters do not appear for anoth | **HOLD** | HOLD **(changed)** | not observed - only one account is available on this branch |
| FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | A remembered filter value that was deleted is silently ignored | **DEVIATION** | READY - EXPECT FAIL | b7.json urlBadValues: a value that does not exist is still applied - 0 rows rather than being dropped; SV-8832 read live and still Open |
| FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | **HOLD** | HOLD **(changed)** | the Parts and Reports filter bars ARE built (pr.json) but no source states how their filters should be scoped per view or tab |
| FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the update | **HOLD** | HOLD **(changed)** | not observed - the redesign is already applied on this branch, so there is no pre-redesign saved state to migrate |

## URL State and Shareable Links  (6 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | Applying filters updates the page URL to reflect the active filter sta | **PASS** | READY | b7.json urlState: one filter -> ?status=declined; a second -> both in the address bar |
| FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | Opening a shared URL or bookmark loads the page with those filters on | **DEVIATION** | READY - EXPECT FAIL | b8.json sharedLinkOnPhone: ?status=declined, ?status=paid and ?status=imported ALL sent filters[0][value]=estimate while the chip read 'Status (1)'; the same links are correct on desktop |
| FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | A URL with a deleted filter value loads and ignores that value | **DEVIATION** | READY - EXPECT FAIL | b7.json urlBadValues.deletedValue: 0 rows, so the value is applied rather than ignored |
| FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | A broken filter URL loads the page with no filters and no error | **DEVIATION** | READY - EXPECT FAIL | b7.json urlBadValues.brokenUrl: page loads and shows no error, but 0 rows rather than the full list, so the unrecognisable state is not discarded |
| FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | Opening a shared link does not change your own saved filters | **PASS** | READY **(changed)** | b7.json sharedLink: own saved filters byte-identical before and after the link visit ({status:[declined]}); SV-8828 read live and now OBSOLETE/Done |
| FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | 'Back To My Saved Filters' is not shown when you are on your own view | **PASS** | READY **(changed)** | b7.json sharedLink: Back To My Saved Filters absent on your own view, present on the shared link, and gone again after clicking it |

## Mobile Filters  (10 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | Mobile: chips sit in a scrollable row below the tabs, starting All Fil | **PASS** | READY | b8.json mobileLayout: chip row y239 below the tabs y78, overflow-x auto, scrollWidth 878 vs clientWidth 370 so it scrolls, starting with All Filters |
| FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | Mobile: All Filters opens a sheet of expandable rows with Apply filter | **PASS** | READY | b8.json allFiltersSheet: sheet of expandable rows with a footer button reading 'Apply Filters' |
| FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile: tapping Apply filters applies the statuses and updates the cou | **PASS** | READY | b8.json allFiltersSheet: ticking two statuses fired 0 list requests and left the address bar untouched; Apply Filters then fired exactly 1 and set ?status=declined&status=paid |
| FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Mobile: one chip opens its own sheet and applies only on Apply filters | **DEVIATION** | READY - EXPECT FAIL | b8.json singleChipSheet: no Apply button in a single filter's own sheet, one tap fired a request immediately, changed the address bar and closed the sheet |
| FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Mobile Customer filter has search, multi-select and removable tags | **DEVIATION** | READY - EXPECT FAIL | b9.json mobileCustomer: no Apply button, the sheet closes after each pick so a second value needs it reopened, and no removable tag strip is shown |
| FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Mobile Lead Technician and Service Advisor filters offer their search  | **PASS** | READY | b9.json mobilePeople: Lead Technician sheet 43 items and Service Advisor sheet 56 items, each with a 'Search' field and Clear Selection; selecting filters the list |
| FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | The mobile Asset on Site filter offers Yes/No with Clear Selection in  | **PASS** | READY | b9.json mobileAsset: sheet reads 'Asset on Site | close | Yes | No | Clear Selection' |
| FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Active chips and Clear Filters behave on mobile the same way as on des | **DEVIATION** | READY - EXPECT FAIL | b9.json mobileClearFilters: with two filters active there is no Clear Filters control anywhere on the phone - only per-filter Clear Selection inside the combined sheet |
| FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | Mobile has no collapse toggle: the filter chip row is always visible | **PASS** | READY | b8.json mobileLayout: no toggle_filter_bar on mobile, the chip row is always visible |
| FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | Filters matching no work orders on mobile show the same empty state as | **PASS** | READY | b9b.json mobileEmptyViaUI: 'No work orders match your filters', 0 cards, no error |

## API — Work Orders List Filtering  (6 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | The work order list request carries the active filter selections | **PASS** | READY | b11-api.json C29631: HTTP 200, 85 rows, distinct statuses ['paid'] and customers ['Ceview Builders'] - filtered by the backend |
| FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | A combined multi-filter request returns only work orders matching all  | **PASS** | READY | b11-api.json C29632: 4 rows = 1 estimate + 3 approved exactly (OR), customer B's 6 work orders absent (AND) |
| FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | A request with a deleted or unknown filter value gives no server error | **PASS** | READY **(changed)** | b11-api.json C29633: no 5xx; an unknown value matches nothing, which point 2 explicitly permits; a valid value in the same request still returns its full 90 |
| FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | A list request with malformed filter parameters does not produce a ser | **DEVIATION** | READY - EXPECT FAIL | b11-api.json C29634: no 5xx anywhere (clean 400 validation for a bad field, missing value, missing field and junk), but point 2 imports the malformed-URL requirement and the page shows 0 rows instead of the full list |
| FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | A filter combination matching nothing returns an empty list, not an er | **PASS** | READY | b11-api.json C29635: both no-match combinations return HTTP 200 with an empty work_orders list and a normal body shape |
| FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | Saved-filters service round-trip: save, reload, and per-user isolation | **HOLD** | HOLD | b11-api.json C38895: the round trip itself passes (PUT 200, GET 200, value returned exactly, never-saved key 200 with no value, path traversal a clean 404) but per-user isolation cannot be observed with one account |

## Page Search Toolbar  (13 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | Page toolbar Search expands in place and narrows the list as you type | **PASS** | READY **(changed)** | ps1.json narrowsAndClears: expands in place with placeholder 'Type to search'; 'Bahampton' narrowed 31 rows to 7 all Bahampton Holdings; the round x restored 31; clicking away collapses it when empty and keeps it open with text |
| FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | Page search combines with filters and is cleared separately | **PASS** | READY **(changed)** | ps2.json combinesWithFilters: status=paid + 'Bahampton' -> 7 rows both narrowing; clearing the search left the filter (31 paid rows); clearing the filter left the search (7 rows, box still 'Bahampton') |
| FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | Your typed search stays in this browser tab only and is never saved | **PASS** | READY | ps2.json searchNotSavedTabOnly: no 'search' key in the saved preference (keys collapsed, columns, descending, filters, sortBy, tab) and a fresh browser tab opens with an empty box and the full list |
| FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | The search term is part of the shareable page link | **PASS** | READY | ps2.json searchInShareableLink: the address bar carries search=Bahampton and opening that link elsewhere returns the same 7 rows |
| FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | On mobile the search expands in the toolbar and buttons make room | **DEVIATION** | READY - EXPECT FAIL **(changed)** | ms.json mobileSearchProbe: no page search exists on a phone - the magnifier (button_open_mobile_search) opens select_global_search, typing left the address bar unchanged and the list at 33 cards, and Create Work Order stays 332px of a 390px viewport instead of its 144px hug width |
| FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports, detail tabs) | **HOLD** | HOLD **(changed)** | last.json rolloutSweep: new page search on Work Orders and three Parts views; Customers still on the legacy input_table_search; Reports, Dashboard and Administration have no search box at all |
| FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | The top navigation search no longer filters page lists | **PASS** | READY | ps3.json topNavSearchDoesNotFilterList: typing in the top navigation search left the list at its baseline 31 rows and the address bar unchanged |
| FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | The Search box changes look as you hover over it, open it and type | **PASS** | READY **(changed)** | ps3.json searchBoxStyling: at rest a magnifier plus the word 'Search', transparent background, no border; on hover a grey rgb(97,97,97) overlay at 0.15 opacity with the label colour unchanged; open it is exactly 180px wide, focused, grows leftward (x1321 -> x1248, right edge held) and the neighbouring buttons do not move |
| FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | The list narrows shortly after you stop typing, with no button to pres | **PASS** | READY | ps1.json debounceNoButtonEnter: 0 requests while typing, one fired 406ms after the last keystroke, no Apply or Submit control exists, no popup, and Enter changed nothing (same 7 rows, 0 extra requests) |
| FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | One search box serves all Work Orders tabs and searches the tab you ar | **PASS** | READY | ps2.json oneBoxAcrossWorkOrderTabs: the term carried to the Completed tab as ?tab=complete&search=Bahampton with the box still filled |
| FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate search | **HOLD** | HOLD **(changed)** | last.json perViewSearchIsolation: the Parts half passes (the term did not carry to Purchase Orders and came back on returning to Inventory) but last.json rolloutSweep shows no search box on the report page |
| FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | An old link carrying a top-search word no longer narrows the page list | **PASS** | READY | b10.json globalSearchNoLongerFiltersList: an old-style ?q= link left the list at its baseline 31 rows with an empty box and sent no search parameter |
| FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | Collapsing the filter bar keeps an active search working | **PASS** | READY | ps2.json searchSurvivesFilterBarCollapse: 7 rows before and after collapsing, box still 'Bahampton', chips hidden |

## Parts Page Filters  (5 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | **HOLD** | HOLD | pr.json partsFilterBar: BUILT - chips Bin Location, Category and Supply, plus a collapse toggle, Clear Filters and a page search |
| FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear Selection | **HOLD** | HOLD | pr.json partsFilterBar: no Part Type chip exists; the three that do are Bin Location, Category and Supply |
| FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | **HOLD** | HOLD | pr.json partsFilterApplies: choosing a Supply value changed the address bar, so a Parts filter does narrow its page |
| FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | **HOLD** | HOLD | pr.json partsFilterBar: Bin Location and Category open multi-option lists with Clear Selection |
| FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new filter ba | **HOLD** | HOLD | pr.json partsFilterBar: three chips exist; whether that is every filter the page had before cannot be judged without the write-up |

## Reports Page Filters  (4 cases)

| Internal ID | Case | Title | Verdict | Marker | Evidence observed live this pass |
|---|---|---|---|---|---|
| FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom start/end ran | **HOLD** | HOLD | pr.json reportsDateRangeChip: BUILT - the chip reads 'Date Range: This month' by default |
| FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Every report page shows its designed filter buttons | **HOLD** | HOLD | pr.json reportsFilterBar: BUILT - chips 'Date Range: This month' and 'Filter by Staff' |
| FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | **HOLD** | HOLD | pr.json reportsFilterBar: two chips exist on the report page |
| FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Transaction Type, | **HOLD** | HOLD | pr.json reportsFilterBar: a Date Range chip and a Staff chip exist; Location and Transaction type chips do not |
