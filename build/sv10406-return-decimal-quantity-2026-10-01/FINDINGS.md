# SV-10406 — Confirming a vendor return drops the decimal part of the accepted quantity

**Ticket:** [SV-10406](https://shopview.atlassian.net/browse/SV-10406) · status TESTING QA · priority Medium · reporter Chris Amani · assignee parth fadadu · relates to SV-10408 · labels accounting, inventory
**Branch tested:** https://sv10408.qa.shopview.com — build **`v26.39.2-998e506`**, last-modified Thu, 01 Oct 2026 04:27:42 GMT, etag `W/"736df3fb526413d198717221673cc027"`
**Production:** https://app.shopview.com — build **`v26.40.2-95f3172`**, last-modified Thu, 01 Oct 2026 12:47:08 GMT
**Tested against:** the ticket's own Acceptance Criteria (no QA handoff on this ticket; the only comment is parth's note 77292 on the sibling ticket's branch)
**Date:** 2026-10-01

> **The branch I was given is `sv10408`, which is named for the sibling ticket.** Everything in this
> ticket's scope behaves correctly there, but see §4 — because production is already correct too,
> observing correct behaviour on that branch does not on its own prove the branch carries *this*
> ticket's change. Worth one line from the developer.

---

## 1. Verdict

**PASS on everything testable from the application.** Decimal accepted quantities survive confirming,
and the credit follows the decimal.

Three parts of the ticket could not be exercised and are set out in §5: the AccountingHub half of one
criterion, the two API-only paths, and the automated-test criterion. One further criterion — cancel —
could not be exercised for a reason that turns out to be **pre-existing and not this branch's doing**.

---

## 2. What was checked

| # | Acceptance criterion | Result |
|---|---|---|
| 1 | 1.5 accepted → saved 1.5, credit = 1.5 × credit per unit | **PASS** — stored `1.50`, credit **$22.04** = 1.5 × $14.69 |
| 2 | 0.5 accepted → saved 0.5, and the credit is not just the fee | **PASS** — stored `0.50`, line $17.77, credit **$12.77** against a $5.00 fee |
| 3 | 1.25 accepted → 1.25 saved | **PASS** — stored `1.25`, credit **$44.41** = 1.25 × $35.53 |
| 4 | A whole-unit return behaves exactly as today | **PASS** — stored `1.00`, credit **$139.54** |
| 5 | A 1.5-unit return, full credit, no fees or tax — ShopView and AccountingHub agree | **ShopView half PASSES** (case 1 is exactly that shape). The AccountingHub half cannot be checked in either environment — §5 |
| 6 | The manual-return workflow still keeps decimals on create, cancel and credit | **create PASSES** (1.5 typed, stored 1.5) · **credit PASSES** (confirmed at 1.50, credit $15.00) · **cancel not exercisable** — §3 |
| 7 | Automated tests cover 0.5, 1.25 and 1.5 on the confirm path and both API-only paths | Not checkable from the application — §5 |
| — | The two API-only paths keep decimals | Not reachable — §5 |

### The four confirmed returns, read back from a freshly opened credit

| Credit memo | Accepted | Price per unit | Restocking fee | Credit |
|---|---|---|---|---|
| ZZAUTOTEST-CM-10406-A | **1.50** | $14.69 | — | **$22.04** |
| ZZAUTOTEST-CM-10406-B | **0.50** | $35.53 | $5.00 | **$12.77** |
| ZZAUTOTEST-CM-10406-C | **1.25** | $35.53 | — | **$44.41** |
| ZZAUTOTEST-CM-10406-D | **1.00** | $139.54 | — | **$139.54** |

Each one was entered on the Confirm Return screen, posted, and then reopened from the Credits tab;
the stored record was also read directly, so these are saved values and not a form still on screen.

---

## 3. The cancel leg of criterion 6 — and why it is not this branch's problem

"Cancel Return" **does nothing** on the branch. The row menu opens, the confirmation dialog appears
("This will permanently delete the return…"), the **Yes** button is enabled and not obstructed, and
clicking it closes the dialog — but **no request is sent, no console error appears, and the return is
unchanged**, still listed and still `status: returned`.

I ran the identical test on production before saying anything: **production behaves exactly the
same** — no request, record unchanged, row still listed. So this is **pre-existing behaviour, not
something this branch introduced**, and it is outside this ticket's scope. It is reported here only
because it blocks one third of criterion 6 from being demonstrated.

What can be said for that leg: the decimal is **not corrupted** by the attempt — a manual return
created at quantity 2.5 still reads 2.5 afterwards.

---

## 4. There is no before-picture

The reported behaviour **does not reproduce on production**. A work-order return confirmed there with
**0.5** accepted stored `0.50` and credited **$1.50** — under the ticket's description it should have
become 0 and credited nothing.

This is the same picture as the sibling ticket SV-10408, tested earlier today. Production moved
through `v26.40.0` → `v26.40.1` → `v26.40.2` during the session, while the branch is built from a
`v26.39.2` base, so the likeliest explanation is that both corrections already reached production.
**That is an inference from version numbers, not something I verified.**

The consequence worth stating: since production is already correct, *correct behaviour on the branch
does not by itself prove the branch contains this fix.* Combined with the branch being named for the
sibling ticket, that is the one thing I would want confirmed before this closes.

No before was taken from staging — the standing rule is production or nothing.

---

## 5. What could not be checked, and why

1. **The AccountingHub half of criterion 5 — now properly chased, and the answer is environmental.**
   My first pass reported this as "not reachable" after probing API endpoints blindly. That was my
   mistake: AccountingHub is reached from the **module switcher** in the top-left of the app
   (`module_selector_trigger`), which I had already seen in a test-id dump and never clicked. Opened
   properly, the picture is:
   - **On the QA branch, AccountingHub is not provisioned.** The switcher offers it, but choosing it
     lands on `/explore-accounting`, a description of the module ending *"Contact us in the chat
     button below to talk about adding the Accounting module."* There is **no feature flag for it**
     either — the Feature Flag Overrides panel lists BillingPortal, CustomerPortal, DashboardAdministrator,
     DashboardAll, DigitalInspections, FeesAndDiscounts, LateFeesMvp, PartSales, QuickBooks, ShopCoach
     (×3) and ShopPay, and nothing for Accounting. So it is an organisation entitlement, not a toggle
     I can switch on.
   - **On production, AccountingHub is fully provisioned** — `/accounting` with Customers, Invoices,
     Payments, Vendors, Bills, Banking, Fixed assets, Reports and the ledger — and its **chart of
     accounts holds 68 accounts**, so the books are genuinely set up. But it contains **no transactions
     at all**: Vendor credits 0, Bills 0, Vendors 0, Banking transactions 0 ("Nothing to review"),
     Journal entries 0 (that section also answers *"Something went wrong loading this section"*), and
     the whole **event log holds two entries — both "Location Upserted", from 29 September**. ShopView's
     own Unexported Items report lists 2 rows, neither of them mine.

   So nothing ShopView records — not my returns, not anything else — is posting into AccountingHub on
   that organisation. **The ShopView half of criterion 5 is verified** (case A is exactly a 1.5-unit
   return at full credit with no fee and no tax, crediting $22.04 = 1.5 × $14.69). The agreement half
   **cannot be checked by me in either environment**, and that is an environment gap rather than a
   limit of the testing: it needs an organisation where AccountingHub actually receives posted
   activity. Evidence: `ev/03-accountinghub-not-on-branch.png`, `ev/04-accountinghub-production-empty.png`.

2. **The two API-only paths** (`AddReturnItemCommand`, `ChangeReturnItemCommand`). The ticket says no
   screen calls them, which is also why the route cannot be captured from the application — the trick
   that solved the AccountingHub question above (open the screen, watch the traffic) cannot work when
   there is no screen. Six candidate routes were probed and all answered 404. **If you want these exercised, send me the
   route and payload and I will run 0.5, 1.25 and 1.5 through both.** Otherwise they are a unit-test
   matter, which is criterion 7.
3. **Criterion 7, the automated tests.** That lives in the pull request, not the running application.

---

## 6. A test error of my own, recorded

**(a)** My first attempt at the manual-return decimal reported that the quantity field refused 1.5 and sent
`quantity: 1`. That was wrong — **the first row's quantity field has a different id**
(`input_return_qty_0_0`, not `input_manual_return_part_quantity`), so I had typed into another row.
The field is `type=number step="any"` and accepts 1.5, 2.25 and 0.5 perfectly well. Recorded because
it would have been a false defect against the ticket's own premise that manual returns keep decimals.

**(b)** I reported AccountingHub as unreachable after probing endpoints blindly, when the module is
reached from the **module switcher** in the top-left — a control whose test-id I had already captured.
The playbook's own rule covers this exactly: never call a route unreachable until you have opened the
screen a real user would open. The QA lead pointed at the switcher; §5 is the result.

---

## 7. How it was tested

Viewport 2100 × 1050 (the returns table's row menu sits past 1700 px). Signed in as Admin on both
environments.

Everything under test was driven **on the screen**: the Returns list and its row selection, Receive
Credit, the Confirm Return screen's accepted-quantity, restocking-fee and tax fields, Post Credit,
the Create Return grid, and the row menu's Cancel Return with its confirmation dialog. **Set-up only**
— creating one manual return for the cancel test — went through the API. Read-backs were taken from
both the screen and the stored record.

## 8. Test data

**Branch** (per-ticket QA branches need no cleanup; this is the reproduction): credit memos
`ZZAUTOTEST-CM-10406-A/B/C/D` and `ZZAUTOTEST-CM-10406-MAN`, plus the manual return
`ZZAUTOTEST-10406-CANCEL` which **could not be cancelled** for the reason in §3, and two earlier
manual returns `ZZAUTOTEST-10406-MAN`/`MAN2`.

**Production** — two records remain and could not be removed: the confirmed credit
**`ZZAUTOTEST-CM-10406-PROD` ($1.50)**, because a posted credit cannot be unposted, and the manual
return **`ZZAUTOTEST-10406-PCANCEL` (2.5 units)**, because Cancel Return does not work there either.
Both are named here so they are not mistaken for real data.

## 9. Evidence

- `ev/01-decimals-survive-the-save.png` — the 1.5 and 0.5 returns, reopened after confirming
- `ev/02-quarter-unit-and-whole-unit.png` — 1.25, and a whole unit as a control
- `ev/03-accountinghub-not-on-branch.png` — the branch offers the module but does not have it
- `ev/04-accountinghub-production-empty.png` — production has the module; its event log holds two Location entries and nothing else
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw run output: `/tmp/qa10406/` (branch) and `/tmp/qa10406p/` (production), not committed

## 10. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
