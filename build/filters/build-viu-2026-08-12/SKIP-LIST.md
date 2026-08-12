# Filters — the tester SKIP LIST for the morning of 12/13 August

**Build `v3.6-3e9dd6d`. 115 cases in run 352.**

## Do NOT run these 18. They cannot be honestly judged, and a FAIL on any of them would be wrong.

If you open one anyway, **mark it BLOCKED, never FAILED** — most now say so in their own text.

| # | Case | Title | Why it cannot be run | Currently |
|---|---|---|---|---|
| 1 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Est | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs | Passed |
| 2 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: Status chip is greyed out and pre-filled; o | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs | Passed |
| 3 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: Status chip is greyed out and pre-filled; o | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs | Passed |
| 4 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs and comes ba | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs | Passed |
| 5 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | Held for the QA lead's ruling only - the behaviour IS documented (S10-R4 says each Parts view and each Report tab keep | Untested |
| 6 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the upd | Cannot be run - it needs an account whose filters were saved before the redesign, and none exists | Untested |
| 7 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom s | Waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states the perio | Untested |
| 8 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports,  | Cannot be run yet - its own precondition needs the page-search rollout finished everywhere, and it is still part-way t | Untested |
| 9 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate | Only half of it can be run - the report pages have no page search box yet, so the report-tab half cannot be tested | Untested |
| 10 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 11 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear S | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 12 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 13 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 14 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the n | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 15 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change cover | Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons each report | Untested |
| 16 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 17 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Trans | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should d | Untested |
| 18 | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a ph | The new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet | Untested |

**Total held: 18.** Grouped by what they are actually waiting on:

| Waiting on | cases |
|---|---|
| Branko's Parts and Reports product write-up | **8** — [C38882](https://shopview.testrail.io/index.php?/cases/view/38882), [C38904](https://shopview.testrail.io/index.php?/cases/view/38904), [C38905](https://shopview.testrail.io/index.php?/cases/view/38905), [C38906](https://shopview.testrail.io/index.php?/cases/view/38906), [C38907](https://shopview.testrail.io/index.php?/cases/view/38907), [C38908](https://shopview.testrail.io/index.php?/cases/view/38908), [C38910](https://shopview.testrail.io/index.php?/cases/view/38910), [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) |
| other | **5** — [C29559](https://shopview.testrail.io/index.php?/cases/view/29559), [C29609](https://shopview.testrail.io/index.php?/cases/view/29609), [C29610](https://shopview.testrail.io/index.php?/cases/view/29610), [C29612](https://shopview.testrail.io/index.php?/cases/view/29612), [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) |
| the page-search rollout finishing | **2** — [C38891](https://shopview.testrail.io/index.php?/cases/view/38891), [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) |
| the QA lead's ruling | **1** — [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) |
| a data state that does not exist | **1** — [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) |
| the new filter bar reaching more pages | **1** — [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) |

---

## DO run these 29 — they are the real workload

Untested and genuinely runnable:

[C29581](https://shopview.testrail.io/index.php?/cases/view/29581), [C29588](https://shopview.testrail.io/index.php?/cases/view/29588), [C29618](https://shopview.testrail.io/index.php?/cases/view/29618), [C29619](https://shopview.testrail.io/index.php?/cases/view/29619), [C29620](https://shopview.testrail.io/index.php?/cases/view/29620), [C29633](https://shopview.testrail.io/index.php?/cases/view/29633), [C29634](https://shopview.testrail.io/index.php?/cases/view/29634), [C38876](https://shopview.testrail.io/index.php?/cases/view/38876), [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C38878](https://shopview.testrail.io/index.php?/cases/view/38878), [C38879](https://shopview.testrail.io/index.php?/cases/view/38879), [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), [C38884](https://shopview.testrail.io/index.php?/cases/view/38884), [C38886](https://shopview.testrail.io/index.php?/cases/view/38886), [C38888](https://shopview.testrail.io/index.php?/cases/view/38888), [C38889](https://shopview.testrail.io/index.php?/cases/view/38889), [C38893](https://shopview.testrail.io/index.php?/cases/view/38893), [C38895](https://shopview.testrail.io/index.php?/cases/view/38895), [C38896](https://shopview.testrail.io/index.php?/cases/view/38896), [C38897](https://shopview.testrail.io/index.php?/cases/view/38897), [C38898](https://shopview.testrail.io/index.php?/cases/view/38898), [C38899](https://shopview.testrail.io/index.php?/cases/view/38899), [C38900](https://shopview.testrail.io/index.php?/cases/view/38900), [C38902](https://shopview.testrail.io/index.php?/cases/view/38902), [C38903](https://shopview.testrail.io/index.php?/cases/view/38903), [C43560](https://shopview.testrail.io/index.php?/cases/view/43560), [C43561](https://shopview.testrail.io/index.php?/cases/view/43561), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563), [C43590](https://shopview.testrail.io/index.php?/cases/view/43590)

The other 68 runnable cases already carry a result.
