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

## Follow-up: the core case re-done FROM SCRATCH, on a core seeded through the QA lead's own process

The original pass used core returns that already existed on the branch, and the comment says so. The
QA lead then supplied the part-sale process for creating one from nothing, so the core case was
re-run end to end on **`sv9610`, build v26.36.8-c20bc32**, 18 September 2026.

**Seeding** (the QA lead's steps, followed exactly): part sale **P9610-250** → Add Part with a part
number never used on this organisation (**ZZ9610CORE3**), Source **Vendor**, 5 Star Truck Repair,
quantity **3**, cost $10.00, **Core Charge 1** → Authorize → Order → Receive the main part on vendor
invoice **ZZ9610-CORE-INV1** → return the **whole part** (the reply icon on the part row, quantity 3).
Both the part and its **`Core for ZZAUTOTEST ZZ9610CORE3`** then appeared under **Parts → Returns** at
quantity 3.00 — the core travels with its parent, which is the step that makes a core return.

**Result — the fix holds on a core created from nothing:**

| Instalment | Credit memo | Posted | Part row | Core row |
|---|---|---|---|---|
| 1 of 3 | `ZZ9610-FRESHCORE-1` | $11.55 | still listed, 2 outstanding | still listed, 2 outstanding |
| 2 of 3 | `ZZ9610-FRESHCORE-2` | $11.55 | still listed, **1** outstanding | still listed, **1** outstanding |
| 3 of 3 | `ZZ9610-FRESHCORE-3` | $11.55 | leaves the list | leaves the list |

$11.55 is one part at $10.00 plus one core at $1.00 plus $0.55 tax — so each instalment credited
exactly one of each, and all three are recorded under **Credits**. Before the fix the return would
have disappeared after the second, stranding the third unit.

### ⚠️ The branch was rebuilt during that run — so it was re-proven cleanly on the new build

The pre-post gate (Rule 72) re-read the build marker before the comment went out and caught it:
**`v26.36.8-c20bc32` → `v26.36.8-e6db43e`**, `index.html` last-modified **Fri 18 Sep 2026 11:34:51 GMT**,
etag `3923008bf29d1e4c0f3e499a4458b110`. The from-scratch run above started at about 11:05 and finished
at about 11:40, so **it straddles the rebuild** and is not a single-build result.

Rather than disclose a split-build progression, the whole thing was **re-proven end to end on
`v26.36.8-e6db43e`**, using the other core return already seeded on the branch — part sale **P9610-249**,
part **4457485**, the part and its `Core for ghfjf`, quantity **5** each:

| Step | Credit | Both rows |
|---|---|---|
| start | — | listed, **5.00** each |
| credit 4 of 5 | `ZZ9610-NEWBUILD-1`, $46.20 | **still listed, 1 left** |
| credit the last 1 | `ZZ9610-NEWBUILD-2`, $11.55 | **gone from the list** |

The quantity was read back from the field before each post (`"4"`, then `"1"`), both posts returned
HTTP 200, and the build marker was **identical at the start and the end of this run**. $46.20 is exactly
four units and $11.55 exactly one, so the money split as the quantities did. Exhibit:
`ev/EX3_core_instalments.png`. The earlier two-build exhibit was **deleted rather than shipped**.

**Two product facts established while doing it, both recorded in the playbook (§AE):**
* **A core return cannot be part-credited on its own.** Tick the `Core for …` row alone and the
  Process Return screen offers a single **disabled** accepted-quantity box. Tick the **parent part's**
  row and two lines appear — the part editable, the core locked to it. The core is credited *with*
  its part, and the instalment quantity is typed on the part row.
* **A duplicate credit memo number is rejected with a message that does not say so** — HTTP 400 and a
  toast reading only *"An error occurred while processing the return."* I hit it once and checked the
  credits list before calling it anything, which is what it turned out to be.

## One mistake of my own, recorded because it nearly became a false regression

On the first attempt at check 6 the return **did vanish** on the fix branch, which looked like the bug
surviving. It was not. The credit record showed **$160.44** — the full quantity of 2 at $76.40 plus tax
— so my automation had submitted the whole return, not one unit; the quantity I typed had not landed in
the field. The return completing was therefore **correct behaviour**.

The fix was to **read the quantity field back and abort if it does not hold the intended value**, which
every subsequent run does. This is the Rule-75 trap in miniature: a "vanish" that looked like a
regression and was explained by what was actually submitted. Checking the posted amount before calling
it took two minutes and would have cost a false FAIL on the ticket.

## The QA comment

`76798` on SV-9610, posted after the pre-post gate (build marker re-read live and identical —
etag `3062199f…`; ticket still TESTING QA with only the developer's own comment on it; text scanned
for machine-authored tells). **No "Technical details for developers" section** — the QA lead was asked
first, per the new standing rule, and said no for this ticket; everything technical is in this
document instead. Read back from Jira: 2 exhibits in order, 9 table rows (header + 8 checks), first
line *"OVERALL QA STATUS: PASSED"*, all four headings present, no technical section.

**Comment `76798` updated 2026-09-18 06:48Z at the QA lead's instruction** — he had already removed the
two bullets about stranded production returns and the core I could not seed, and asked for the core
testing to be added. The comment now carries **11 checks instead of 8**, a new section *"A core return,
built and credited from scratch"* with `EX3_core_instalments.png`, and an opening line that states
plainly that checks 1–8 ran on `v26.36.8-c20bc32` and checks 9–11 on the rebuilt `v26.36.8-e6db43e`.

**Pre-post gate (Rule 72):** build marker re-read live (it had moved — see above, and that is why the
re-proof was done); ticket state re-read (**Ready for Production**, and a new developer comment `76804`
was found); images uploaded as **real Jira attachments**; every figure traced to a live measurement;
no AI fingerprint; **no technical-details section** (Rule 84). Read back from Jira afterwards: first
text node *"OVERALL QA STATUS: PASSED"*, **3 media nodes all of type `file`** in the intended order,
**one table of 12 rows** (header + 11 checks), `11 of 11 checks passed` and `e6db43e` both present.

**Slavcho's comment `76804` (18 Sep 06:40Z)** asks the QA lead to approve a one-record data repair for
Dannys Truck & Equipment Repair (part `BSGA31S` on P-76096 — 3 requested, 2 credited, 1 still owed),
says the repair only reopens that return and touches no existing credit, advises Katina to take the
last core as **one** credit memo rather than splitting it until the fix ships, and reports **33 more
returns across 21 other customers** to be repaired as a batch afterwards. **That go-ahead is the QA
lead's to give; nothing was answered on his behalf.**

## Exhibits

* `ev/EX1_before_after.png` — the same shape on both builds: quantity-2 return, credit 1. Production
  loses the row; the fix branch keeps it showing 1 outstanding.
* `ev/EX2_customer_case.png` — the three-invoice core case and the Credits tab.
* `ev/TICKET_shot1.png` — the customer's own Credits screen from the ticket, showing only two credits
  for P-76096.

## Test data

**Branch (per-ticket QA branch, no cleanup needed):** credits `ZZ9610-CM1…CM4`, `ZZ9610-CORE-A1/A2`,
`ZZ9610-INV-1/2/3`, `ZZAUTOTEST-9610-AFTER`, `ZZAUTOTEST-9610-AFTER2`, `ZZAUTOTEST-9610-SINGLE`;
part sale P9565-248 with part `ZZ9610-CORE1` (an early seeding attempt, ordered but not received);
and the completed from-scratch core run above — part sale **P9610-250**, part **ZZ9610CORE3**, vendor
invoice `ZZ9610-CORE-INV1`, credits `ZZ9610-FRESHCORE-1/2/3`.

**Production (test organisation):** two credits were posted and **two returns are now stranded** —
`ZZAUTOTEST-9610-BEFORE` (S-621, one core left unclaimable) and `ZZAUTOTEST-9610-PROD2` (S2-661, one
unit left unclaimable). That is the defect doing what it does; both are plainly test records
(`xcvxcvxc`, "Core for hfgj", vendor "Delete Test") and both are named ZZAUTOTEST. They cannot be
undone from the product — which is the whole point of the ticket.
