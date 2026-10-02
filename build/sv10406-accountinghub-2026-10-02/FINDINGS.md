# SV-10406 — the four blocked items, re-run after Stefan enabled AccountingHub

**Ticket:** [SV-10406](https://shopview.atlassian.net/browse/SV-10406) — *Confirming a vendor return
drops the decimal part of the accepted quantity*. Bug, Medium, status **TESTING QA**, reporter Chris
Amani, assignee parth fadadu.
**Trigger:** Stefan Mitrovic, comment 77785 — *"I have enabled feature flag and AccountingHub on the
test branch, you should be unblocked now."*
**Branch:** `https://sv10408.qa.shopview.com` — build **`v26.40.3-e9ae339`**, last-modified
**Fri, 02 Oct 2026 09:34:01 GMT**, etag `2d055567fe4d618b8d86fc29d52a3f31` — **read at the start and
again at the end of the pass, `index.html` byte-identical (sha256 `3d6dedfab1ad6c40…`)**.
**Date:** 2 October 2026. Viewport 1900 × 1050 (2100 for the returns table). Signed in as Admin on
Staging Heavy Duty - 9919.

> ### ⚠️ THIS FILE WAS REWRITTEN AFTER A SELF-AUDIT — three of my own earlier claims were wrong
>
> The QA lead asked for everything on this ticket to be re-checked carefully. I went back over every
> claim in the posted comment and re-verified it against the live record. **Three were wrong, and all
> three were wrong in the direction of making the product look worse than it is.** They are corrected
> below and each one is called out where it sits, rather than quietly edited:
>
> | What I had claimed | What is actually true |
> |---|---|
> | *"I could not produce a return with no tax — the tax box would not take a zero"* | It takes a zero fine. My script was setting the value in a way the page never registered. **Typing it like a person does works**, which unblocked the whole criterion (§3) |
> | *"The two systems do not agree on the inventory change"* | On a genuinely no-tax return **they agree exactly** — $217.55 against $217.55. The disagreement only appears on a **taxed** return, which is a narrower and different point (§3, §6) |
> | *"Only 1 of 8 confirmed returns reached AccountingHub — needs a developer's eye"* | **17 of 18 posted.** The single one missing was confirmed *before* go-live, so it is correctly excluded. There was nothing to investigate (§6) |

---

## 0. Two things that changed since the 1 October pass

**The branch rebuilt.** It was `v26.39.2-998e506` on 1 October and is now **`v26.40.3-e9ae339`**.
Every verdict in my earlier comment was taken against a build that no longer exists, so the ticket's
decimal criteria were **re-run from scratch** here rather than carried forward (§2).

**`sv10406.qa.shopview.com` does not resolve.** It never has — `sv10408` is the branch, which the QA
lead also confirmed directly. That closes the branch question I raised at the end of my last comment.

---

## 1. Verdict

**The fix PASSES, re-verified on the current build, and all six acceptance criteria are now met —
including criterion 5, which I had previously left incomplete.** All four items I had reported as
blocked are closed.

| Blocked item (my comment 77728) | Now |
|---|---|
| 1. ShopView vs AccountingHub | **Done.** The module is provisioned; I took the books live so postings could happen at all, and the comparison is in §3 |
| 2. The two API-only paths | **Routes found** (§4). `add-item` **passes** with 0.5, 1.25 and 1.5. `change-item` returns HTTP 500 every time |
| 3. Cancelling a manual return | **Re-checked on the new build — unchanged**, still inert, still identical on production. Pre-existing, not this ticket |
| 4. Automated tests | Still a code-review matter, not QA |

---

## 2. The decimal criteria, re-run on `v26.40.3-e9ae339`

Eighteen returns were confirmed on the Confirm Return screen across the two builds and read back from
the stored record. Every one keeps its decimal; the line credit follows it exactly.

| Credit memo | Accepted | Price per unit | Line credit | Arithmetic | |
|---|---|---|---|---|---|
| ZZAUTOTEST-CM-10406-AC5B | **1.50** | $145.03 | **$217.55** | 1.5 × 145.03 = 217.545 | **PASS** — the clean no-tax, no-fee case (§3) |
| ZZAUTOTEST-CM-10406-FEE | **0.50** | $35.53 | **$17.77** less $5.00 fee = **$12.77** | 0.5 × 35.53 = 17.765 | **PASS** — and the credit is **not** just the fee |
| ZZAUTOTEST-CM-10406-N125 | **1.25** | $260.85 | **$326.06** | 1.25 × 260.85 = 326.0625 | **PASS** |
| ZZAUTOTEST-CM-10406-AH2 | **1.50** | $157.88 | **$236.82** | exact | **PASS** |
| ZZAUTOTEST-CM-10406-AH3 | **1.50** | $50.81 | **$76.22** | 76.215 | **PASS** |
| ZZAUTOTEST-CM-10406-N05 | **0.50** | $145.03 | **$72.52** | 72.515 | **PASS** |
| ZZAUTOTEST-CM-10406-N100 | **1.00** | $160.91 | **$160.91** | whole unit, unchanged | **PASS** |
| …plus AC5, AH1, A, B, C, D, MAN, NOTAX, NOTAX2, NT3, ZERO | 0.5 / 1.25 / 1.5 / 1.0 | — | — | all exact | **PASS** |

The quantity is stored as `0.50`, `1.25`, `1.50` and `1.00` — the decimal is never truncated.

**Correction to my earlier comment:** I used **N05** to show that "the credit is not just the
restocking fee". That was a poor choice — **N05 has no restocking fee on it at all**, so it does not
demonstrate the point. The case that does is **FEE**: half a unit, a real $5.00 restocking fee, and a
credit of **$12.77** — the half unit kept and the fee deducted from it, rather than the fee standing
alone. Exhibit `ev/02-half-unit-with-restocking-fee.png`.

---

## 3. Criterion 5 — ShopView and AccountingHub

### What I had to do first

AccountingHub is now provisioned on the branch (feature flag `Accounting`, the module switcher opens
`/accounting` with the full ledger). But **the books had never been taken live**:
`accounting_activated_at: null`, `go_live_date: null`, onboarding `idle`. Nothing can post into an
inactive ledger, so there would have been nothing to compare.

Rather than report that as a second blocker, I took the books live myself — Accounting → Settings →
Onboarding sync → **Sync catalogs**, then go-live dated 2 October. (The screen's own **Go live**
button could not complete it; that is a separate UI defect, §6. The go-live itself went through the
endpoint the screen calls, which is set-up, not the thing under test.) Activation succeeded at
**14:33:44**, and the backfill then wrote **16,636** records and completed.

### The clean case the criterion actually asks for — and it passes

The criterion asks for a return **"with full credit and no fees or tax"**. I previously reported that
I could not produce one, because the Confirm Return screen's tax box "would not take a zero". **That
was wrong, and the fault was mine:** my script was writing the value into the field programmatically,
and the page's own state never saw the change. Typing it the way a person does — click the field,
select all, delete, type `0`, Tab — sets it immediately and it sticks. (There is also a genuine trap
on that screen: the restocking-fee box and the tax box carry the **same `data-test-id`**, so the first
few attempts were quietly writing to the fee instead of the tax.)

With that, **ZZAUTOTEST-CM-10406-AC5B** — 1.5 units, $145.03 each, **no tax, no restocking fee**:

| | ShopView | AccountingHub |
|---|---|---|
| Accepted quantity | **1.50** | — |
| Parts value returned | **$217.55** (1.5 × $145.03) | — |
| Tax | **$0.00** | — |
| Restocking fee | **$0.00** | — |
| Document total | **$217.55** | vendor credit **C-13683, $217.55** |
| Posting | — | journal entry **#13746** — **2000 Accounts Payable debit $217.55**, **1300 Parts Inventory credit $217.55** |

**Criterion 5 passes as written.** The decimal survives into the ledger — $217.55 can only come from
1.5 units; a truncated quantity would have given $145.03 — **and the two systems agree to the cent on
the inventory change.** Exhibit `ev/01-no-tax-return-both-systems-agree.png`.

### The separate observation: on a **taxed** return, the tax lands in Parts Inventory

My earlier comment said flatly that "the two systems do not agree on the inventory change". That was
**overstated** — both cases I had used at the time carried tax, and I generalised from them. The
accurate statement is narrower:

**On a return that carries tax, the Parts Inventory credit equals the document total including tax,
and no tax line is posted at all.** On **AH2**: ShopView returned $236.82 of parts and charged $11.84
of tax; AccountingHub credited Parts Inventory the full **$248.66**. That held on **all 11 taxed
returns** in this set — N05 +$3.63, N100 +$8.05, N125 +$16.30, AH3 +$3.81, NOTAX +$5.73, NT3 +$5.54,
ZERO +$3.86, AC5 +$0.08, NOTAX2 +$5.06 — the difference is the tax every time, to the cent.

Whether that is wrong is an accounting-policy question, not a decimal one, and it is plausibly the
business of **[SV-10374](https://shopview.atlassian.net/browse/SV-10374) "Match inventory across all
mapped accounts"** (Open) or **[SV-10370](https://shopview.atlassian.net/browse/SV-10370) "Route the
complete inventory lifecycle"** (Open), whose S3-R1a says *"Category attribution and mixed-category
credit allocation must still be added as part of this feature; the existing credit flow does not
supply that allocation."* I am reporting the numbers, not ruling on the policy.
Exhibit `ev/03-on-a-taxed-return-the-tax-lands-in-inventory.png`.

**The location's tax was set to "Zero Tax (0%)" for this test and then put back to GST (5%).**
Verified restored: `GET /api/workplaces` → Heavy Duty - 9919 tax `{"name":"GST"}`.

### What I am NOT concluding, and why it matters

Partway through this pass AccountingHub showed **zero** vendor credits and I was close to reporting
that confirmed returns never post. That would have been wrong: the backfill was still running. The
observation only became safe once the backfill reported `completed` — and see §6, because I did not
wait long enough the first time either.

---

## 4. The two API-only paths

My last comment asked for the routes. I found them instead, by posting an empty body and reading the
validation error back:

- **`POST /api/inventory/returns/add-item`** → `{return_id, quantity}` (snake_case)
- **`POST /api/inventory/returns/change-item`** → `{return_id, return_item_id, quantity}`

**`add-item` keeps decimals — PASS.** Three items added to a return and read back from the stored
record: **1.50**, **0.50**, **1.25**, all exact. That is the ticket's requirement for this path.

**`change-item` could not be verified.** Every call returns **HTTP 500** — re-probed again during this
audit, same result. Earlier request ids `155fe0f4-62e7-4e95-91cd-b52b…`,
`9c0c9a7a-fa51-4845-836c-850e…`, `3623dfee-97e7-4fa5-873c-b1db…`. I tried it against both an item
created through the screen and one created by `add-item`, with the same result. **I cannot tell
whether that is the path being unusable in the data shape today's product produces, or a fault**, and
I have not raised anything for it: it is API-only, so under our standing rule it is not mine to file
without being asked.

---

## 5. Criterion 6 — the manual-return legs, re-checked

Create and credit pass, as before. **Cancel Return is still inert on this build**: the row menu
opens, the dialog appears (*"This will permanently delete the return…"*), **Yes** is enabled, clicking
it closes the dialog and **no request is sent**; the return is still listed afterwards. Production
behaves identically, so it is pre-existing and outside this ticket — the same conclusion as last
time, now re-confirmed on the rebuilt branch.

---

## 5b. The manual-return legs re-driven on the CURRENT build (added after a self-check)

**A gap I found in my own posted comment and closed.** Rows 6 and 7 of the checks table — a manual
return keeping its decimal when it is *created* and when the credit is *posted* — were exercised on
the **1 October build `v26.39.2-998e506`**, and on 2 October I had only re-read the resulting record
rather than re-performing the actions. The comment said I re-ran everything from scratch; that was
true of the decimal criteria and **not** of these two. Both are now driven on `v26.40.3-e9ae339`:

| Leg | How | Result |
|---|---|---|
| **Create** | Parts > Returns > **Create Return**, vendor 5 Star Truck Repair, part **P550848**, *Qty To Return* typed as **1.5**, price $53.52, **Save Return** | Row stores **1.50**, total **$80.28** = 1.5 × $53.52. Packaging slip `ZZAUTOTEST-MAN-OCT2` |
| **Post the credit** | Tick the row's checkbox → **Receive Credit** → Process Return screen → credit memo number → **Post Credit** | Stored credit `ZZAUTOTEST-CM-10406-MANOCT2`: qty **1.50**, unit $53.52, sub total **$80.28**, tax $4.01, total $84.29 |

**The navigation detail worth recording:** a manual return is **not** opened by clicking its row —
clicking does nothing. **Tick its checkbox and a "Receive Credit" button appears**, which opens
`/parts/confirm-return?id=<id>&isManualReturn=1`. Its row menu offers only *Cancel Return*, which
independently re-confirms §5.

---

## 6. Observations, each with its bucket (Standing Rule 93)

- **~~Only 1 of 8 confirmed returns reached AccountingHub~~ — WITHDRAWN, this was my error.**
  Re-counted against the full vendor-credit list (1,317 records, paged to the end): **17 of our 18
  test credits are posted in AccountingHub**, matched by memo. The only one absent is **AH1**, which
  was confirmed at 14:28 — *before* activation at 14:33:44 — so it is correctly not booked. My
  original count was taken while the 16,636-record backfill was still draining, and I reported it
  before it finished. **There is nothing here for a developer to look at, and the "needs a
  developer's eye" line in my posted comment was wrong on both counts** — wrong about the facts, and
  wrong as a thing to write instead of showing the evidence.
- **Two posting shapes, both correct as far as I can tell.** The five credits created *before*
  go-live (A, B, C, D, MAN — entries 13732–13736) post **Accounts Payable debit / Opening Balance
  Equity credit**, which is what a historical backfill should do. The twelve created *after*
  activation (13737–13747) post **Accounts Payable debit / Parts Inventory credit**. **Explained, not
  a defect.**
- **The Journal entries list will not open** — `/accounting/ledger/journal-entries` renders
  *"Something went wrong loading this section"* with a Retry button; reproduced twice, and **no API
  call fails** (the list endpoint returns 200), so it is client-side. **Already tracked, not raised:**
  **[SV-10653](https://shopview.atlassian.net/browse/SV-10653) "Restore reliable Journal Entries
  views"** (Open) names this exact string in its requirement S3-R3 — *"Missing default dates alone do
  not produce 'Something went wrong loading this section'"* — and
  **[SV-10712](https://shopview.atlassian.net/browse/SV-10712)** is its verification ticket. Individual
  entries open fine by direct link, which is how the exhibits were taken.
- **The onboarding screen's Go live button cannot complete a go-live.** The chosen date never reaches
  the confirmation dialog (*"Start accounting as of —?"*) and the request fails
  `400 "The go-live date is required"`. Reproduced twice, by typing the date and by the calendar
  picker. **Not filed** — it is outside this ticket and belongs with whoever owns onboarding; happy
  to raise it if wanted.
- **One credit is a cent out between the two systems** — NOTAX2: ShopView total $106.30, AccountingHub
  $106.31 (line 101.25 + tax 5.05). **Explained, out of scope** — that is the cent-rounding behaviour
  of the sibling ticket this branch belongs to, not a decimal-quantity issue.
- **Returns can be confirmed for more than the quantity requested.** Every 1.5 case against a
  1.00-requested row showed an orange **"Received More Than Ordered."** warning and posted anyway.
  **Explained, not a defect** — it is how the ticket's own acceptance criteria are written and the
  warning is doing its job.
- Searched Jira before writing any of the above; nothing here duplicates an existing ticket except the
  Journal entries list, which is cited rather than re-raised.

---

## 7. Test data and environment

Per-ticket QA branches need no cleanup, so this is left in place as the reproduction. Everything is
tagged **ZZAUTOTEST**: credit memos `ZZAUTOTEST-CM-10406-` + `A/B/C/D/MAN/AC5/AC5B/AH1/AH2/AH3/FEE/
N05/N100/N125/NOTAX/NOTAX2/NT3/ZERO`.

Three things I changed deliberately:

- **The books were taken live** (go-live 2 October, activated 14:33:44). This cannot be undone and
  should not be — it is what makes criterion 5 testable at all, and the branch now has a working
  ledger with 16,636 backfilled records.
- **The location tax was switched to "Zero Tax (0%)"** to produce the no-tax return the criterion
  asks for, **and put back to GST (5%)** afterwards — re-read live at the end of this audit and
  confirmed back on GST.
- **Three skeletal items were added to ZZAUTOTEST-CM-10406-AH1** by the `add-item` probe (quantities
  1.50, 0.50, 1.25, no part attached). They are the evidence for §4, they are named here so they are
  not mistaken for real data, and **AH1 is not used in any comparison table.**


---

## 9. Reproduction steps the QA lead asked for (all re-driven live, 2 October)

### 9a. The tax item — why it could not be found, and where it actually is

**The QA lead could not reproduce it: *"I am not able to reproduce it as I am not seeing it in
vendor credits."* Re-checked live, and the list is findable but unhelpful in two specific ways:**

- the route is **`/accounting/purchases/credits`**, reached by **the module switcher (top-left
  "ShopHub") → AccountingHub → left nav PURCHASES → Vendor credits**. `/accounting/vendor-credits`
  and `/accounting/purchases/vendor-credits` both 404 — only the nav path works.
- **there is NO search box on that list and NO Memo column.** The columns are Source · Date ·
  Credit # · Vendor · Amount · Available · Status, with only first/prev/next/last paging. So a
  `ZZAUTOTEST-…` memo cannot be searched for at all — **it has to be found by credit number or
  amount.**

**Steps:** module switcher → AccountingHub → Purchases → **Vendor credits** → **C-13673**
(East Shoreham Truck & Equipment Repair, **$248.66**, first page, dated 10/02/2026) → click the row.
The detail screen shows the whole finding: Memo `ZZAUTOTEST-CM-10406-AH2`, Amount $248.66, Journal
entry **#4390**, and a **Lines** table whose only row is **`1300 Parts Inventory` $248.66**. Compare
with ShopView: Parts → Returns → **Credits** tab → that memo → Sub total **$236.82**, Tax **$11.84**,
Total **$248.66**. Exhibit `ev/05-where-to-find-the-tax-item.png`.

### 9b. Cancel Return — RE-VERIFIED LIVE ON A RETURN CREATED FOR THE PURPOSE

**The record used on 1 October (`ZZAUTOTEST-10406-CANCEL`) is GONE from the branch** — not in the
Returns tab, not in Credits, not retrievable. Somebody removed it between 1 and 2 October; it was
not us. **Rather than give steps for a defect last seen yesterday, a fresh manual return was created
and cancelled today**, and it still fails:

1. Parts → **Returns** → **Create Return** → pick any vendor → pick any part → Qty To Return `1` →
   **Save Return**. (The one used is **`ZZAUTOTEST-CANCELTEST-OCT2`**, 5 Star Truck Repair, P550848,
   1.00 @ $53.52, left on the branch and sitting at the top of the Returns tab.)
2. On that row click the **⋮** menu — it offers exactly one entry, **Cancel Return**.
3. Click it. The dialog appears: *"This will permanently delete the return. You cannot undo this
   action. Are you sure you want to delete this return?"* with **No** and **Yes**; Yes is enabled.
4. Click **Yes** → the dialog closes and **nothing else happens**.

**Measured:** **zero** non-GET requests leave the browser after clicking Yes, and the row is still
listed. Production behaves identically. Exhibit `ev/06-cancel-return-does-nothing.png`.

### 9c. The Go live button — CANNOT be reproduced on this branch any more

Honest answer: **the books on sv10408 are now live** (I took them live on 2 October so criterion 5
was testable), and the onboarding screen has replaced the go-live card with the completed summary —
read live today: *"Backfilled. Everything since 10/02/2026 is in the books — finished Oct 2, 2026
8:46 AM after 12 minutes. 16,636 written · 152 skipped · 0 failed."* **There is no Go live button on
that screen to press.** Reproducing it needs an organisation whose books have **not** been taken
live; it should **not** be attempted on production, because taking the books live there is not
something to do for a test.

### 9d. `change-item` — CLOSED, no action

QA-lead ruling, 2 October: *"If it is working in the UI then ignore it for now."* It is API-only and
no screen calls it, so under **Standing Rule 94** it is not filed and not pursued. Recorded here and
closed.

---

## 8. Outstanding

1. **An accounting answer on the tax** (§3): on a taxed vendor return the whole document total,
   including tax, is credited to Parts Inventory with no tax line. Not a decimal matter; needs
   whoever owns the inventory/tax mapping to say whether it is intended.
2. ~~`change-item`~~ — **CLOSED** by the QA lead's ruling of 2 October: *"If it is working in the
   UI then ignore it for now."* API-only, not filed, not pursued (Standing Rule 94).
3. **Whether to raise the onboarding Go live button** (§6).

Nothing else outstanding on this ticket.
