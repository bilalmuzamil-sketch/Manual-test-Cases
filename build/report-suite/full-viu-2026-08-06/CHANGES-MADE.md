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

## Update after batch 3 and the expect-fail block pass

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 3 (Parts Velocity) | `update_case` | 23 | HTTP 200, 30 fields compared each, 0 mismatches |
| expect-fail blocks | `update_case` | 28 | HTTP 200, 30 fields compared each, 0 mismatches |
| C30341 repair | `update_case` | 1 | HTTP 200, 30 fields compared, 0 mismatches |

Running TestRail total: **111 `update_case`** over **99 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

### A defect of our own, owned and repaired

**C30341 was damaged by this pass and then repaired.** That case stores its text as raw HTML
(`<ol>/<li>`, `<hr />`, `<p>AUTOMATION: READY</p>`). None of the writer's plain-text patterns
matched that form, so instead of REPLACING the provenance line and the marker it **appended a
second one of each**. The byte-check did not catch it because the write was faithful to the
payload — the payload itself was wrong.

Found by a census of all 476 cases, not by chance. Repaired in the same session: converted to
plain numbered text, one provenance line, one marker, and **not one word of meaning changed** —
the preconditions and steps were converted from the identical HTML and the expected-results
wording is word-for-word what it was. A guard now makes `rebuild()` **refuse outright** on any
case containing raw markup.

**13 raw-markup cases remain** (of the 14 in the brief; C30341 was the fourteenth and is now
plain text). They sit in Sales By Representative, Work In Progress and Technician Utilization,
which this session did not reach. They carry no plain-text `AUTOMATION:` marker because their
marker is wrapped in `<p>` tags.

## Update after batch 4 (Parts Velocity, 2026-08-06)

**Application data: still nothing created, deleted or altered.** Every observation this batch used the
signed-in Admin session read-only over the report read endpoints, the export endpoints and the report
page itself. The only writes anywhere were to **browser local storage inside a throwaway headless
context** (`report_view:parts-velocity`, written by the product itself when a filter, sort or column
selection changes, and once removed by us to force a genuine first-visit state). That context is
destroyed when the script ends; nothing persists on the server or in any real user's browser.
No role was changed, no role reset, no organisation setting written.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 4 (Parts Velocity) | `update_case` | 26 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **137 `update_case`** over **125 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

Six Story Defects filed, all in the Rule-52 shape (issuetype 10007 · parent = the owning story ·
priority Low · `relates to` link to the same story · no Product Area), every field read back —
11 checks each, all PASS:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | SV-8646 | Parts Velocity PDF prints Description, Category and Vendor in full instead of shortening them to 18 characters |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | SV-8646 | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a plain number |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | SV-8646 | Parts Velocity download success message is a general one and does not name the report or the file type |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | SV-8646 | Parts Velocity PDF heading shows an end date one day later than the range asked for, and is labelled "Start Date Range" |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | SV-8643 | Parts Velocity Location column sits sixth, after Vendor, instead of first before Type |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | SV-8642 | Parts Velocity opens on All locations instead of the location the user is working in |

No existing ticket was edited, commented on, transitioned or re-prioritised.
