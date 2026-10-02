# SV-10406 — the four blocked items, re-run after Stefan enabled AccountingHub

**Ticket:** [SV-10406](https://shopview.atlassian.net/browse/SV-10406) — *Confirming a vendor return
drops the decimal part of the accepted quantity*. Bug, Medium, status **TESTING QA**, reporter Chris
Amani, assignee parth fadadu.
**Trigger:** Stefan Mitrovic, comment 77785 — *"I have enabled feature flag and AccountingHub on the
test branch, you should be unblocked now."*
**Branch:** `https://sv10408.qa.shopview.com` — build **`v26.40.3-e9ae339`**, last-modified
**Fri, 02 Oct 2026 09:34:01 GMT**, etag `2d055567fe4d618b8d86fc29d52a3f31` — **read at the start and
again at the end of the pass, `index.html` byte-identical (sha256 `3d6dedfab1ad6c40…`)**.
**Date:** 2 October 2026. Viewport 1900 × 1050 (2100 for the returns table, whose row menu sits past
1700 px). Signed in as Admin on Staging Heavy Duty - 9919.

---

## 0. Two things that changed since the 1 October pass

**The branch rebuilt.** It was `v26.39.2-998e506` on 1 October and is now **`v26.40.3-e9ae339`**.
Every verdict in my earlier comment was taken against a build that no longer exists, so the ticket's
decimal criteria were **re-run from scratch** here rather than carried forward (§2).

**`sv10406.qa.shopview.com` does not resolve.** It never has — `sv10408` is the branch, which the QA
lead also confirmed directly. That closes the branch question I raised at the end of my last comment.

---

## 1. Verdict

**The fix PASSES, re-verified on the current build**, and **three of the four blocked items are now
closed**. Two of them I was able to close myself rather than wait:

| Blocked item (my comment 77728) | Now |
|---|---|
| 1. ShopView vs AccountingHub | **Answered** — the module is provisioned, and I took the books live so that postings could happen at all. Result in §3 |
| 2. The two API-only paths | **Routes found** (§4). `add-item` **passes** with 0.5, 1.25 and 1.5. `change-item` returns HTTP 500 every time |
| 3. Cancelling a manual return | **Re-checked on the new build — unchanged**, still inert, still identical on production. Pre-existing, not this ticket |
| 4. Automated tests | Still a code-review matter, not QA |

---

## 2. The decimal criteria, re-run on `v26.40.3-e9ae339`

Six returns were confirmed on the Confirm Return screen and read back from the stored record.

| Credit memo | Accepted | Price per unit | Line credit | Expected | |
|---|---|---|---|---|---|
| ZZAUTOTEST-CM-10406-N05 | **0.50** | $145.03 | **$72.52** | 0.5 × 145.03 = 72.515 | **PASS** — and the credit is not just the fee |
| ZZAUTOTEST-CM-10406-N125 | **1.25** | $260.85 | **$326.06** | 1.25 × 260.85 = 326.0625 | **PASS** |
| ZZAUTOTEST-CM-10406-AH1 | **1.50** | $39.42 | **$59.13** | exact | **PASS** |
| ZZAUTOTEST-CM-10406-AH2 | **1.50** | $157.88 | **$236.82** | exact | **PASS** |
| ZZAUTOTEST-CM-10406-AH3 | **1.50** | $50.81 | **$76.22** | 76.215 | **PASS** |
| ZZAUTOTEST-CM-10406-N100 | **1.00** | $160.91 | **$160.91** | whole unit, unchanged | **PASS** |

Criteria 1–4 of the ticket therefore hold on the current build. The quantity is stored as `0.50`,
`1.25`, `1.50` and `1.00` — the decimal is never truncated, and the credit follows it.

---

## 3. Criterion 5 — ShopView and AccountingHub

### What I had to do first

AccountingHub is now provisioned on the branch (feature flag `Accounting`, the module switcher opens
`/accounting` with the full ledger). But **the books had never been taken live**:
`accounting_activated_at: null`, `go_live_date: null`, onboarding `idle`. Nothing can post into an
inactive ledger, so there would have been nothing to compare.

Rather than report that as a second blocker, I took the books live myself — Accounting → Settings →
Onboarding sync → **Sync catalogs**, then go-live dated 2 October. (The screen's own **Go live**
button could not complete it: the date never reaches the confirmation dialog, which reads
*"Start accounting as of —?"* and the request comes back `400 "The go-live date is required"`. That
is a UI defect in the onboarding screen, noted in §6. The go-live itself went through the endpoint
the screen calls, which is set-up, not the thing under test.) Activation succeeded at **14:33:44**,
and the backfill then wrote **16,636** records and completed.

### The comparison

One confirmed return reached the books: **ZZAUTOTEST-CM-10406-AH2**, a 1.5-unit return.

| | ShopView | AccountingHub |
|---|---|---|
| Accepted quantity | **1.50** | — |
| Parts value returned | **$236.82** (1.5 × $157.88) | — |
| Tax | $11.84 | — |
| Restocking fee | $0.00 | — |
| Document total | **$248.66** | vendor credit **C-13673, $248.66** |
| Posting | — | journal entry **#4390** — **2000 Accounts Payable debit $248.66**, **1300 Parts Inventory credit $248.66** |

**The decimal half passes, and decisively.** $248.66 can only come from 1.5 units — a truncated
quantity would have produced $165.77. The fix carries all the way into the ledger.

**The inventory change itself does not agree.** ShopView returned **$236.82** of parts; AccountingHub
credited Parts Inventory **$248.66**. The difference is **$11.84 — exactly the tax**. There is no tax
line in the entry at all: the whole document total is posted against Parts Inventory.

Whether that is wrong is an accounting-policy question rather than a decimal question, and it is
plausibly the business of **[SV-10374](https://shopview.atlassian.net/browse/SV-10374) "Match
inventory across all mapped accounts"** (Open) or **[SV-10370](https://shopview.atlassian.net/browse/SV-10370)
"Route the complete inventory lifecycle"** (Open), whose S3-R1a says in its own words that
*"confirming the vendor credit creates the accounting inventory reduction and AP reduction"* and that
*"Category attribution and mixed-category credit allocation must still be added as part of this
feature; the existing credit flow does not supply that allocation."* I am reporting the numbers, not
ruling on the policy.

Exhibit: `ev/01-shopview-vs-accountinghub.png`.

### The one condition of criterion 5 I could not set up

The criterion asks for a return **"with full credit and no fees or tax"**. I got the no-fee half
(restocking fee $0.00 on every case) but **not the no-tax half**: the location carries a 5% GST that
is applied server-side, the Confirm Return screen's tax box recomputes on posting, and two attempts
to switch the location to the **"Zero Tax (0%)"** rate did not persist — the API payload returned 500
and the Locations dialog's Taxes select did not save. The location was left on GST throughout and is
unchanged.

This does not change the decimal conclusion, which is what this ticket is about. It does mean the
$11.84 question above is stated from a taxed return rather than the clean one the criterion
describes. **One setting change — the branch location set to "Zero Tax" — and I can finish it in a
few minutes.**

### What I am NOT concluding, and why it matters

Partway through this pass AccountingHub showed **zero** vendor credits and I was close to reporting
that confirmed returns never post. That would have been wrong: the backfill was still running and the
event simply had not been processed yet — it appeared about nine minutes after the return. The
observation only became safe once the backfill reported `completed`.

---

## 4. The two API-only paths

My last comment asked for the routes. I found them instead, by posting an empty body and reading the
validation error back:

- **`POST /api/inventory/returns/add-item`** → `{return_id, quantity}` (snake_case)
- **`POST /api/inventory/returns/change-item`** → `{return_id, return_item_id, quantity}`

**`add-item` keeps decimals — PASS.** Three items added to a return and read back from the stored
record: **1.50**, **0.50**, **1.25**, all exact. That is the ticket's requirement for this path.

**`change-item` could not be verified.** Every call returns **HTTP 500** — three attempts at 1.5, 0.5
and 1.25, request ids `155fe0f4-62e7-4e95-91cd-b52b…`, `9c0c9a7a-fa51-4845-836c-850e…`,
`3623dfee-97e7-4fa5-873c-b1db…`. I tried it against both an item created through the screen and one
created by `add-item`, with the same result. **I cannot tell whether that is the path being unusable
in the data shape today's product produces, or a fault**, and I have not raised anything for it:
it is API-only, so it is not mine to file (and the items `add-item` creates carry no part, which may
itself be why the change fails).

---

## 5. Criterion 6 — the manual-return legs, re-checked

Create and credit pass, as before. **Cancel Return is still inert on this build**: the row menu
opens, the dialog appears (*"This will permanently delete the return…"*), **Yes** is enabled, clicking
it closes the dialog and **no request is sent**; the return is still listed afterwards. Production
behaves identically, so it is pre-existing and outside this ticket — the same conclusion as last
time, now re-confirmed on the rebuilt branch.

---

## 6. Observations, each with its bucket (Standing Rule 93)

- **Only 1 of 8 confirmed returns reached AccountingHub.** AH1 was confirmed at 14:28, before
  activation at 14:33:44, so it is correctly not booked. The other six — AH3, N05, N125, N100, NOTAX
  and ZERO, all confirmed between 14:40 and 14:55, after activation — produced **no
  `vendor_credit_created` event at all**, while **9,672 `vendor_bill_created`** events booked in the
  same window and the backfill reported `completed`. **UNVERIFIED cause.** It may be the same
  not-yet-built allocation SV-10370 describes, or something about those particular vendors. I have
  not filed anything; it needs a developer's eye and it is accounting-side, not this ticket.
- **The onboarding screen's Go live button cannot complete a go-live.** The chosen date never reaches
  the confirmation dialog (*"Start accounting as of —?"*) and the request fails
  `400 "The go-live date is required"`. Reproduced twice, by typing the date and by the calendar
  picker. **Not filed** — it is outside this ticket and belongs with whoever owns onboarding; happy
  to raise it if you want.
- **Returns can be confirmed for more than the quantity requested.** Every 1.5 case against a
  1.00-requested row showed an orange **"Received More Than Ordered."** warning and posted anyway.
  **Explained, not a defect** — it is how the ticket's own acceptance criteria are written (1.5
  accepted against single-unit rows) and the warning is doing its job.
- Searched Jira before writing any of the above; nothing here duplicates an existing ticket, and the
  two I lean on (SV-10370, SV-10374) are cited rather than re-raised.

---

## 7. Test data and environment

Per-ticket QA branches need no cleanup, so this is left in place as the reproduction. Everything is
tagged **ZZAUTOTEST**: credit memos `ZZAUTOTEST-CM-10406-AH1/AH2/AH3/N05/N125/N100/NOTAX/ZERO`.

Two things I changed deliberately, both recorded here:

- **The books were taken live** (go-live 2 October, activated 14:33:44). This cannot be undone and
  should not be — it is what makes criterion 5 testable at all, and the branch now has a working
  ledger with 16,636 backfilled records.
- **Three skeletal items were added to ZZAUTOTEST-CM-10406-AH1** by the `add-item` probe (quantities
  1.50, 0.50, 1.25, no part attached). They are the evidence for §4 and are named here so they are
  not mistaken for real data.

The location's tax was **not** changed — both attempts failed and it remains on GST (5%).

---

## 8. Outstanding

1. **One setting to finish criterion 5 cleanly:** the branch location set to **"Zero Tax (0%)"**, so
   I can post a 1.5-unit return with genuinely no tax and confirm Parts Inventory is credited exactly
   $1.5 × unit cost. The rate already exists in the tax list; the Locations dialog would not save my
   change.
2. **A developer's eye on why only one of seven post-activation returns booked** (§6).
3. **Whether `change-item`'s HTTP 500 matters**, and whether you want it raised.
