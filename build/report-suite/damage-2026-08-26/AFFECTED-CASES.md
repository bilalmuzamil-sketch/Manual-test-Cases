# AFFECTED CASES — TestRail render damage introduced 2026-08-26

**72 cases.** Every one was plain text before the 12:27–12:43 write pass and now stores an
HTML `<p>` wrapper that its case-view page prints to the tester as literal text.

- Source of truth for the pre-damage content: `build/report-suite/source-verify-2026-08-26/data/live-cases.json` (captured 11:53, before the first write).
- Damage confirmed by re-GET of every case plus the served case-view page (Rule 12 — observed).
- **1 of the 72 is Automated (`custom_atmstatus = 3`): C30518.** The other 71 are not.
- **C30197 has been REPAIRED** (see FINDINGS.md §5) and is listed here for the record. 71 remain damaged.

| C-id | Link | Automated | Damaged fields | Literal tags a tester reads | Title |
|---|---|---|---|---|---|
| C30197 | https://shopview.testrail.io/index.php?/cases/view/30197 | no | expected | `</p> <p>` | The nav entry fits the full Sales By Representative label; no truncati |
| C30225 | https://shopview.testrail.io/index.php?/cases/view/30225 | no | expected | `</p> <p>` | Detail rows run newest first with a numeric invoice-number tie-break |
| C30227 | https://shopview.testrail.io/index.php?/cases/view/30227 | no | expected | `</p> <p>` | Badge colors use the canonical payment-status tokens in light and dark |
| C30239 | https://shopview.testrail.io/index.php?/cases/view/30239 | no | expected | `</p> <p>` | Mobile shows a simplified totals bar below the table; Subtotal at righ |
| C30267 | https://shopview.testrail.io/index.php?/cases/view/30267 | no | expected | `</p> <p>` | Toggling a column applies at once to summary; detail and Totals rows |
| C30273 | https://shopview.testrail.io/index.php?/cases/view/30273 | no | expected | `</p> <p>` | A stale saved value falls back to its default and never errors |
| C30281 | https://shopview.testrail.io/index.php?/cases/view/30281 | no | expected | `</p> <p>` | PDF footer on every page, default-logo fallback, and deterministic PDF |
| C30285 | https://shopview.testrail.io/index.php?/cases/view/30285 | no | expected | `</p> <p>` | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep |
| C30286 | https://shopview.testrail.io/index.php?/cases/view/30286 | no | expected | `</p> <p>` | Expanded CSV: file name, verbatim headers, one row per invoice |
| C30288 | https://shopview.testrail.io/index.php?/cases/view/30288 | no | expected | `</p> <p>` | The Unassigned row appears in both CSV downloads only when the toggle  |
| C30291 | https://shopview.testrail.io/index.php?/cases/view/30291 | no | expected | `</p> <p>` | An empty-data export still generates with zeroed Summary PDF totals |
| C30298 | https://shopview.testrail.io/index.php?/cases/view/30298 | no | expected | `</p> <p>` | Empty state: verbatim message, no grand Totals, toolbar stays interact |
| C30304 | https://shopview.testrail.io/index.php?/cases/view/30304 | no | expected | `</p> <p>` | Touch targets are at least 44×44 px and touch users get no hover-only  |
| C30305 | https://shopview.testrail.io/index.php?/cases/view/30305 | no | expected | `</p> <p>` | Layout: white toolbar; blue-grey page; separator; edge-to-edge white t |
| C30306 | https://shopview.testrail.io/index.php?/cases/view/30306 | no | expected | `</p> <p>` | Dark mode: page, toolbar, table; Totals switch to dark equivalents |
| C30307 | https://shopview.testrail.io/index.php?/cases/view/30307 | no | expected | `</p> <p>` | Every icon-only control carries its specified accessible name |
| C30309 | https://shopview.testrail.io/index.php?/cases/view/30309 | no | expected | `</p> <p>` | The subdued grey of the (N) count and (Inactive) tag meets WCAG AA con |
| C30316 | https://shopview.testrail.io/index.php?/cases/view/30316 | no | expected | `</p> <p>` | A rep's invoice detail rows are fetched from the server only on the fi |
| C30319 | https://shopview.testrail.io/index.php?/cases/view/30319 | no | expected | `</p> <p>` | All four exports are generated server-side against the active filters  |
| C30323 | https://shopview.testrail.io/index.php?/cases/view/30323 | no | expected | `</p> <p>` | First visit: date range defaults to This Year and data is fetched auto |
| C30324 | https://shopview.testrail.io/index.php?/cases/view/30324 | no | expected | `</p> <p>` | A loading indicator shows and old rows are replaced only when data ret |
| C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 | no | expected | `</p> <p>` | Location filter is rightmost, defaults to the active location, accessi |
| C30343 | https://shopview.testrail.io/index.php?/cases/view/30343 | no | expected | `</p> <p>` | Rows load ranked by Demand descending, indicator on the Demand header |
| C30347 | https://shopview.testrail.io/index.php?/cases/view/30347 | no | expected | `</p> <p>` | Description; Category and Vendor truncate on hover; Part # never does |
| C30373 | https://shopview.testrail.io/index.php?/cases/view/30373 | no | expected | `</p> <p>` | Movement and billed bases may differ; Sold (WO) + Sold (Parts Sale) =  |
| C30374 | https://shopview.testrail.io/index.php?/cases/view/30374 | no | expected | `</p> <p>` | Window anchors: movement uses the event date, billed uses the WO date |
| C30376 | https://shopview.testrail.io/index.php?/cases/view/30376 | no | expected | `</p> <p>` | Both exports reflect the filters and search active at the time of expo |
| C30378 | https://shopview.testrail.io/index.php?/cases/view/30378 | no | expected | `</p> <p>` | Exports reflect the active sort, including Min/Max and null placement |
| C30379 | https://shopview.testrail.io/index.php?/cases/view/30379 | no | expected | `</p> <p>` | PDF: filename, A3 landscape, title, text truncation, and the shop logo |
| C30384 | https://shopview.testrail.io/index.php?/cases/view/30384 | no | expected | `</p> <p>` | Export toasts: exact success texts; server or fallback error text on f |
| C30388 | https://shopview.testrail.io/index.php?/cases/view/30388 | no | expected | `</p> <p>` | The report is server-paginated - the backend returns one page of rows  |
| C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 | no | expected | `</p> <p>` | Each filter or search change re-queries the server and returns page on |
| C30391 | https://shopview.testrail.io/index.php?/cases/view/30391 | no | expected | `</p> <p>` | The back end serves report data and export on ordinary reports access |
| C30466 | https://shopview.testrail.io/index.php?/cases/view/30466 | no | expected | `</p> <p>` | With all toggleable columns on, the fixed column order and alignment h |
| C30468 | https://shopview.testrail.io/index.php?/cases/view/30468 | no | expected | `</p> <p>` | The WO # is a link that opens the WO in the same browser tab |
| C30469 | https://shopview.testrail.io/index.php?/cases/view/30469 | no | expected | `</p> <p>` | Status shows as a color-coded badge whose label text is always present |
| C30471 | https://shopview.testrail.io/index.php?/cases/view/30471 | no | expected | `</p> <p>` | Customer shows the customer's company name |
| C30473 | https://shopview.testrail.io/index.php?/cases/view/30473 | no | expected | `</p> <p>` | Last Activity shows Today; Xd ago; or an em-dash when there is none |
| C30481 | https://shopview.testrail.io/index.php?/cases/view/30481 | no | expected | `</p> <p>` | Labor Delta shows quoted minus worked hours; signed to one decimal |
| C30482 | https://shopview.testrail.io/index.php?/cases/view/30482 | no | preconds, steps, expected | `</p> <br> <p>` | An open estimate with no approved work shows $0.00 in every money colu |
| C30483 | https://shopview.testrail.io/index.php?/cases/view/30483 | no | expected | `</p> <p>` | The initial sort is Days Open with the longest-open work order first |
| C30484 | https://shopview.testrail.io/index.php?/cases/view/30484 | no | expected | `</p> <p>` | Clicking a header sorts ascending, clicking again toggles descending |
| C30486 | https://shopview.testrail.io/index.php?/cases/view/30486 | no | expected | `</p> <p>` | Sorting reorders only the active tab's rows; Totals stays at the botto |
| C30494 | https://shopview.testrail.io/index.php?/cases/view/30494 | no | expected | `</p> <p>` | Each tab has a Totals row pinned to the bottom, labeled "Totals" |
| C30495 | https://shopview.testrail.io/index.php?/cases/view/30495 | no | expected | `</p> <p>` | The Totals row sums each visible money column and the Labor Delta colu |
| C30499 | https://shopview.testrail.io/index.php?/cases/view/30499 | no | expected | `</p> <p>` | Customer filter is a type-ahead multi-select reading "All customers" |
| C30500 | https://shopview.testrail.io/index.php?/cases/view/30500 | no | expected | `</p> <p>` | Asset filter shows Unit # and VIN and matches text against either one |
| C30503 | https://shopview.testrail.io/index.php?/cases/view/30503 | no | expected | `</p> <p>` | Location filter: rightmost multi-select with All locations, reloads on |
| C30504 | https://shopview.testrail.io/index.php?/cases/view/30504 | no | expected | `</p> <p>` | The location scope never includes an inaccessible location |
| C30505 | https://shopview.testrail.io/index.php?/cases/view/30505 | no | expected | `</p> <p>` | Advisor, customer and asset filters AND together and recompute strip a |
| C30509 | https://shopview.testrail.io/index.php?/cases/view/30509 | no | expected | `</p> <p>` | A saved setting that is no longer valid falls back to its default |
| C30513 | https://shopview.testrail.io/index.php?/cases/view/30513 | no | expected | `</p> <p>` | Labor Delta green/red coloring appears on screen and in the PDF; not t |
| C30514 | https://shopview.testrail.io/index.php?/cases/view/30514 | no | expected | `</p> <p>` | Days Open in a download is frozen at the moment the file is generated |
| C30516 | https://shopview.testrail.io/index.php?/cases/view/30516 | no | expected | `</p> <p>` | Export headers read "Unit" and "Branch" — documented limitation, do no |
| C30517 | https://shopview.testrail.io/index.php?/cases/view/30517 | no | expected | `</p> <p>` | The PDF shows the shop logo at the top when one is set |
| C30518 | https://shopview.testrail.io/index.php?/cases/view/30518 | YES | expected | `</p> <p>` | Export notifications: success caption, "Empty export" warning |
| C30521 | https://shopview.testrail.io/index.php?/cases/view/30521 | no | expected | `</p> <p>` | The Total column is bold and stays pinned right on sideways scroll |
| C30523 | https://shopview.testrail.io/index.php?/cases/view/30523 | no | expected | `</p> <p>` | The WO # link is keyboard-focusable and opens the work order |
| C30525 | https://shopview.testrail.io/index.php?/cases/view/30525 | no | preconds, steps, expected | `</p> <br> <p>` | In dark mode every table; strip; link and coloring stays legible |
| C38890 | https://shopview.testrail.io/index.php?/cases/view/38890 | no | expected | `</p> <p>` | A technician still clocked in counts toward Labor Earned, capped at th |
| C38914 | https://shopview.testrail.io/index.php?/cases/view/38914 | no | expected | `</p> <p>` | Location column: leftmost before Type; own location per row; Multiple  |
| C43557 | https://shopview.testrail.io/index.php?/cases/view/43557 | no | expected | `</p> <p>` | The WO # is plain text, not a link, without Work Order permission |
| C43814 | https://shopview.testrail.io/index.php?/cases/view/43814 | no | expected | `</p> <p>` | Adjustments column appears in the fixed column order and in the first- |
| C43815 | https://shopview.testrail.io/index.php?/cases/view/43815 | no | expected | `</p> <p>` | Adjustments is the signed net of work-order-level fees and discounts |
| C43816 | https://shopview.testrail.io/index.php?/cases/view/43816 | no | expected | `</p> <p>` | A work-order fee or discount moves only Adjustments and Total |
| C43817 | https://shopview.testrail.io/index.php?/cases/view/43817 | no | expected | `</p> <p>` | A row's Total is Earned plus Remaining plus Adjustments |
| C43819 | https://shopview.testrail.io/index.php?/cases/view/43819 | no | expected | `</p> <p>` | The Totals row sums the Adjustments column across the tab's visible jo |
| C43828 | https://shopview.testrail.io/index.php?/cases/view/43828 | no | preconds, steps, expected | `</p> <br> <p>` | Adjustments column appears between Shop Supplies and Margin |
| C43829 | https://shopview.testrail.io/index.php?/cases/view/43829 | no | expected | `</p> <p>` | Adjustments is the signed net of invoice-level fees and discounts |
| C43830 | https://shopview.testrail.io/index.php?/cases/view/43830 | no | preconds, steps, expected | `</p> <br> <p>` | Every row ties out once Shop Supplies and Adjustments are included |
| C43833 | https://shopview.testrail.io/index.php?/cases/view/43833 | no | expected | `</p> <p>` | CSV export repeats the PDF header's Product Type, status and Locations |
| C43834 | https://shopview.testrail.io/index.php?/cases/view/43834 | no | expected | `</p> <p>` | CSV export repeats the PDF header's date range and Locations filter li |

## Breakdown

- `expected` only: 68 cases
- `preconds` + `steps` + `expected`: 4 cases (C30482, C30525, C43828, C43830)

## OUTSTANDING — what I need from you

Approval to run the proven UI repair over the remaining 71 cases (1 of them Automated — C30518 needs Vlad's go-ahead separately, Rules 65/71).
