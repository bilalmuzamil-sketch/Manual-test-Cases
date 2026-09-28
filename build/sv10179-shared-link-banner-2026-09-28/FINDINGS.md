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
