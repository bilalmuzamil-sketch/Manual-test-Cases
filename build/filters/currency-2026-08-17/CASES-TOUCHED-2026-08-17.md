# Filters currency pass — CASES TOUCHED (2026-08-17)

**Pass:** `build/filters/currency-2026-08-17/` · worker = TestRail user id 3 (Bilal Muzamil)
**All 55 are `created_by=3` (ours). 0 foreign cases touched. All byte-verified (30 fields each, 0 mismatch).**

Each case was re-stamped v19 → v21: `refs` version pin (`[spec v21 2026-08-14]`), provenance line
(Confluence version 21, spec + epic read-dates → 17 August 2026), stale sentence-2 build line dropped,
marker per policy (plain READY → Rule-69 transitional marker; HOLD / EXPECT-FAIL markers kept verbatim).
**Case bodies (title, preconditions, steps, expected-result assertions) were NOT changed** — only the
metadata/provenance layer moved (confirmed byte-identical bodies, §2.10).

| # | Internal ID | C-ID | Link | New marker | Title |
|---|---|---|---|---|---|
| 1 | FLT-API-01 | C29631 | https://shopview.testrail.io/index.php?/cases/view/29631 | Rule-69 | The work order list request carries the active filter selections |
| 2 | FLT-API-02 | C29632 | https://shopview.testrail.io/index.php?/cases/view/29632 | Rule-69 | A combined multi-filter request returns only work orders matching all filters |
| 3 | FLT-API-03 | C29633 | https://shopview.testrail.io/index.php?/cases/view/29633 | Rule-69 | A request with a deleted or unknown filter value gives no server error |
| 4 | FLT-API-04 | C29634 | https://shopview.testrail.io/index.php?/cases/view/29634 | EXPECT-FAIL | A list request with malformed filter parameters does not produce a server error |
| 5 | FLT-API-05 | C29635 | https://shopview.testrail.io/index.php?/cases/view/29635 | Rule-69 | A filter combination matching nothing returns an empty list, not an error |
| 6 | FLT-API-06 | C38895 | https://shopview.testrail.io/index.php?/cases/view/38895 | Rule-69 | Saved-filters service round-trip: save, reload, and per-user isolation |
| 7 | FLT-ASSET-02 | C29590 | https://shopview.testrail.io/index.php?/cases/view/29590 | Rule-69 | Choosing Yes shows only work orders whose asset is on site |
| 8 | FLT-ASSET-04 | C29592 | https://shopview.testrail.io/index.php?/cases/view/29592 | Rule-69 | Clear Selection in the Asset on Site dropdown removes the filter |
| 9 | FLT-ASSET-05 | C29593 | https://shopview.testrail.io/index.php?/cases/view/29593 | Rule-69 | Clicking outside the Asset on Site dropdown closes it |
| 10 | FLT-ASSET-06 | C29594 | https://shopview.testrail.io/index.php?/cases/view/29594 | Rule-69 | An Asset on Site choice that matches no work orders shows the empty state |
| 11 | FLT-ASSET-07 | C38878 | https://shopview.testrail.io/index.php?/cases/view/38878 | Rule-69 | Choosing No shows only work orders whose asset is not on site |
| 12 | FLT-CHIP-01 | C29595 | https://shopview.testrail.io/index.php?/cases/view/29595 | Rule-69 | A chip with a selected value turns blue and shows the value |
| 13 | FLT-CHIP-02 | C29596 | https://shopview.testrail.io/index.php?/cases/view/29596 | Rule-69 | A chip with several values shows the first ones and shortens the rest |
| 14 | FLT-EMPTY-01 | C29606 | https://shopview.testrail.io/index.php?/cases/view/29606 | Rule-69 | A filter combination with no matches shows a no-results empty state |
| 15 | FLT-EMPTY-03 | C38897 | https://shopview.testrail.io/index.php?/cases/view/38897 | Rule-69 | When filters and a search find nothing, each can be cleared on its own |
| 16 | FLT-MOB-09 | C29629 | https://shopview.testrail.io/index.php?/cases/view/29629 | Rule-69 | Mobile has no collapse toggle: the filter chip row is always visible |
| 17 | FLT-MOB-10 | C29630 | https://shopview.testrail.io/index.php?/cases/view/29630 | Rule-69 | Filters matching no work orders on mobile show the same empty state as desktop |
| 18 | FLT-MOB-11 | C43563 | https://shopview.testrail.io/index.php?/cases/view/43563 | Rule-69 | On a phone, picking Imported works alone and disables the other filters |
| 19 | FLT-PARTS-01 | C38904 | https://shopview.testrail.io/index.php?/cases/view/38904 | HOLD | Every Parts list page shows its designed filter buttons |
| 20 | FLT-PARTS-09 | C38905 | https://shopview.testrail.io/index.php?/cases/view/38905 | HOLD | Part Type filter opens a Core / Non Core list with Clear Selection |
| 21 | FLT-PARTS-11 | C38906 | https://shopview.testrail.io/index.php?/cases/view/38906 | HOLD | Choosing a Parts filter narrows the list on that page |
| 22 | FLT-PARTS-13 | C38908 | https://shopview.testrail.io/index.php?/cases/view/38908 | HOLD | Every filter a page had before is still available in the new filter bar |
| 23 | FLT-PERS-02 | C29614 | https://shopview.testrail.io/index.php?/cases/view/29614 | Rule-69 | Filters are remembered permanently, even after closing the browser |
| 24 | FLT-PERS-03 | C29615 | https://shopview.testrail.io/index.php?/cases/view/29615 | Rule-69 | Saved filters are per user: one user's filters do not appear for another user |
| 25 | FLT-PERS-05 | C38880 | https://shopview.testrail.io/index.php?/cases/view/38880 | HOLD | Each page and tab remembers its own filters separately |
| 26 | FLT-PERS-07 | C43560 | https://shopview.testrail.io/index.php?/cases/view/43560 | Rule-69 | When two devices set different filters, the last one saved wins |
| 27 | FLT-PSRCH-01 | C38883 | https://shopview.testrail.io/index.php?/cases/view/38883 | Rule-69 | Page toolbar Search expands in place and narrows the list as you type |
| 28 | FLT-PSRCH-02 | C38884 | https://shopview.testrail.io/index.php?/cases/view/38884 | Rule-69 | Page search combines with filters and is cleared separately |
| 29 | FLT-PSRCH-03 | C38886 | https://shopview.testrail.io/index.php?/cases/view/38886 | Rule-69 | Your typed search stays in this browser tab only and is never saved |
| 30 | FLT-PSRCH-04 | C38888 | https://shopview.testrail.io/index.php?/cases/view/38888 | Rule-69 | The search term is part of the shareable page link |
| 31 | FLT-PSRCH-05 | C38889 | https://shopview.testrail.io/index.php?/cases/view/38889 | EXPECT-FAIL | On mobile the search expands in the toolbar and buttons make room |
| 32 | FLT-PSRCH-06 | C38891 | https://shopview.testrail.io/index.php?/cases/view/38891 | HOLD | Every list page keeps its own search box (Parts, Reports, detail tabs) |
| 33 | FLT-PSRCH-07 | C38893 | https://shopview.testrail.io/index.php?/cases/view/38893 | Rule-69 | The top navigation search no longer filters page lists |
| 34 | FLT-PSRCH-08 | C38898 | https://shopview.testrail.io/index.php?/cases/view/38898 | Rule-69 | The Search box changes look as you hover over it, open it and type |
| 35 | FLT-PSRCH-09 | C38899 | https://shopview.testrail.io/index.php?/cases/view/38899 | Rule-69 | The list narrows shortly after you stop typing, with no button to press |
| 36 | FLT-PSRCH-10 | C38900 | https://shopview.testrail.io/index.php?/cases/view/38900 | Rule-69 | One search box serves all Work Orders tabs and searches the tab you are on |
| 37 | FLT-PSRCH-11 | C38901 | https://shopview.testrail.io/index.php?/cases/view/38901 | HOLD | Each Report tab and each Parts view keeps its own separate search |
| 38 | FLT-PSRCH-12 | C38902 | https://shopview.testrail.io/index.php?/cases/view/38902 | Rule-69 | An old link carrying a top-search word no longer narrows the page list |
| 39 | FLT-PSRCH-14 | C43561 | https://shopview.testrail.io/index.php?/cases/view/43561 | Rule-69 | On a phone, pages with two or more icon buttons collapse them into one menu |
| 40 | FLT-RPTS-01 | C38909 | https://shopview.testrail.io/index.php?/cases/view/38909 | HOLD | Report filter bars appear on the reports this change covers |
| 41 | FLT-RPTS-21 | C38910 | https://shopview.testrail.io/index.php?/cases/view/38910 | HOLD | Choosing a Reports filter narrows the report results |
| 42 | FLT-RPTS-22 | C38911 | https://shopview.testrail.io/index.php?/cases/view/38911 | HOLD | New Reports filter types behave correctly (Location, Transaction Type, etc.) |
| 43 | FLT-STAT-02 | C29561 | https://shopview.testrail.io/index.php?/cases/view/29561 | Rule-69 | Ticking one status filters the table immediately, with no apply button |
| 44 | FLT-STAT-03 | C29562 | https://shopview.testrail.io/index.php?/cases/view/29562 | Rule-69 | Ticking several statuses shows work orders matching any of them |
| 45 | FLT-STAT-04 | C29563 | https://shopview.testrail.io/index.php?/cases/view/29563 | Rule-69 | Clear Selection in the Status dropdown unticks every status |
| 46 | FLT-STAT-05 | C29564 | https://shopview.testrail.io/index.php?/cases/view/29564 | Rule-69 | Clicking outside the Status dropdown closes it and keeps the selections applied |
| 47 | FLT-STAT-06 | C29565 | https://shopview.testrail.io/index.php?/cases/view/29565 | Rule-69 | Selecting statuses that no work order has shows the empty state |
| 48 | FLT-STAT-07 | C38877 | https://shopview.testrail.io/index.php?/cases/view/38877 | Rule-69 | Imported works alone: picking it greys out the other filters |
| 49 | FLT-TAB-06 | C38876 | https://shopview.testrail.io/index.php?/cases/view/38876 | Rule-69 | First visit opens the Estimates tab; your last-used tab is remembered |
| 50 | FLT-URL-01 | C29617 | https://shopview.testrail.io/index.php?/cases/view/29617 | Rule-69 | Applying filters updates the page URL to reflect the active filter state |
| 51 | FLT-URL-02 | C29618 | https://shopview.testrail.io/index.php?/cases/view/29618 | Rule-69 | Opening a shared URL or bookmark loads the page with those filters on |
| 52 | FLT-URL-03 | C29619 | https://shopview.testrail.io/index.php?/cases/view/29619 | EXPECT-FAIL | A URL with a deleted filter value loads and ignores that value |
| 53 | FLT-URL-04 | C29620 | https://shopview.testrail.io/index.php?/cases/view/29620 | EXPECT-FAIL | A broken filter URL loads the page with no filters and no error |
| 54 | FLT-URL-05 | C38879 | https://shopview.testrail.io/index.php?/cases/view/38879 | Rule-69 | Opening a shared link does not change your own saved filters |
| 55 | FLT-URL-06 | C38896 | https://shopview.testrail.io/index.php?/cases/view/38896 | Rule-69 | 'Back to my view' is not shown when you are on your own view |
