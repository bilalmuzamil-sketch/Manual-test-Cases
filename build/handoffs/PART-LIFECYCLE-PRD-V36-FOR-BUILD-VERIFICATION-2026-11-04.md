# Part Lifecycle — PRD v36 changes to check in existing test cases (for the build-verification session, 4 Nov 2026)

Source: PRD "Parts Lifecycle Update", Confluence 829227015, **version 36** (edited 3 Nov 2026 by Chris Ward; Change Log: rulings on
SV-12105, SV-12110 and SV-12115). Only three requirement lines changed from version 35; every other line is word for word the same.

## What changed (verbatim from v36)
- **S6-R5:** "Tracked parts sort against each other by the quantity shown in the Total Qty column. The printed count sheet follows the same order."
  (v35: "Tracked parts sort against each other by quantity.") — ruling on SV-12105.
- **S11-R3c:** "While an inventory part, an open part request, a work order line that received it, or a part return (open or credited) still uses the entry, the Delete button is disabled and hovering it shows "Part cannot be deleted. Please delete related parts first.""
  (v35: "While an inventory part, an open part request or a part return still uses the entry, …") — ruling on SV-12115.
- **S13-R19a:** "A line that only shares the old number, typed in by hand with no link to this part, keeps its number. A part request added by picking this part's Part Library result is linked to it, and takes the new number."
  (v35 had only the first sentence.) — ruling on SV-12110.

## Test cases to check against v36

| Case | Title | PRD reference | What to check |
|---|---|---|---|
| [C154775](https://shopview.testrail.io/index.php?/cases/view/154775) | Total Qty sort puts untracked parts below tracked parts in both directions | S6-R5 | Tracked parts sort by the quantity shown in Total Qty; the printed count sheet follows the same order |
| [C154829](https://shopview.testrail.io/index.php?/cases/view/154829) | Clicking a Part Library row opens the entry's detail page | S11-R3c (quoted) | Quote and any Delete-state result |
| [C573671](https://shopview.testrail.io/index.php?/cases/view/573671) | Delete is disabled while a part still uses the Part Library entry | S11-R3c | New blockers: a work order line that received the part; a part return, open or credited |
| [C847730](https://shopview.testrail.io/index.php?/cases/view/847730) | Delete in Edit Library Part is enabled only after the page is reloaded | S11-R3c | Quote and blockers list |
| [C154833](https://shopview.testrail.io/index.php?/cases/view/154833) | Deleting an unused Part Library entry asks and confirms in Part Library words | S11-R3c | "Unused" now also means no received work order line and no open or credited return |
| [C425620](https://shopview.testrail.io/index.php?/cases/view/425620) | Deleting a Part Library entry that a part uses is refused | S11-R3c | Quote and blockers list |
| [C839446](https://shopview.testrail.io/index.php?/cases/view/839446) | A purchase order line typed by hand with the old number keeps its number | S13-R19a | First sentence unchanged; quote now has the second sentence |
| [C425700](https://shopview.testrail.io/index.php?/cases/view/425700) | A delivery opened before a rename is received under the new number | S13-R19a | Quote; a part request picked from the Part Library takes the new number |
| [C839447](https://shopview.testrail.io/index.php?/cases/view/839447) | A hand-typed purchase order line is received under its own number | S13-R19a | Quote; contrast with a Part Library-picked part request |

## New test cases created 4 Nov 2026 (this lane) — please build-verify

| Case | Title | PRD / ticket | In run 556 |
|---|---|---|---|
| [C913767](https://shopview.testrail.io/index.php?/cases/view/913767) | The printed count sheet follows the Total Qty sort order | S6-R5 | Yes |
| [C913768](https://shopview.testrail.io/index.php?/cases/view/913768) | Delete stays disabled while a work order line received the entry's part | S11-R3c | Yes |
| [C913769](https://shopview.testrail.io/index.php?/cases/view/913769) | Delete stays disabled while a credited return uses the entry | S11-R3c | Yes |
| [C913770](https://shopview.testrail.io/index.php?/cases/view/913770) | A part request picked from the Part Library result takes the new number | S13-R19a | Yes |
| [C913771](https://shopview.testrail.io/index.php?/cases/view/913771) | A received vendor bill line refuses an inactive part's typed number | SV-12010 | No — held until SV-12010 ships |
| [C913772](https://shopview.testrail.io/index.php?/cases/view/913772) | A vendor bill line holding a part later set inactive still saves | SV-12010 | No — held until SV-12010 ships |

An open part return as a Delete blocker (S11-R3c) is not reachable by hand, so it has no case.

Run: 556 "Part Lifecycle - Execution" (Mudassir), QA branch https://sv10647.qa.shopview.com/.
