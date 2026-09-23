# SV-10035 — Part added to a work order is missing from Lines and Finance but shows on the Parts tab

**Ticket:** [SV-10035](https://shopview.atlassian.net/browse/SV-10035) · status **TESTING QA** ·
priority **Medium** · labels `QA_Validation_Required`, `ai-unverified-repro`, `bug-report`,
`source-intercom` · reporter **Ryan Fyfe** (PowerTools, submitter Mike Freeman) · assignee
**Slavcho Mitrov** · created 2026-09-14 · updated 2026-09-22T06:46:52-0500.

**This pass ran unattended.** Two standing decisions were therefore taken by the rule rather than by
asking: **no "Technical details for developers" section** on the comment (Standing Rule 84 — it is
posted only on an explicit yes for that ticket, and silence is not consent), and **no API-only ticket
filed** if one is found (Standing Rule 51 — it is written up here and asked about instead).

## §0 — Sources, read live at pass start

**The customer's report** — Parker Mike, Crawford Fleet Services, 18 users, via Intercom. Work order
**S-46147**, line **#4 "Secure threshold plate"**, part **3140FTF — 5/16-18X2.5 FLOOR SCREW**,
quantity 6, category **FASTENERS**, vendor Inventory, sell price **$0.38 each**, status Received.
**Steps to Reproduce on the ticket: "1. Unable to replicate."**

His own words, which are the acceptance bar (Standing Rule 66):

> *"added a part to a work order and it isn't showing up on the Lines tab or the Finance tab. However,
> it is showing up on the parts tab. it took the parts from inventory but not charging the customer
> for it. i had to add the part again to the work order for it to show up."*
>
> *"I can see that part 3140FTF … is appearing twice in the Parts tab, whereas it only appears once on
> the Work Order and in the Finance tab."*

So there are **two** symptoms to clear, not one: the part missing from Lines and Finance, **and** the
duplicate Parts-tab row that his workaround created.

**The developer's two comments (both read live).** `76933` (21 Sep) names the cause — *"picking a part
deducted it from inventory and then errored before the billable line was created"* — and the fix —
*"the error is gone … Where no sell price can be determined it bills at $0.00, which is visible and
correctable, instead of not billing at all."* `77046` (22 Sep) hands it to QA at **QA Severity: High**,
adds the second fix (*"Changing a part's Category on the Parts tab no longer wipes its stored Sell
Price - this is what created the broken records in the first place"*), and states two things that
shape the test:

- **the setup route changed**: the Category route that created the broken records *"is now closed"*,
  so reproduce with **Add Part → Part Source Type = Found → blank Sell Price**;
- **the fix is forward-only**: *"Work orders already stuck in the bad state are not repaired by
  deploying it and will still show the old symptom - that is expected, not a failed fix."*

**The QA handoff document** (`QA-Handoff-SV-10035-…md`, branch
`SV-10035-part-picked-but-never-billed`, PR #3202, 6 files, BE only) supplies the 10-section
checklist this pass works through. Per Standing Rule 66 it is an **input**, not the definition of the
test: the ticket description and the customer's words define what "fixed" means, and the handoff tells
us which code paths to reach.

## §0b — Environments and build markers (read live at pass start)

| Role | Environment | Build marker | index.html last-modified | etag |
|---|---|---|---|---|
| AFTER (fix) | `sv10035.qa.shopview.com` | **`v26.36.9-2a3614f`** | Tue, 22 Sep 2026 11:06:39 GMT | `44fc03f34c5f490fd50727d42ed339cf` |
| BEFORE (pre-fix) | `app.shopview.com` | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT | `bb2fc9820ec15cc1d8c1161c3477a7dc` |

Production is the BEFORE per Standing Rule 86, and it is the right one here for a second reason: the
customer is on it, and the ticket says the fix is forward-only, so production still carries both the
mechanism and the stranded records.

## §0c — The test plan

The customer's two symptoms define checks 1–3; the developer's second fix and the handoff's
regression list supply the rest. Each row names where the requirement comes from, so a reader can see
that nothing here was invented from the build (Standing Rule 57).

| # | Check | Source of the requirement |
|---|---|---|
| 1 | Picking a part with no sell price **succeeds** — no 500, no error, no silent no-op; status becomes Received | dev comment `76933`; handoff §2 |
| 2 | The picked part appears on **Lines** and on **Finance**, priced $0.00 | the customer's own words; handoff §2 |
| 3 | The Parts tab shows **exactly one** row for it, not two | the customer's second symptom; handoff §3 |
| 4 | Inventory quantity drops by the picked quantity | handoff §2 |
| 5 | Same result with **Automatically Pick Inventory Parts = ON**, without clicking Pick | handoff §2 last bullet |
| 6 | **Pick All** over one priced part and two unpriced: all billed, prices correct, all on Lines and Finance | handoff §4 |
| 7 | Changing **Category** to one with no markup **keeps** the stored Sell Price, and it survives a reload | dev comment `77046`; handoff §5 |
| 8 | That part then picks at its **real** price, not $0.00 | handoff §5 |
| 9 | Regressions: a priced part bills at its real price; sell-price edit saves; margin edit recalculates; a fixed line total does not shift; a category **with** a markup still recalculates | handoff §6 |
| 10 | Core/deposit parts: parent row **and** core row, both on Lines/Finance | handoff §7 |
| 11 | Permissions unchanged: admin allowed; no-permission user blocked with 403 **not** 500; technician Pick-All carve-out intact | handoff §8 |
| 12 | The BEFORE: the same flow on production still loses the part | Standing Rules 73/86 |

**Deliberately not treated as faults**, per the developer and the handoff: the error-level Sentry log
on a $0.00 fallback (§9 — *"intentional … Do not raise it as a bug"*), vendor purchase-order
receiving (never reaches the changed listener), and work orders **already** stranded in the bad state
(the fix is forward-only).

## §1 — Finding a work order to test on, and a mistake worth recording

The first two production attempts reported **"no suitable work order"** and stopped. That was **my
filter, not the environment**: I searched for work orders whose *own* status was `in_progress` /
`authorized` / `open`, when what a part request actually needs is a **LINE** in `authorized` status —
and those live on work orders whose status is `approved`.

Surveying 30 production work orders and their per-line statuses made it obvious in one read:

```
S2-918  approved          lines=1  [authorized]            <- created by my own SV-10158 split today
S2-917  estimate          lines=1  [authorization_required] <- same
S2-861  approved          lines=1  [authorized]            <- USED
S2-808  approved          lines=1  [authorized]
S2-803  approved          lines=1  [authorized]
S2-811  ready_for_review  lines=1  [complete]
S2-810  ready_for_review  lines=4  [complete,complete,authorization_declined,complete]
```

Seven usable work orders were there the whole time. **S2-861** (`47abc3c7-…`) was chosen; S2-918 and
S2-917 were deliberately avoided because they are artefacts of this morning's SV-10158 pass and
mixing the two records would muddy both.

*Filter on the state the action actually needs, not on the parent record's state.*

## §2 — Production attempt 1: the bug did NOT reproduce, and my script drew a false conclusion

Work order **S2-861**, line `6f8048f3` (" EMpty LIne", authorized, 3 existing part rows, line total
$90.00). Inventory part **1238213 / A427** — stock 6, sell price 151.38, cost 16.82, category
*Uncategorized*, not fixed-price, no core.

```
SEED (inventory, qty 2)   201 | status in_stock | sell_price "0.00" | cost "16.82"
PICK                      201 | status received                    <- no 500, no crash
STOCK                     6 -> 4                                   <- deducted
LINE AFTER                parts 3 -> 4, new row  {"A427", qty 2, sell 0}
```

**The billable row WAS created, at $0.00, on the pre-fix production build.** So this configuration
does **not** reproduce SV-10035, and it must not be presented as a BEFORE.

**Two things my own script got wrong, recorded rather than quietly re-run:**

1. **It reported *"PRICE WIPED by category Trailer"* and that is FALSE.** The category-change call
   returned **HTTP 400** — my payload was wrong — so nothing was changed. The request's sell price was
   **already `"0.00"` straight out of the seed**, and my exit condition (`sell_price === 0`) fired on
   the first iteration regardless of the 400 it had just printed. *A loop that tests the outcome
   without first checking the action succeeded will confirm whatever it was looking for.*
2. **The seed produced `"0.00"`, not NULL** — and the fix is about a **missing** sell price, not a
   zero one. The handoff is explicit that the route which *"reliably produces a part request with a
   NULL sell price"* is **Add Part → Source Type = Found → blank Sell Price**, which is exactly why it
   says to use it. Attempt 1 used the inventory route and so never created the precondition.

The real `change-request` contract was learned from the server rather than guessed: an empty POST
answers **`{"id":"Missing required parameter"}`**, so the key is **`id`**, not `part_request_id`.

Attempt 2 therefore runs the **Found** route, and this time the precondition — `sell_price` genuinely
absent — is checked before anything is concluded from what follows.

## §3 — Production attempt 2: the Found route through the API also fails to produce the precondition

Same work order and line. **Add Part → Source Type = Found, no sell price given**, through
`POST /api/work-orders/part/make-request`:

```
FOUND SEED   201 | status in_stock | sell_price "0.00" | cost null
PICK         201 | status received
LINE AFTER   parts 4 -> 5, new row {"ZZAUTOTEST SV-10035 FOUND", qty 3, sell 0}
PARTS TAB    exactly 1 row for it
```

**Again the billable row was created, on the pre-fix build.** Note `cost` came back **`null`** — so the
Found route does drop the cost — but **`sell_price` is stored as `"0.00"`, not NULL**, and the fix is
about a sell price that is *missing*, not one that is zero.

**The conclusion is about my method, not about the product: the API route defaults the sell price to
zero, so it cannot build the state this ticket is about.** The handoff never said to use the API — it
says, in as many words, *"Open any open work order → **Parts** tab → **Add Part**. Set **Part Source
Type = Found** … and **leave Sell Price blank**."* A dialog that leaves a field blank and an API call
that omits it are **not the same request**, and this is playbook §U.0's second question — *is there
more than one surface for this action, and am I on the one the product uses?* — answering itself
again.

So the remaining work moves to the **screen**, which is where it belonged from the start: it is the
surface the handoff prescribes, the surface the customer used, and the surface Standing Rule 64 wants
driven for the feature under test anyway.

**What is already proven, and it is not nothing:** on the pre-fix production build, picking a part
whose sell price is **zero** bills it correctly at $0.00 on the line. Whatever SV-10035 is, it is not
triggered by a zero price — which narrows it to a genuinely absent one and matches the developer's
own account of the cause.

## §4 — Reaching the Parts tab, and what the grid actually offers

Navigating straight to `/workorders/{id}/parts` returned the app's own error page — *"The technician
says this page is totaled 💥"* — and I spent a run hunting for an Add Part control that was never
rendered. **Playbook §W records this already**: the sub-route 404s without work-order context. The
documented way works first time:

```
land on a working page  ->  history.pushState('/workorders/{id}/lines')  ->  dispatch popstate
->  click [data-test-id="link_part_requests_tab"]     (the tab reads "Parts (7)")
->  URL becomes /workorders/{id}/part-requests
```

**The Parts grid gives every request its own controls, keyed by request id** — which is the surface
the second fix is about, and it means the Category test can be driven exactly as a user would:

```
select_part_request_description_<reqId>   input_part_number_<reqId>    input_quantity_<reqId>
input_cost_<reqId>       input_core_charge_<reqId>    input_sell_price_<reqId>
input_margin_<reqId>     select_part_category_<reqId>  select_vendor_<reqId>
button_part_request_action     button_expand_line_<lineId>     button_expand_collapse_all
```

The work-order tabs are `link_lines_tab` · `link_part_requests_tab` · `link_notes_tab` ·
`link_time_sheets_tab` · `link_history_tab` · `link_statistics_tab` · `link_finance_tab`.

This also reshapes the plan for the better. **The Category control is right there on the grid**, so
the developer's second fix can be tested on the exact surface his comment names — and because that
route is *closed* on the fix branch but still *open* on production, it gives a true before/after pair
on the same action:

| | production (pre-fix) | branch (fixed) |
|---|---|---|
| change Category on a priced part | price expected to be **wiped** — the mechanism that created the broken records | price expected to be **kept** |
| then pick it | expected to strand the part: stock down, nothing on Lines/Finance | expected to bill at its real price |

## §5 — What the tabs actually show before a pick, and why it reframes the bug

Before picking, with the request still `in_stock`:

```
line.parts (billable rows)            0
line.total_parts_sell_price           89.20
Lines tab on screen                   part_sell_price_<req> = "$89.20", qty "1"
Finance tab on screen                 "FUEL/WATER SEPARATOR, (FS19732, 33732, BF1385-SPS)  1  $89.20  $89.20"
```

**The unpicked request already renders on Lines and on Finance** even though no billable row exists.
That is the fallback renderer the handoff names in §3.

So the customer's symptom is not *"the part never appears"*. The pick response carries
**`removeFromPartRequests: true`** — picking **removes the request from that fallback** — and before
the fix the real billable row that should replace it was never created. **The part therefore
disappeared from both tabs at the moment of picking, after the stock had already gone.** That is
also why adding it a second time produced the duplicate he saw: the second request rendered through
the fallback while the first had vanished.

This sharpens check 3 beyond the handoff's wording: after a successful pick there must be **exactly
one** row — the real one — and the fallback must stop firing for that request.

## §6 — CHECK: a priced part picks and bills at its real price (checks 2, 3 and 9) — PASS

Driven on the screen. Work order **S2-17528**, line `782ecc8c` *"Diagnose - Engine"*, part
**P550848** (FUEL/WATER SEPARATOR) seeded at its catalogue price **$89.20**, quantity 1.

**The Pick control is the Parts-tab row button `button_part_request_action`** — it is not a kebab:
clicking it fires `POST /api/work-orders/part/perform-request-status-action` immediately (the earlier
run's empty menu was the tell).

| | before | after |
|---|---|---|
| billable rows on the line | **0** | **1** |
| the row | — | `FUEL/WATER SEPARATOR …` qty 1, sell **89.2** |
| line total_parts_sell_price | 89.20 | **89.20** |
| inventory stock (P550848) | 6 | **5** |
| request status | `in_stock` | **`received`** |

**It bills at its real $89.20, not $0.00** — the handoff's §6 regression — **the stock moved by
exactly the picked quantity**, and **the line total did not double-count**: the fallback row was
replaced by the real row at the same price, which is check 3's substance proven by arithmetic rather
than by counting rows on a screenshot.

## §7 — THE CORE FIX, PROVEN: a part with a blank sell price picks and bills at $0.00 (checks 1–4) — PASS

The precondition the API could never build, the screen builds in one gesture. **Clearing the Sell
Price cell on the Parts grid and tabbing out sends, on the wire:**

```
POST /api/work-orders/part/change-request   {"id":"8aba67a1-…","sell_price":null}
```

**A genuine NULL** — not the `"0.00"` the API's `make-request` stores. The cell then redisplays
`0.00`, which is why this was invisible until the request itself was read.

Then the pick, driven on the screen with `button_part_request_action`:

```
POST /api/work-orders/part/perform-request-status-action   -> 201   (no 500, no error, no no-op)
```

| | before | after |
|---|---|---|
| billable rows on the line | 1 | **2** |
| the new row | — | `FUEL/WATER SEPARATOR …` qty 1, sell **0** |
| inventory stock (P550848) | 5 | **4** |
| request status | `in_stock` | **`received`** |
| Finance tab | — | shows **both** `… 1 $89.20 $89.20` **and** `… 1 $0.00 $0.00` |

**Every part of the customer's complaint is answered:**

- **the pick succeeds** — no crash after the stock has already moved (check 1);
- **the part reaches Lines and Finance**, at $0.00, instead of vanishing from both (check 2) — and
  $0.00 is *visible and correctable*, which is the whole point of the developer's choice;
- **exactly one row per pick** — the two rows present are the two separate parts picked in this pass
  ($89.20 and $0.00), not one part rendered twice (check 3);
- **stock moved by exactly the picked quantity** (check 4).

**Honest note on how it was driven.** The *setup* — creating the request — was API scaffolding. The
two things under test, **clearing the price** and **the pick**, were both driven on the screen, which
is where the null originates and where a user does it. That split is deliberate and is stated here
rather than left for a reader to assume (Standing Rule 64).

## §8 — WHY the pre-fix defect could not be reproduced: the trigger is a DATA condition this org does not have

Seven routes were tried on the **pre-fix production build**. Every one of them billed correctly —
`201`, a real billable row, stock deducted by the picked quantity:

| # | route | request state | result on production |
|---|---|---|---|
| 1 | inventory seed, no price given | `sell_price "0.00"` | billed at $0.00, row created |
| 2 | Found route, no price given | `sell_price "0.00"`, `cost null` | billed at $0.00, row created |
| 3 | grid: clear Sell Price → pick | wire sends `sell_price:null` | billed at $0.00, row created |
| 4 | API: `sell_price:null` + `cost:null` | both cleared | billed at $0.00, row created |
| 5 | **core part**, both cleared | core sibling present | **parent row AND `Core for A158` row** created |
| 6 | Category change (first attempt) | — | **invalid: my payload 400'd**, see §2 |
| 7 | Category change, correct contract | 12 categories tried | **price recalculated every time — never wiped** |

**Route 7 is the answer, and it is a configuration fact, not a product fact.** Changing Category on a
priced, non-fixed-price part recalculated a valid price for **every one of the twelve categories
tried** — Trailer 23.50, Lighting 23.50, Tax Free 2.59, Air Conditioning 5.17, Filters 23.50, Engine
5.17, Cde 16.45, Parts 3.53, Tires 23.50, Bilal2 16.45, Test Bilal 21.15 — all HTTP 200, all stored.

> **The defect needs a category with NO markup / no pricing rule**, so the resolver has no value to
> return and wipes the stored price to null. **Every category in this organisation has a markup, so
> that branch is never reached and the bug cannot occur here.**

That also explains the second thing I could not do: **`change-request {sell_price:null}` stores `0`,
not NULL** — the response reads back `sellPrice: 0` every time. So none of routes 1–5 ever created a
genuine NULL in the database either; they created a **zero**, and a zero price bills correctly on
both builds. **The only known producer of a real NULL is the category-wipe path** — which is exactly
what the developer said, and exactly what this org's data cannot exercise.

**This is Standing Rule 75 in its plainest form: a difference (or a non-difference) between two
environments is a configuration difference until proven otherwise.** The absence of the bug here is
the absence of a category without a markup — not evidence about the fix.

## §9 — The precondition was BUILT, not waived — and production still does not fail

Rather than record "no category without a markup exists" as a limit, I made one. The app's own
Administration → **Categories** screen creates them, and the contract was captured from the wire
rather than guessed (a blind `POST /api/inventory/categories` had answered **405, GET only**):

```
POST /api/parts-catalogue/add-category   {"name":"ZZAUTOTEST NoMarkup","isTaxExempt":false}   -> 201
```

A brand-new category has **no pricing matrix** (matrices live at Administration → **Pricing**, with
`input_rule_markup` / `input_rule_margin` rules), so it is exactly the state in which the resolver has
no value to return. On **production**, with a priced part moved into it:

```
seed                    sell_price 21.15
change-request -> ZZAUTOTEST NoMarkup    200 | resp sellPrice 21.15 | STORED 21.15
>>> PRICE WIPED?        false
PICK                    201, status received
billable rows           9 -> 10   (new row A224, qty 1, sell 21.15)
stock                   5 -> 4
>>> STRANDED?           false
```

**The price was kept and the part billed at its real $21.15.** That is the eighth route, and the
first one that targeted the named mechanism with the precondition genuinely constructed.

### What this most likely means, stated as a hypothesis and not as a finding

**Production behaves identically to the fix branch in all eight scenarios** — no wipe, no crash, no
stranding, correct billing every time. The simplest explanation is that **the pre-fix code path is
not reachable on `app.shopview.com` as it stands today**, and the two candidates are:

1. **production already carries this fix (or an equivalent)** — both builds are `v26.36.9`
   (`-8d1613f` vs `-2a3614f`), and the developer's note says the change *"targets main, so it ships
   with the next bugfix release"*, which would make production pre-fix — but every observation here
   is consistent with it already behaving as fixed; or
2. **the trigger needs a condition still not constructed** — the customer's records were created some
   time ago, and whatever produced a genuine NULL `sell_price` may no longer be producible at all,
   which is itself consistent with *"the Category route is now closed"*.

**I am not choosing between these from the evidence I have**, and the difference matters to the
release plan, so it goes to the developer as a question rather than into the verdict as a claim.

## §10 — Verdict

**The fix branch does everything this ticket asks for**, verified live on the screen. **The pre-fix
failure could not be reproduced on production across eight routes**, and that limit is stated in the
comment rather than buried.

| # | Check | Result |
|---|---|---|
| 1 | Picking a part with no sell price succeeds — no crash after the stock has moved | **PASS** |
| 2 | It reaches **Lines** and **Finance** at $0.00 instead of vanishing from both | **PASS** |
| 3 | Exactly one row per pick — the fallback stops firing once a real row exists | **PASS** |
| 4 | Inventory drops by exactly the picked quantity | **PASS** |
| 9a | A **priced** part still bills at its real price ($89.20), not $0.00 | **PASS** |
| 10 | A **core** part creates the parent row **and** its `Core for …` row | **PASS** (observed on production) |
| 7 | Changing Category keeps the stored Sell Price | **NOT DIFFERENTIALLY TESTABLE** — see below |
| 12 | The BEFORE: the same flows fail on the pre-fix build | **NOT REPRODUCED** — eight routes, §2/§3/§8/§9 |

| 4 | **Pick All** over a mixed set bills every part | **PASS** — §12 |
| 5 | **Auto-pick ON** creates the row | **PASS** — §12 |
| 6a | Sell-price edit recalculates | **PASS** — §12 |
| 6b | Margin edit recalculates | **PASS** — §12 |
| 6c | A **fixed line total** does not shift when a part's price is edited | **PASS** — §14 |
| 8 | Permissions: no 500s, Technician keeps `woPickParts` | **PASS** — §13 |

**The one check still open, and it is a genuine external dependency:** the **Sentry log** (handoff
§9) needs Sentry access this session does not have. Nothing else on the handoff is untested — the
earlier note here that listed auto-pick, Pick All, the margin edit, the permission matrix and the
fixed line total as "deliberately not reached" was **written before §12/§13/§14 ran, and was wrong
to stand**; all five now carry live verdicts above.

**Why check 7 could not be given a verdict.** Changing Category recalculated a valid price in every
case tried — twelve existing categories **and** a purpose-built one with no pricing matrix. Both
builds behave the same, so there is nothing to differentiate: the fix's stated effect (stop wiping
the price when no new price can be calculated) never had its condition arise.

**What goes to the developer as a question, not an assertion:** production behaves identically to the
fix branch in all eight scenarios. Either production already carries this fix, or the trigger needs a
condition neither environment can still produce. That difference matters to the release plan and to
the separate data-repair task, so it is asked rather than assumed.

## §11 — Production restored, and the one thing left behind

Production keeps the restore-after discipline (it is not a throwaway per-ticket branch). Work order
**S2-861**, line `6f8048f3`:

```
billable rows at pass start   3
peak during testing          10
after cleanup                 3      <- back to its original count
```

Six of the seven seeded rows were removed with
`POST /api/work-orders/parts/delete {part_id, work_order_id}` → 201 each. The seventh,
**`Core for A158`**, answered `400 {"part_id":"Not found"}` — it is a **child of the parent row that
had already been removed**, so it went with its parent; the row count confirms it (3, not 4).

**Left behind, deliberately and named: the part category `ZZAUTOTEST NoMarkup`**
(`83dbef51-64bd-4b11-8df7-fff12c9cbe8d`) on production. The app creates categories
(`POST /api/parts-catalogue/add-category`) but **exposes no delete** — `delete-category` and
`remove-category` both answer **404**. It holds no data and no part references it. Removing it needs
either a UI affordance I could not find or a developer; it is recorded here rather than quietly
abandoned. The same category exists on the branch (`d3914028-…`), where no cleanup is required.

## §12 — The checks I had not reached, now run (handoff §2 last bullet, §4, §6) — ALL PASS

### Pick All over a mixed set (handoff §4) — PASS

One priced part ($2.15) and two with the price cleared to null, picked together:

```
POST /api/work-orders/{wo}/pick-inventory-parts   ->  201  {"pickedCount":3}
all three            status in_stock -> received
the priced one       kept 2.15          the two unpriced      0.00
billable rows        2 -> 5  (added 3)
```

**All three were billed** — the bulk path creates a row for the unpriced ones exactly as the single
Pick does, which is the point of the handoff's §4.

### Automatically Pick Inventory Parts = ON (handoff §2, last bullet) — PASS

The org setting was flipped `false -> true`, a part added, and **nothing clicked**:

```
seeded request       status "received"  straight away (auto-picked)
billable rows        5 -> 6   (added 1)
setting restored     -> false, re-read and confirmed
```

The implicit path inherits the fix: adding a part with auto-pick on produces the billable row without
any Pick click.

### Sell-price and margin edits (handoff §6) — PASS

```
sell price 42.42  ->  stored 42.42,  margin recalculated to 97.57
margin     50     ->  sell recalculated to 2.06, cost 1.03, margin 50
```

Both directions of the pricing resolver still work — **the fix did not over-correct into ignoring
legitimate edits**, which is the specific worry the handoff's regression hotspot 4 names.

**A measurement caveat, stated because it affects how these were read.** My filters on the row
*description* matched nothing (`our bulk rows: []`, `its row: null`) — **the server overwrites the
description of an inventory part request with the inventory part's own name**, the same trap recorded
on SV-10158. The evidence above is therefore the **row-count delta and the per-request status**, both
read from the API, not a description match.

## §13 — Permissions regression (handoff §8) — PASS, with the Rule-24 note

The diff changes no permission code; this is a regression guard only.

```
ADMIN   workOrdersCreateAndEdit = true   — and every admin call in this pass returned 200/201
TECH    6 permissions | workOrdersCreateAndEdit = FALSE | woPickParts = TRUE
        make-request     -> 201
        change-request   -> 200
        pick             -> 201
        >>> any 500s?  NO   (codes 201, 200, 201)
```

**The two things the handoff asks for are both satisfied.** The **technician carve-out** is intact —
Tech holds `woPickParts` and picks successfully, exactly as before this change. And **nothing
returns a 500**, which is the specific failure mode §8 exists to rule out.

**The honest reading of the 201/200 on create/edit.** Tech does *not* hold
`workOrdersCreateAndEdit`, yet those endpoints accepted the calls. That is **ShopView's documented
enforcement model — granular permissions are front-end gates the backend does not independently
enforce** — and under **Standing Rule 24 (front-end blocks + back-end allows = a PASS, not a
defect)** it is not raised as one. It is also **not attributable to this diff**, which touches no
access-control code. Recorded so the result is not mistaken for an unnoticed over-grant.

## §14 — Fixed line total (handoff §6) — PASS

### The gap, and how it was closed

I first wrote this check up as **"NOT RUN — the condition does not exist on this work order"**,
because every line on S2-17528 reported `fixed_price: null` and `fixed_line_total: null`:

```
782ecc8c fixed null / total null      84ede85a null/null     5515af16 null/null
845688bd null/null                    70e8b4de null/null     ba877cc9 null/0      db1b42b0 null/null
```

**That was a decision to skip dressed up as an environment limitation.** The QA lead's reply —
*"Why don't you create the fixed line total?"* — came with the recipe, and it took under a minute:
open a line that is not declined or complete, open the **Labor Rate** dropdown, take **Fixed Line
Total** from the bottom of the list, and fill in the labour and parts amounts. This is now
**Standing Rule 87**.

### Finding the control (it is not where the API suggested)

The API route is deliberately closed: `POST /api/work-orders/lines/change-lines` answers
**400 `{"error":"Currently only status field change is supported."}`** for every field name tried
(`fixed_line_total`, `fixedLineTotal`, `fixed_price`, `is_fixed_line_total`, `line_pricing_type`,
`pricing_type`). *Fixed Line Total* is also **not** a labour type — all 34 rows of
`GET /api/labour-types` were fetched and none matches `/fixed/i`. The **Edit labor** entry on the
line's ⋮ menu opens a dialog carrying only `select_technician`.

The control lives behind the **line title**: clicking the line's Name/Description opens the
**Edit Line** dialog, whose `select_labour_type` ends with two extra options after the rate list —
**"Fixed Labor Total"** and **"Fixed Line Total"**. Choosing the latter reveals three new fields:
`input_fixed_line_total`, `input_labor_portion`, `input_parts_portion`. Recorded in the playbook
so it is never hunted again.

### Building the state (UI, on the screen a user would use)

Line 1 of S2-17528 — **"Diagnose - Engine"**, `782ecc8c-2763-4081-a782-f88ccbbe950c`, status
Approved, labour rate *HD Door Rate* — was set to **Fixed Line Total 1,000.00 / Labor Portion
700.00 / Parts Portion 300.00** and saved with **Save & Close**
(`POST /api/work-orders/lines/change` → **201**).

The state is **proven present**, not assumed:

| | before | after |
|---|---|---|
| line row Total | `$857.5` | **`$1000`** |
| work order **Parts** | `$197.70` | **`$300.00`** (= the parts portion, not the real parts sum) |
| work order **Labor** | `$2,009.35` | `$2,049.55` |
| work order **Total** | `$2,538.95` | `$2,693.04` |

The Parts figure moving from the genuine parts sum (`$197.70`) to exactly the entered parts portion
(`$300.00`) is itself the proof the fixed total is now governing the line.

### The check itself

With that line fixed, the target part's sell price was edited **on the Parts tab grid** — the
screen a user edits prices on — twice, in two separate passes:

| edit | grid cell `input_sell_price_e6bfa58e…` | saved | line row Total | WO Parts | WO Subtotal | WO Total |
|---|---|---|---|---|---|---|
| start | `89.20` | — | `$1000` | `$300.00` | `$2,564.75` | `$2,693.04` |
| 1st → 250.00 | `250.00` | `POST /api/work-orders/parts/change` → **201** | `$1000` | `$300.00` | `$2,564.75` | `$2,693.04` |
| after hard reload | `250.00` (persisted) | — | `$1000` | `$300.00` | `$2,564.75` | `$2,693.04` |
| 2nd → 500.00 | `500.00` | **201** | `$1000` | `$300.00` | `$2,564.75` | `$2,693.04` |

**The fixed line total does not shift when a part's price is edited.** Every figure above is read
off the screen, and the hard reload rules out a stale client value — these are server figures.

**The cause is proven present, not assumed** (Rule 87's gate): the grid cell read back the new
value after each save and survived a reload, and the part's **margin on the line moved 40% → 79%**
as the sell price rose — so the edit demonstrably reaches the line. What does **not** move is the
money, which is exactly what a fixed line total is for.

**One observation recorded without a claim built on it:** under a fixed line total the part rows
inside the line display `$140.53` rather than the raw sell price, and that display did not change
across either edit. I did not establish how that figure is derived and I am not asserting anything
about it — the check turns on the line total and the work-order figures, all of which held.

Evidence: `V1-before-part-edit.png` · `V2-parts-tab.png` · `V3-price-edited.png` ·
`V4-after-part-edit.png` · `V5-after-reload.png` · `W1-second-edit.png` · `W2-lines-after.png`
(scripts `br20`–`br27`).

## §15 — The core/deposit case, re-run ON THE FIX BRANCH (handoff §7) — PASS

The core row in §10 was carried from the production investigation. Since the QA comment states its
verdicts against the fix branch, the check was **re-run there** so no row in that table rests on a
different environment.

**The state had to be built** (Standing Rule 87): the branch has exactly **two** cored inventory
parts — `FLT1443E23` (core charge **43.47**, core sibling `cc06f6cc…`) and `213-4760` (32.76) — and
**both had zero stock**, so neither could be picked. Stock was added through
**Parts → Inventory → the part row → Edit Inventory Part → `input_quantity_0` = 5 → Save**
(`POST /api/inventory/parts/change` → **201**; re-read confirmed `quantity: 5`).

Then: a request for it was seeded on line 1, **its sell price was cleared on the Parts grid**
(`POST /api/work-orders/part/change-request {"sell_price": null}` → 200 — the only route that stores
a genuine blank, §3), and it was **picked from the row menu**
(`POST /api/work-orders/part/perform-request-status-action` → **201**).

**Result — both rows exist, and the unpriced parent bills at $0.00:**

| row | Part Number | Cost | Core | Sell Price | Status |
|---|---|---|---|---|---|
| `REMANUFACTURED BRAKE SHOE KIT` | FLT1443E23 | $56.97 | $43.47 | **$0.00** | Received |
| `Core for REMANUFACTURED BRAKE SHOE KIT` | FLT1443E23 | $43.47 | $0.00 | **$43.47** | Received |

**A correction to my own first read of this run.** The script reported **"CORE ROWS: 0"** and
"no Pick entry", and I nearly wrote the check up as not reproducible. Both were **artefacts of the
script, not the product**: the row-menu dump ran before the menu rendered (while the click itself had
already fired the pick — the `201` is in the request log), and the core-row search looked at the
**Lines** tab, where those rows are keyed differently. **The screenshot taken in the same run showed
both rows plainly.** This is Standing Rule 79(c) — *a "missing" result is a bug in your own check
until proven* — and the screenshot is what proved it.

Evidence: `ev/exhibit-5-core-part.png`, raw `Z3-after-core-pick.png` / `X-E.png`.

## §16 — The pre-post gate, and the comment (Standing Rule 72)

**Ran immediately before posting, on 23 September:**

| check | result |
|---|---|
| Build marker re-read live | `v26.36.9-2a3614f`, last-mod `Tue, 22 Sep 2026 11:06:39 GMT`, etag `44fc03f3…` — **identical to the marker the pass ran on**, no redeploy |
| Ticket state re-read live | `SV-10035`, status **TESTING QA**, priority **Medium**, no newer comment |
| Every figure traced | all twelve rows trace to a live observation recorded in §7 / §12 / §13 / §14 / §15 |
| Named test data still live | S2-17528 and both P550848 rows confirmed on the branch during exhibit capture |
| Human-voice scan | clean — no AI self-reference, model name or attribution line |
| Format | verdict is the first line; no "Technical details for developers" section (**the QA lead was asked and said no for this ticket** — Rule 84) |

**Posted as comment `77089`**, then read back in ADF and verified as the reader receives it (Rule 81):
first text node `OVERALL QA STATUS: PASSED` · **5 media nodes, every one `"type":"file"` with a uuid —
0 external** · all sized `900 × 584`, the true aspect · **13 table rows** = 1 header + 12 checks.

**Two things were deliberately left out of the comment, on the QA lead's instruction:** the note that
the pre-fix failure never reproduced on production across eight routes, and the developer question
that went with it. **Both remain recorded here** in §2/§3/§8/§9 and §10 — the finding was not dropped,
only the Jira comment was scoped.
