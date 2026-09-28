# SV-10179 — Remove the "Viewing a shared link" banner; links keep working

Tested 2026-09-28.

## §0 Sources and build markers

| Source | Value |
|---|---|
| Ticket | SV-10179, status **Code Review** (not TESTING QA), priority Medium, no parent |
| Description | rewritten 2026-09-24; the earlier version (new banner wording) is withdrawn |
| Chris Ward, comment 76758 | *"this is actually a feature that was intentionally stripped out before production, and should be treated as a hallucination"* |
| Ready for QA | Dipesh Changawala, comment 77426 (28 Sep 08:00) + 77427 (env created) |
| QA branch | `sv10179.qa.shopview.com` — **v26.39.1-29d9aae**, last-modified Mon, 28 Sep 2026 12:53:08 GMT |
| Production (BEFORE) | `app.shopview.com` — **v26.39.1-3ef6ade**, last-modified Fri, 25 Sep 2026 09:32:14 GMT |

### Requirements under test (from the description)
1. No banner and no "Back to my view" button anywhere.
2. A link that carries filters opens showing those filters.
3. Just opening a link does not change your saved filters; a filter change you then make is saved normally.
4. Refreshing keeps the filters from the link.

Not in this ticket: removing filters from the address bar; any new share button.

## §1 What the banner actually is (read from the deployed production bundle)

Production still ships `/js/SharedLinkBanner.alJI_grG.js` (HTTP 200). Its exact contents:

- container `data-test-id="shared_link_banner"`, `role="status"`
- text: **" Viewing a shared link - your saved filters aren't applied "**
- button label **"Back to my view"**, `data-test-id="back_to_saved_filters"`
- click emits analytics `shared_view_exit` / `elementLabel: back_to_saved_filters`

This matters for testing: the banner only renders when the user **already has a saved
view** and the link's filters differ from it. With an empty saved view production shows
no banner either — so the BEFORE capture has to set a saved filter first.

### Every surface that carried it — production vs branch

`SharedLinkBanner` references per page chunk:

| Page chunk | Production | Branch |
|---|---|---|
| Administration | 1 | 0 |
| Customer | 1 | 0 |
| MyTimesheets | 1 | 0 |
| Parts | 1 | 0 |
| Reporting | 1 | 0 |
| SalesTaxInvoices | 1 | 0 |
| SalesTaxRatesSummary | 1 | 0 |
| VehicleInvoices | 1 | 0 |
| WorkOrders | 1 | 0 |

Nine of nine removed; no chunk on the branch references the component, the two
`data-test-id`s, or either visible string.

## §2 The save rule, read from `useFilterUrlSync` on both builds

**Production** returns `sharedViewActive` / `exitSharedView` and takes `hasSavedView` +
`protectsSavedView`. Arriving on a link that differs from a saved view sets
`suspendPersistence = true` and leaves it suspended **until the user clicks "Back to my
view"** — so nothing the user does in that session is saved.

**Branch** drops `sharedViewActive`, `exitSharedView`, `hasSavedView` and
`protectsSavedView`, and adds two things:
- an arrival snapshot `Q` plus `z()` — "has the user actually changed a non-view filter
  since arriving?"
- `applySystemState()` — lets the page set filter state programmatically and marks that
  change as system-made, so it does **not** count as a user edit.

Persistence resumes only when the change is a **user** change **and** the state really
differs from the arrival snapshot. That is the mechanism behind requirement 3 and
behind "self-tidying changes must not save".

## §3 Production BEFORE — the banner reproduced (evidence `pb-*.png`)

The banner needs a saved view, so the capture builds one first. All on
`app.shopview.com`, **v26.39.1-3ef6ade**:

| Step | What I did | What the screen showed |
|---|---|---|
| 0 | Open Work Orders | Status chip bare, 33 rows, URL `/workorders` |
| 1 | Set Status = Declined | `Status: Declined`, 11 rows, URL `?status=declined` |
| 2 | Go to Inventory and back | still `Status: Declined`, 11 rows — the saved view is real |
| 3 | Open `/workorders?status=estimate` | **BANNER: "Viewing a shared link - your saved filters aren't applied" + "Back to my view"**; `Status: Estimate`, 26 rows |
| 4 | Click **Back to my view** | banner gone, back to `Status: Declined`, 11 rows |
| 5 | Cleared the filter (restore) | Status chip bare, 33 rows, plain URL — production left as found |

Production cleanup: the saved Status filter I created was removed via the chip's own
cancel control, and the empty state was re-read after navigating away and back.

## §4 Branch — the four requirements on Work Orders

All on `sv10179.qa.shopview.com`, **v26.39.1-29d9aae**. "Saved view" is always read the
same way: navigate to Inventory, come back to Work Orders, read the chips.

| # | Check | Result |
|---|---|---|
| A1/A2 | Set Status = Declined → leave → return | still `Status: Declined` (21 rows). Saving still works |
| B1 | Open `?status=estimate` | **no banner, no "Back to my view"**, `Status: Estimate` applied |
| C1 | Open that link, leave **without touching anything** | saved view **still `Status: Declined`** — the link did not overwrite it (req. 3) |
| D1–D3 | Open `?status=paid`, then change the Asset on Site chip | leave and return → saved view is now **`Status: Paid` + `Asset on Site: Yes`** — the whole on-screen view was saved (req. 3, second half) |
| E1–E3 | Open `?status=paid`, then **search only** ("ford") | saved view **unchanged** — still `Paid` + `Asset on Site: Yes` |
| F1/F2 | Open `?status=paid`, then **sort only** (Total Price) | saved view **unchanged** |
| G1/G2 | Open `?status=paid`, then switch to the **Work Orders tab** | saved view becomes `?status=paid&tab=work_orders` — the tab switch does save |

The E and F cases are built so a wrong result would be visible: the link carries
`status=paid` and **no** `vehicleHere`, so if search or sort had wrongly saved, the
"Asset on Site: Yes" would have been dropped from the saved view. It survived both.
## §5 Branch — the link's filters really filter the list (not just the chip label)

Read from the Status column of the rows themselves, `sv10179.qa.shopview.com`:

| Link | Chip | Rows read | Status values |
|---|---|---|---|
| `?status=declined` | `Status: Declined` | 19 (18 + totals row) | Declined ×18 |
| `?status=estimate` | `Status: Estimate` | 31 (30 + totals) | Estimate ×30 |
| `?status=estimate&status=declined` | `Status: Estimate, +1` | 31 (30 + totals) | Estimate ×27, Declined ×3 |
| `?status=declined&vehicleHere=1` | `Status: Declined` | 7 (6 + totals) | Declined ×6 — both filters applied, list narrows from 19 to 7 |
| **`?status=declined` then F5** | `Status: Declined` | 19 (18 + totals) | Declined ×18 — **refresh keeps the link's filters (req. 4)** |

No banner on any of them.

## §6 Branch — no banner anywhere else either

Visited live on the branch, each checked for the banner element and for either visible
string:

| Page | Filter chips present | Banner |
|---|---|---|
| Parts → Inventory | Bin Location, Category, Supply | none |
| Customers | (no filter chips) | none |
| Reports → Punch Clock Activities | Date range, Staff | none |
| Administration → Staff | Roles, Workplaces, Departments | none |
| Schedule | (no filter chips) | none |
| Work Orders | Status, Assigned to me, Asset on Site | none |
## §7 A second page, to prove it is not only Work Orders — Parts → Part Sales

| Step | Result |
|---|---|
| Open Part Sales | lands on its own default view `?status=estimate&status=approved`, chip `Status: Estimate, +1`, 11 rows, no banner |
| Add "Invoiced" to the Status filter | chip `Status: Estimate, +2`, 30 rows |
| Leave to Work Orders, come back | still `Status: Estimate, +2` — saving works here too |

## §8 Whole-output comparison against the pre-fix build (Rule 74)

- **Chunk inventory**: production and the branch both ship **182** JavaScript chunks, and the
  **set of names is identical** — nothing added, nothing removed, so no route or page
  appeared or disappeared with this change.
- Every chunk's content hash differs, which is expected and not informative: this is a
  different build of the whole application and content hashes cascade through the import
  graph. The meaningful comparison is the one in §1 — the nine chunks that referenced
  `SharedLinkBanner` no longer do, and no other page-level behaviour module changed shape.
- **On screen**, the same link on both builds produces the same header, the same tab row,
  the same filter chips and the same table columns. The only difference is the missing blue
  bar — and, as a consequence, the tab row starting about 30 px higher.
## §9 The link must not quietly become your saved view — three pages, including a bad value

| Page | What I did | Saved view afterwards |
|---|---|---|
| Work Orders | saved view was `status=paid` + Work Orders tab. Opened `?status=declined&customer=00000000-…` (an id that does not exist). The link applied Declined (19 rows) and showed an unlabelled customer chip. Left without touching anything. | **unchanged** — back to `status=paid&tab=work_orders`, 31 rows |
| Parts → Part Sales | saved view was `Status: Estimate, +2` (30 rows). Opened `?status=declined` — 3 rows, no banner. Left without touching anything. | **unchanged** — `Status: Estimate, +2`, 30 rows |
| Parts → Inventory | saved view was the plain default. Opened `?category=00000000-…` — 0 rows, no banner. Left without touching anything. | **unchanged** — All bin locations / All categories, 30 rows |

## §10 Build markers, start and end

| Environment | At the start | At the end |
|---|---|---|
| Branch `sv10179.qa.shopview.com` | v26.39.1-29d9aae, last-modified Mon 28 Sep 2026 12:53:08 GMT | **identical** |
| Production `app.shopview.com` | v26.39.1-3ef6ade, last-modified Fri 25 Sep 2026 09:32:14 GMT | **identical** |

No redeploy under the pass, so every result above belongs to one build.

## §11 Honest notes

- **The ticket is in `Code Review`, not `TESTING QA`**, even though Dipesh posted "Ready for
  QA testing" and created the environment. Worth a status move.
- The branch session expired part-way through (`401 session_expired`). It was self-recovered
  with `quick-login` — no new cookies were needed, and the build marker was identical before
  and after, so nothing had to be re-run.
- The production BEFORE required creating a saved filter first (the banner only ever showed
  when you had one). That filter was removed afterwards and the empty state re-read.
- `Administration → Settings` was the one route not visited on screen; it has no filter bar,
  and its page chunk (`Administration`) was checked at code level and carries no banner.

## §12 Verdict

**PASS** — all four requirements met.

1. No banner and no "Back to my view" anywhere — nine of nine page chunks no longer
   reference the component, and eleven pages were checked on screen.
2. A link with filters opens showing those filters — proven from the rows, not just the chip,
   for single and multiple values.
3. Opening a link does not change your saved filters, on three different pages, including
   when the link carries a value that does not exist; and a filter change you make afterwards
   is saved normally, while search-only and sort-only are not.
4. Refreshing keeps the filters from the link.

Per the per-ticket-branch rule, a QA pass on this branch is treated as final: no re-check
queue is opened.
