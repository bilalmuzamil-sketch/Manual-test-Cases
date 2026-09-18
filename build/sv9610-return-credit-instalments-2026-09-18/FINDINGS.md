# SV-9610 — a return credited in instalments loses its last units

**Status: DONE — QA PASSED. 8 checks, all pass, and the old fault was reproduced on production first
so there is a real before and after.** Nothing here is inferred; every line was observed live.

## What the ticket says

Katina Hoiting (Dannys Truck & Equipment Repair, via Intercom) had **three battery core returns** on
part sale **P-76096**, part **BSGA31S**, vendor Rush Truck Centres. Each core was on a **different
vendor invoice**, so the three credits had to be received separately. In her words:

> *"We had needed to receive 3 battery core credits under the Return area. All 3 credit we on 3
> different invoices so they needed t be received all separately. We went to do the 3rd one and it
> completely disappeared after we completed the 2nd return credit."*

Only **two** credits ended up under Parts → Returns → **Credits**, and the third core was gone from
**Returns** with no way to claim it. The reporter could not replicate it ("Steps to Reproduce: 1.
Unable to replicate").

**The developer's root cause (PR #3121):** when a credit was posted against a part return, the
credit's quantity was **counted twice** — once from the database and again from the event that created
it. The return therefore looked fully credited **one credit early**, and because the Returns list hides
completed returns, the remaining units vanished with no way to claim them. **Not core-specific — any
multi-quantity return credited in instalments lost its last credit.** He notes the fix stops it
happening again but does **not** repair returns already affected; P-76096 needs a separate data repair.

## Environments

| | URL | Build | Read |
|---|---|---|---|
| Fix branch | `sv9610.qa.shopview.com` | **v26.36.8-c20bc32** | `index.html` last-modified Thu 17 Sep 2026 10:30:06 GMT, etag `3062199f…`; `app-version` read from the page |
| Production (pre-fix) | `app.shopview.com` | **v26.36.8-961aeb2** | signed in with credentials, not cookies |

## The old fault reproduces on production — captured first

Both production runs credited **exactly 1 unit**; the quantity field was **read back from the page
before posting** on every run in this pass, after an early mistake (below) showed why that matters.

| Production run | Return | What happened |
|---|---|---|
| A | **core** return, quantity 2 — S-621, "Core for hfgj", Production Vendor 2 | Credited 1 on memo `ZZAUTOTEST-9610-BEFORE` → **the return vanished from the list**, one core stranded |
| B | **non-core** return, quantity 2 — S2-661, part `xcvxcvxc`, Delete Test | Credited 1 on memo `ZZAUTOTEST-9610-PROD2` → **the return vanished from the list**, one unit stranded |

Run B is the like-for-like partner of the branch run in the exhibit; run A is the closer match to
Katina's case, because hers were cores.

## Results on the fix branch

| # | Check | Result |
|---|---|---|
| 1 | **Quantity-4 return, credited 1 at a time** (part 6101678, S-16673): after each credit the return stayed in the list showing **3 → 2 → 1** outstanding, and only left the list on the **fourth** | PASS |
| 2 | The same return's four credits are all recorded under **Credits** — `ZZ9610-CM1…CM4`, **$15.42 each** | PASS |
| 3 | **The developer's own pre-fix shape: a CORE return of quantity 2, credited 1** (XSS504692DFCII, S-16810) → **stays in the list with 1 outstanding**. The credit posted was **$80.22**, i.e. one unit of $76.40 plus tax — proof that exactly 1 was credited | PASS |
| 4 | That core return's **second credit** completes it and it leaves the list | PASS |
| 5 | **Katina's case: a CORE return credited on three separate vendor invoices** (5579417PX, S-16994, quantity 6, two units per invoice): `ZZ9610-INV-1` → **4 left**, `ZZ9610-INV-2` → **2 left**, `ZZ9610-INV-3` → completes. **All three credits were claimable**; the old fault killed a return like this on the second | PASS |
| 6 | **Non-core quantity-2 return, credited 1**, quantity read back as `"1"` before posting → **still listed, Quantity column now reads 1**. This is the direct counterpart of production run B | PASS |
| 7 | **Regression — a quantity-1 return credited once** (BX109685SP core, S-17399): completes and leaves the list, exactly as it should. Nothing lingers | PASS |
| 8 | The Returns list count moved consistently with the work done (59 → 54 rows across the pass), with no unexpected disappearances | PASS |

## One mistake of my own, recorded because it nearly became a false regression

On the first attempt at check 6 the return **did vanish** on the fix branch, which looked like the bug
surviving. It was not. The credit record showed **$160.44** — the full quantity of 2 at $76.40 plus tax
— so my automation had submitted the whole return, not one unit; the quantity I typed had not landed in
the field. The return completing was therefore **correct behaviour**.

The fix was to **read the quantity field back and abort if it does not hold the intended value**, which
every subsequent run does. This is the Rule-75 trap in miniature: a "vanish" that looked like a
regression and was explained by what was actually submitted. Checking the posted amount before calling
it took two minutes and would have cost a false FAIL on the ticket.

## Exhibits

* `ev/EX1_before_after.png` — the same shape on both builds: quantity-2 return, credit 1. Production
  loses the row; the fix branch keeps it showing 1 outstanding.
* `ev/EX2_customer_case.png` — the three-invoice core case and the Credits tab.
* `ev/TICKET_shot1.png` — the customer's own Credits screen from the ticket, showing only two credits
  for P-76096.

## Test data

**Branch (per-ticket QA branch, no cleanup needed):** credits `ZZ9610-CM1…CM4`, `ZZ9610-CORE-A1/A2`,
`ZZ9610-INV-1/2/3`, `ZZAUTOTEST-9610-AFTER`, `ZZAUTOTEST-9610-AFTER2`, `ZZAUTOTEST-9610-SINGLE`;
part sale P9565-248 with part `ZZ9610-CORE1` (seeded for a core return, ordered but not received —
the receive screen's second quantity field could not be driven, and it was not needed once the
existing core returns served).

**Production (test organisation):** two credits were posted and **two returns are now stranded** —
`ZZAUTOTEST-9610-BEFORE` (S-621, one core left unclaimable) and `ZZAUTOTEST-9610-PROD2` (S2-661, one
unit left unclaimable). That is the defect doing what it does; both are plainly test records
(`xcvxcvxc`, "Core for hfgj", vendor "Delete Test") and both are named ZZAUTOTEST. They cannot be
undone from the product — which is the whole point of the ticket.
