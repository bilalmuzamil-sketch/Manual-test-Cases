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

---

## The pre-fix reference: staging (added after staging + production access arrived)

**Build markers, all read live 10 Sep 2026 — all three are on the same frontend minor, different
commits, so the frontend version does not tell us where the backend fix is:**

| Environment | app-version | index.html last-modified |
|---|---|---|
| staging `app.staging.shopview.com` | `v26.36.2-617d8d1` | Thu 10 Sep 11:23:49 GMT |
| QA branch `sv9866.qa.shopview.com` | `v26.36.2-4cbf6d0` | Thu 10 Sep 09:11:57 GMT |
| production `app.shopview.com` | `v26.36.2-dbe16f4` | Thu 10 Sep 08:54:50 GMT |

### The defect reproduces on staging, on exactly the path the ticket and the QA plan describe

Read from the report's own endpoint and then seen on screen (`ev/EX1-before-staging-blank-deposits.png`,
raw capture `ev/staging-raw-deposit-rows.png`). Three rows, adjacent in the list:

| Type | No. | Customer | Error |
|---|---|---|---|
| **Deposit Application** | *(blank)* | **BLANK** | "QuickBooks deposit-on-invoice sync skipped: required Customer Deposit Applied item mapping…" |
| **Deposit Create** | **DEP-4710** | **BLANK** | "QuickBooks deposit sync paused: required Customer Deposits Liability mapping or Customer D…" |
| Deposit Create | DEP-4709 | 4 Star Truck Repair | "A business validation error has occurred…" |

**That is the dev's warning confirmed from the other side:** the blank is specific to the
missing-mapping path, and a deposit that fails for a different reason keeps its name. So a populated
name on some *other* path is not evidence about this fix.

### Per-type blank counts on staging — 586 rows fetched, all of them

| Type | rows | blank |
|---|---|---|
| Invoice Create | 451 | 0 |
| Credit Memo Create | 79 | **32** |
| Payment Create | 28 | 0 |
| Credit Memo Apply | 16 | **16** |
| Deposit Create | 7 | **1** |
| Credit Memo Refund | 4 | **4** |
| Deposit Application | 1 | **1** |

Vendors tab 264 rows / 0 blank · Journal Entries 6 rows / 0 blank.

**A coverage question for the developer, not a verdict:** the QA plan's not-in-scope list names only
*Credit Memo Create* ("still shows Unknown"). **Credit Memo Apply (16 of 16) and Credit Memo Refund
(4 of 4) are blank on every row and are not mentioned anywhere in the plan.** The ticket's stated
expectation is *"Every customer-related transaction in QB Unexported should display the associated
Customer Name"*, so whether the fix covers those two types needs answering. It cannot be tested on
this branch (credit memos need an invoice, and invoicing is blocked here).

## Verdict: NOT YET CONFIRMED — and precisely why

**What is proven on the fixed branch:** 5 rows on the Customers tab, **0 blank** — 4 Deposit Create
and 1 Payment Create, every one showing its customer (`ev/EX2-after-branch-all-named.png`).

**What is not proven:** all five of those rows fail with *"QuickBooks needs to be reconnected"*,
because this branch has **no live QuickBooks connection**. The branch therefore cannot produce a row
on the **missing-mapping** path — the one path on which the customer is actually lost. **The two
builds cannot be compared on the same error path**, so the branch evidence does not yet demonstrate
the fix.

**One of two things closes it in minutes:**
1. **Connect QuickBooks on `sv9866`** (then clear the *Customer Deposit Item* mapping per the plan's
   setup step, create a deposit, and the row either shows the name or it does not — decisive), or
2. **Dipesh confirms the fix is in the report query rather than in the sync writer.** His own
   verification note — *"Re-check the same rows — do not regenerate them. The fix resolves existing
   rows too"* — says it is read-side, and if that is so the error path is irrelevant and the branch
   evidence stands. A one-line confirmation makes it a PASS.

## Two things I deliberately did not do

**I did not change staging's bookkeeping settings.** `/api/bookkeeping/settings` answers
**`Method Not Allowed (Allow: PUT)`** — it is write-only, with no readable counterpart, so I could
not have captured the current mapping to restore it afterwards. Staging is shared (E2E suites are
running against it) and the plan itself warns *"Re-map Customer Deposit Item once testing is
finished, or staging deposits will keep failing to sync."* Forcing the path there was not worth
breaking someone else's QuickBooks sync.

**I nearly reported a false defect and checked it first.** The report renders 30 of 588 rows with no
pagination control and the page does not scroll, which looked like a real "you cannot reach the rest"
problem — squarely relevant to the customer's complaint. It is **not** a defect: the table is a
Quasar **virtual-scroll** container, and scrolling *inside* it loaded 32 → 74 rows and kept going.
Configuration/mechanism first, as Standing Rule 75 requires.

**Production has nothing to compare.** Logged in read-only (`POST /api/login`, one login, no
seeding); the unexported list for that org is **empty (0 rows)**, so the released build offers no
reference either way.

## What was seeded, and where

Branch (`sv9866`, disposable, left in place): deposits **DEP-4703, DEP-4704** (S9866-17435),
**DEP-4705** (S9866-15924), **DEP-4706** (S9866-16174), and a $248.22 cash payment on S2-17540.
Staging (shared): one deposit **DEP-4711** on S2-32274 (Aberdeen Diesel Services LLC) — it took the
business-validation path and shows its name, so it neither proves nor pollutes anything; no settings
were altered.
