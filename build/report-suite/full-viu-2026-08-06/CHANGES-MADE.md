# CHANGES-MADE — Report Suite live observation, 2026-08-06

Everything created or altered by this pass, with the BEFORE value for anything that pre-existed.
Per the QA lead's ruling the QA branch is disposable, so nothing is torn down — but everything is recorded.

## Application data (sv8582.qa.shopview.com)

**Nothing was created, deleted or altered in the application.** No customer, work order, part,
invoice, asset, category or vendor was created; no organisation setting was written; no role was
changed or reset. Every observation used the signed-in Admin session read-only, over the report
read endpoints and the export endpoints.

The one thing written anywhere was **browser local storage inside a throwaway headless browser
context** — the report's own saved-view key `report_view:inventory-value` — used to reproduce the
defensive-restore path (a saved category that no longer exists). That context is destroyed when the
script ends and nothing persists on the server or in any real user's browser.

## TestRail (project 1, suite 1, group 4281)

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 1 | `update_case` | 23 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

0 `add_case` · 0 `delete_case` · 0 section writes · **0 run writes** · **0 results logged**.

## Jira

Five Story Defects filed, all in the Rule-52 shape (issuetype 10007 · parent = the owning story ·
priority Low · `relates to` link to the same story · no Product Area), every field read back:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | SV-8612 | SBC and SBR spreadsheets export money, percentages and dates as text |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | SV-8671 | Inventory Value totals row labelled "Totals" where the spec asks for "Total" |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | SV-8670 | Inventory Value opens with Margin and Total Sell already on |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | SV-8675 | Inventory Value forgets the part search text between visits |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | SV-8675 | Inventory Value keeps a saved category that no longer exists |

No existing ticket was edited, commented on, transitioned or re-prioritised.

## Update after batch 2

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 2 | `update_case` | 36 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **59 `update_case`**. Still 0 add · 0 delete · 0 section · **0 run writes**
· **0 results logged**.

Three further Story Defects filed, same Rule-52 shape, every field read back:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | SV-8668 | Inventory Value shows an empty table with no message when nothing matches |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | SV-8674 | Inventory Value opens on All locations instead of the user's current location |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | SV-8679 | Inventory Value: long text never shortens, and headings announce no sort state |

Still nothing created or altered in the application.
