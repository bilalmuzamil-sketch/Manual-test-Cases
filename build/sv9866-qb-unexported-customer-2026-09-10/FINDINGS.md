# SV-9866 — Customer Name Missing From QuickBooks Unexported List

**Ticket:** [SV-9866](https://shopview.atlassian.net/browse/SV-9866) · Bug · priority High · reporter
Ryan Fyfe · status TESTING QA · customer **Cody McCarthy / Carolina Axle Surgeons** (172 users, via
Intercom).

**Reported symptom (the ticket's own words, which is what must be re-tested):** in
**Reports → QB Unexported**, some unexported items — *"multiple Deposit Create and Deposit
Application entries"* — show a **blank Customer**, so you cannot tell which customer a failed sync
belongs to. Expected: *"Every customer-related transaction in QB Unexported should display the
associated Customer Name."*

**Dev's QA plan:** [comment 76276](https://shopview.atlassian.net/browse/SV-9866?focusedCommentId=76276)
by Dipesh Changawala — setup (clear the *Customer Deposit Item* mapping so the deposit sync pauses),
A Deposit Create, B Deposit Application, C control (Payment / Invoice Create keep their names),
regression on the Vendors and Journal Entries tabs, and an explicit not-in-scope list (blank **No.**
on Deposit Application rows; Credit Memo Create showing *"Unknown"*).

## Environment

| | |
|---|---|
| QA branch | `sv9866.qa.shopview.com` — **build `v26.36.2-4cbf6d0`**, `index.html` last-modified **Thu 10 Sep 2026 09:11:57 GMT**, etag `W/"175fab97d13d14acfd138f0de9ec1d2e"` |
| Org | `d55bc308-…` (a staging clone; work orders renumbered `S9866-…`) |
| Report route | `/reports/unexported-items` |
| Report endpoint | `GET /api/bookkeeping/unexported-items?filters[0][field]=groupName&filters[0][value]=customer\|vendor\|journal_entry` |
| Columns | Date · Type · No. · Customer · Error · Export Manually · Mark As Exported |

## What the report looked like before anything was seeded

**Customers (0) · Vendors (0) · Journal Entries (0)** — the branch had no unexported rows at all, so
every row below is one this pass created. Evidence `ev/branch-report-empty-before-seeding.png`.

## What was driven, in the UI

Deposits and the payment were created **by hand in the app** (Finance tab → Add Deposit / New
Payment), not by API — the end user reaches this through the screen. Work-order screening (finding a
work order whose invoice details endpoint responds) was done by API; that is setup, not the thing
under test.

| Seeded | Work order | Customer | Result |
|---|---|---|---|
| Deposit **DEP-4703**, **DEP-4704** — $250 Cash | S9866-17435 (Approved) | Andrews' Truck & Trailer Repair LLC | `POST /api/deposits` → `status: held` |
| Deposit **DEP-4705** — $20 Cash | S9866-15924 (Approved) | Lexington Park Diesel Repair | created |
| Deposit **DEP-4706** — $50 Cash | S9866-16174 (Approved) | Henderson Mobile Truck Repair | created |
| Payment — $248.22 Cash (control) | S2-17540 (Invoiced) | Desert Edge Truck Service & Repair | `POST /api/customer-account/create-customer-payment` → `bookkeepingSyncDeferred: true` |

## Result on the fixed branch

**Customers tab — 5 rows, 0 with a blank Customer** (read from the API and seen on screen;
`ev/branch-report-5-rows.png`):

| Type | No. | Customer | Error |
|---|---|---|---|
| Payment Create | *(blank)* | Desert Edge Truck Service & Repair | QuickBooks needs to be reconnected… |
| Deposit Create | DEP-4706 | Henderson Mobile Truck Repair | QuickBooks needs to be reconnected… |
| Deposit Create | DEP-4705 | Lexington Park Diesel Repair | QuickBooks needs to be reconnected… |
| Deposit Create | DEP-4704 | Andrews' Truck & Trailer Repair LLC | QuickBooks needs to be reconnected… |
| Deposit Create | DEP-4703 | Andrews' Truck & Trailer Repair LLC | QuickBooks needs to be reconnected… |

**Vendors 0 · Journal Entries 0** — both tabs are empty on this branch, so the dev's regression check
(vendor names / user names still shown) **has nothing to look at**. Not passed, not failed: nothing
to observe.

## Three things that stop this being a verdict yet

**1. The error path is not the one the plan targets — and the plan says the path matters.** Every row
here reads *"QuickBooks needs to be reconnected. Go to Settings → Integrations → QuickBooks,
reconnect, then retry."* The plan asks for *"QuickBooks deposit sync paused: required Customer
Deposits Liability mapping or Customer Deposit Applied item mapping is missing"*, and warns that a
**different** error (*"A business validation error has occurred…"*) is *"a different code path, and it
correctly shows the customer name"*. So a populated name on a **third** path is not yet proof that the
reported path was fixed.

**2. The mapping setup in the plan cannot be performed on this branch.** QuickBooks is enabled for the
org (`bookkeeping_enabled: true` in the login payload; the `QuickBooks` feature flag is on) but it is
**not connected**, and **there is no QuickBooks item under Administration → INTEGRATIONS** (only IBS).
The route `/administration/QuickBooks` exists and is permission-gated on `settingsIntegrations` with a
`beforeEnter` guard that requires `isQuickBooksEnabled()`, but the page renders empty. So the
*Customer Money Items → Customer Deposit Item* row cannot be cleared here.

**3. Deposit Application could not be produced.** It needs the work order with the deposit to be
invoiced, and invoicing is blocked on this branch: every candidate work order shows **"Over Limit"**
and Create Invoice fires `GET /api/invoices/ibs/retrieveIBSApproval` → **400**, with the page banner
*"IBS Location ID not configured for workplace; b3c8c820-…"*. One work order (S9866-15924) also
returns **500** on `GET /api/invoices/{id}/details`. Deposits, payments and the report itself all work
— only the invoice step is gated.

## Also observed, reported not judged

The **Payment Create** row has a **blank No.** column. The plan's not-in-scope list covers a blank
**No.** on *Deposit Application* rows, not on Payment Create. Recorded as an observation; no pre-fix
baseline to call it a change.

## Harness note worth keeping

`/administration/QuickBooks` first rendered blank from my own harness, not the app: the route guard
reads **`localStorage.bookkeeping_enabled === "true"`**, and the boot script only seeded `user`,
`fe_permissions_wrapper` and `token`. The value comes from the login payload at
`data.details.bookkeeping_enabled`. Seeding it fixed the guard (the nav item is still absent, which is
a separate matter).
