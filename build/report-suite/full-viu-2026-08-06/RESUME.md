# RESUME - Report Suite VIU, as at 2026-08-06 end of the FIFTH session

> **⚠️ EVERYTHING BELOW THE NEXT HORIZONTAL RULE IS EARLIER SESSIONS' AND IS SUPERSEDED FOR THE COUNTS.**
> Session 5's record is this banner plus the SESSION 5 sections of `FINDINGS.md`,
> `testrail-execution-log.md`, `FILED.md`, `CHANGES-MADE.md`, `QUESTIONS-FOR-CHRIS.md` (Q8) and
> **section H of `RECHECK-QUEUE.md`**.

## THE STATE NOW, re-derived from live at the end of the session

| | Count |
|---|---:|
| Live under group 4281 | **481** |
| **Ours** | **476** (foreign C38919-C38923, Vladimir Tomovic - hands off, Rule 38) |
| **Carrying a 6 August verdict** | **403** |
| **STILL OUTSTANDING** | **73** |

**403 + 73 = 476.** The gap was **89** when this session started, so **16 were closed**. Count by case id,
never by line: `grep -oE 'C[0-9]{5}' REMAINING.txt | sort -u | wc -l`.

**I re-derived the 89 independently from live TestRail before starting and AGREED with the handover** —
476 ours, 387 verdicted, 89 outstanding, and the per-report split matched exactly.

## THE BUILD DID NOT MOVE DURING THIS SESSION

`v3.5-f77875c`, last-mod Thu 06 Aug 2026 10:43:37 GMT, etag `829ed03832a746e78cbdb28eb9957a3e`.
Read at **13:53:17Z**, **14:49:05Z** and **15:02:29Z** — `index.html` sha256 **identical all three times**
(`b0f05b6f…94fc9b6`). It had moved **twice earlier today**, before this session; **zero times under it.**
**Every one of the 16 cases carries the marker it was actually observed on.**

## Sources (Rule 31 at start, Rule 59 re-read before the writes)

SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4** — **none moved.**

## THE EXACT NEXT ACTION

`REMAINING.txt` **section A** is the work list, **73 cases**, regenerated from live, each row carrying the
build it was last checked against and its current marker:

| Report | Outstanding |
|---|---:|
| **Sales By Representative** | **37** |
| Parts Velocity | 17 |
| Sales By Customer | 14 |
| Technician Utilization | 2 |
| Work In Progress | 2 |
| Inventory Value | 1 |

**Start with the Sales By Representative groups that an Admin can drive**, in this order, because each is a
self-contained block with no new access needed:
1. **Staff Deactivation — 8 cases** (C30253–C30260). An Admin has staff administration, so the whole
   dialog is drivable. **Doing this first also unblocks C30242 item 2**, which needs an `(Inactive)`
   contributor to exist.
2. **Work Order Sales Rep — 6 cases** (C30310–C30315). The playbook §N.2 already documents
   `GET /api/sales-reps`, the `is_sales_rep` flag and `change-sales-rep`, and note its warning that
   `change-sales-rep` **returns 201 but silently no-ops for a work order in another workplace**.
3. **Sales Rep Assignments export — 5 cases** (C30292–C30297) and **Exports — 5 cases**
   (C30280/82/83/88/89).
4. **The 4 remaining calculation cases** (C30233 Margin %, C30234 money labels, C30235 accounting
   parentheses, C30236 half-up rounding). **Beware:** every row on this estate has `margin_pct: 100` and
   `margin == subtotal` because costs are zero, and **no negative money value exists**, so C30235 needs a
   credit or a negative adjustment seeded before it can be observed at all.
5. **Then Parts Velocity (17), Sales By Customer (14), TU (2), IV (1).**

## ⚠️ ~19 OF THE 73 CANNOT BE DRIVEN WITHOUT A SECOND SIGN-IN, AND IT IS STILL THE BRANCH REFUSING

Do **not** spend a session re-discovering this — `SECOND-LOGIN-ATTEMPT.md` has the proof.
`POST /api/switch-user` and `POST /api/quick-login {"key":"tech"}` both return **HTTP 403 "Access denied."**
on this branch. **Neither was called in this session** (a sibling worker shares the token). The affected
cases: SBC C30098/C30099/C30100/C30101/C39447/C43546/C43558 · SBR C30198/C30199/C30200/C43559 ·
PV C30325/C30326/C30327/C30391 · WIP C30526/C30527. The one-location cases (SBC C43550, C38912, C30109,
SBR C30216, PV C30340) need a **single-location user**, which is the same ask.

**C39447 is worth a look though — it may be drivable as an Admin.** It asserts that *no* Sales By Customer
permission is offered in the role permission editor, which is a negative an Admin can read directly.

## 🔴 THE ARITHMETIC GATE IS NOT CLAIMED AND MUST NOT BE

**Only 51 of the 476 cases carry a verdict established on the build now running** (35 from session 4, 16
from this one). Live markers: **330 `READY` · 103 `READY - EXPECT FAIL` · 43 `HOLD` = 476**. The suite spans
five markers — **51 on `v3.5-f77875c` · 133 on `v3.5-7168d14` · 219 on `v3.5-16cf83f` · 4 on
`v3.5-16cf83f` (5 Aug) · 66 on `v3.4.1-3d03023` · 3 on none** — stated per case in `REMAINING.txt` rather
than averaged.

## Outstanding, in the order it blocks work

1. **A second sign-in as a non-administrator, and a single-location user** — blocks ~19 of the 73 across
   six reports. **The branch, not us.** QA lead or a developer.
2. **Chris Ward: 8 unanswered questions** — Q5 (the Location column) still holds 8 cases, and **Q8 is
   new** (should a returned part come back out of Parts Earned? — the specification is silent, so the
   question is asked rather than guessed).
3. **The labour-price field name for `POST /api/work-orders/lines/change`** — the only thing standing
   between us and the per-line cap (C30475 item 2, C38890 item 3). Capture it from the *Edit labor*
   dialog's own request; do not guess it.
4. **A negative money value somewhere in Sales By Representative** — C30235 cannot be observed without one.
5. **The 432-case `refs` version sweep** — still not authorised, still not started. Note the refs on the
   cases touched today still read *"SBR spec v15"* / *"WIP spec v6"* against live 17 and 9; **`refs` was
   not written on any operation this session.**
6. **The branch declared final** — it will not be, so the Rule-49 queue stays open by design (Rule 60).

---

# RESUME - Report Suite VIU, as at 2026-08-06 end of the FOURTH session

> **⚠️ EVERYTHING BELOW THIS BANNER IS EARLIER SESSIONS' AND IS SUPERSEDED FOR THE COUNTS.** Session 4's
> record is in this banner plus the SESSION 4 sections of `FINDINGS.md`,
> `testrail-execution-log-session4.md`, `FILED.md`, `CHANGES-MADE.md`, `SOURCE-CURRENCY.md` and
> **section G of `RECHECK-QUEUE.md`**.

## THE STATE NOW, re-derived from live at the end of the session

| | Count |
|---|---:|
| Live under group 4281 | **481** |
| **Ours** | **476** (foreign C38919-C38923, Vladimir Tomovic - hands off, Rule 38) |
| **Carrying a 6 August verdict** | **387** |
| **STILL OUTSTANDING** | **89** |

**387 + 89 = 476.** The gap was **124** when this session started, so **35 were closed**, all of them
**Work In Progress**. Count by case id, never by line:
`grep -oE 'C[0-9]{5}' REMAINING.txt | sort -u | wc -l`.

## 🔴 THE BLOCKER — READ THIS FIRST

**THE SIGNED-IN SESSION DIED AT ~11:37Z AND CANNOT BE RECOVERED FROM THE CONTAINER.** Every request on
**all three** QA branches returns **HTTP 401 `sso_required`**; `sv8582api`, `sv8785api` and `sv8685api`
all share **one `sv_sso_session`**, and it has expired estate-wide. `POST /api/quick-login {"key":"admin"}`
— the documented recovery — **returns 401 itself**, because quick-login is SSO-gated too. This was
diagnosed against every one of the playbook's five false-dead-session traps before being called a
blocker: the cookie file is intact and one-line, the api host (not the SPA host) was probed, and the
request **reaches the application** and gets an application-level JSON refusal, so `cf_clearance` is fine.

**`switch-user` was never called and `quick-login {"key":"tech"}` was never called**, so this pass did not
cause it. **What is needed: a fresh `sv_sso_session` for `.qa.shopview.com`, from the QA lead.**
Nothing further can be observed until then.

## THE EXACT NEXT ACTION, once a sign-in exists

`REMAINING.txt` **section A** is the work list, **89 cases**, regenerated from live:

| Report | Outstanding |
|---|---:|
| **Sales By Representative** | **45** |
| Parts Velocity | 17 |
| Sales By Customer | 14 |
| Work In Progress | 10 |
| Technician Utilization | 2 |
| Inventory Value | 1 |

**The eight Work In Progress cases are half-seeded and cheap to finish.** A work order already exists
(`e40c1c15-63ba-4202-9cc9-358da3d5fe21`, Iibay Landscaping, Staging Heavy Duty - 9919, **no lines**), and
the two fields those cases need are identified: **`input_time_estimate` ("Estimated Time") and
`input_tech_time` ("Tech Time") in the New Line dialog**, reached by a **coordinate click** on
`button_new_line` (a Quasar backdrop intercepts an ordinary Playwright click). What is not yet known is
which further field `button_save_close` requires — it fired **no request** with description, labour rate,
both times and Line Approved all set. Try picking a canned line via `select_line_canned_line` first.

## What this session did

**44 `update_case` over 40 distinct cases, every one HTTP 200, 30 fields compared each, 0 mismatches,
0 collateral changes**, all three text fields on every payload. **0 add · 0 delete · 0 section · 0 run
writes · 0 results logged.** The 432-case `refs` sweep was **not** run.

**Work In Progress: 35 of its 45 outstanding cases closed** — **24 PASS · 5 DEVIATION · 6 HOLD**.

**Three Story Defects filed at the new priority `Medium`, 11/11 field checks each:**
[SV-8987](https://shopview.atlassian.net/browse/SV-8987) (Last Activity left-aligned, S4-R4) ·
[SV-8988](https://shopview.atlassian.net/browse/SV-8988) (Estimates figure not muted, S5-R8) ·
[SV-8989](https://shopview.atlassian.net/browse/SV-8989) (Inv. Hrs two decimals, S4-R23).

**Nine provenance repairs.** The five the readiness pass named (**C30278**, **C38856**, **C43552**,
**C43553**, **C43557** — and C30278 and C43557 each carried the claim **twice**, as reported), plus
**C43551**, which **this session created and its own census caught**, plus **C43550/C43558/C43559**
deduplicated. **Their build stamps were deliberately NOT refreshed** — those cases were not re-observed.

**Three false defects killed by a control**, one of them already written into a case: **C30491's existing
"Known issue" block claimed the Estimates figure was broken at $0.00 — it reads $0.00 only on the default
This Week range, and equals the tab total to the cent over twelve months. The block was removed.**

**The Q5 blocked-count in `QUESTIONS-FOR-CHRIS.md` corrected from sixteen to eight.**

## 🔴 THE ARITHMETIC GATE IS NOT CLAIMED AND MUST NOT BE

**Only 35 of the 476 cases carry a verdict established on the build now running.** The suite spans four
markers — **35 on `v3.5-f77875c` · 133 on `v3.5-7168d14` · 223 on `v3.5-16cf83f` · 82 on
`v3.4.1-3d03023` · 3 on none** — and that is stated per case in `REMAINING.txt` rather than averaged.

## Two things needing the QA lead's decision, neither actioned

1. **C30495** was verdicted PASS by an earlier session, but **S6-R3** requires the Totals row's Inv. Hrs
   to carry the same green/red colouring as a row and **it carries none** on any of the four tabs. Outside
   this session's list, so **not re-verdicted**.
2. **[SV-8960](https://shopview.atlassian.net/browse/SV-8960)** (Nebojsa Glavinic) **contradicts S4-R4**:
   it asks for Days Open to be left-aligned and treats Last Activity's left alignment as correct, when the
   specification puts Days Open on the right (where the build already has it) and Last Activity is the one
   genuinely wrong. **His ticket was not touched.** What source he worked from is **not established** —
   his ticket cites none and he could not be asked. **For the QA lead to put to him.**

## Outstanding, in the order it blocks work

1. **A fresh `sv_sso_session` for `.qa.shopview.com`** — blocks **all 89** remaining cases. **QA lead.**
2. **A second sign-in as a non-administrator** — blocks roughly 20 permission cases across six reports.
3. **Chris Ward: 7 unanswered questions**, of which **Q5 (the Location column) holds 8 cases** and is
   probably a five-minute edit to four requirements he has already decided.
4. **The 432-case `refs` version sweep** — still not authorised, still not started.
5. **The branch declared final** — it will not be, so the Rule-49 queue stays open by design (Rule 60).

---

# RESUME - Report Suite VIU, as at 2026-08-06 end of the THIRD session

> **⚠️ THE NUMBERS BELOW THIS BANNER ARE THE SECOND SESSION'S AND ARE SUPERSEDED. The third session's
> state is in this banner. Read `FINDINGS-SESSION3.md`, `testrail-execution-log-session3.md`,
> `FILED-SESSION3.md`, `CHANGES-MADE-SESSION3.md` and section F of `RECHECK-QUEUE.md`.**

## THE STATE NOW, re-derived from live at the end of the session

| | Count |
|---|---|
| Live under group 4281 | **481** |
| **Ours** | **476** (foreign: C38919-C38923, Vladimir Tomovic - hands off) |
| **Carrying a 6 August verdict** | **352** |
| **STILL OUTSTANDING - no 6 August verdict** | **124** |

**352 + 124 = 476.** The gap was **188** when this session started, so **64 were closed**, all of them
Sales By Representative. **Count by case id, never by line:**
`grep -oE 'C[0-9]{5}' REMAINING.txt | sort -u | wc -l`.

## THE EXACT NEXT ACTION

`REMAINING.txt` **section A** is the work list, **124 cases**, regenerated from live at the end of this
session:

| Report | Outstanding |
|---|---|
| **Work In Progress** | **45** |
| **Sales By Representative** | **45** |
| Parts Velocity | 17 |
| Sales By Customer | 14 |
| Technician Utilization | 2 |
| Inventory Value | 1 |

**Start with Work In Progress** - the second session already established its endpoints and its date
parameters (`from=`/`to=` with full ISO instants plus `tab=`, unlike the other five reports), so it is the
cheapest block to finish. **Then the 45 Sales By Representative that remain**: this session drove the
report but did **not** reach Story 13 (staff deactivation, 8 cases), Story 19 (the work-order Sales Rep
selector, 6 cases), the Inv. Hrs calculations (8 cases - every hours figure on this estate is 0.0, so they
need a work order with known billed labour hours **and** known clocked hours), the remaining Story 15
assignments rows, dark mode, and the permission cases.

## What this session did

**64 `update_case`, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral changes.**
All three text fields on every payload. **0 add - 0 delete - 0 section - 0 run writes - 0 results logged.**
Markers written: **48 `READY` + 15 `READY - EXPECT FAIL` + 1 `HOLD` = 64.** Read back live: exactly one
provenance line, one build sentence naming `v3.5-7168d14`, one marker, marker last, on all 64; 0 raw markup.

**Run 359 PROVEN UNTOUCHED** - `include_all` still false, 476 tests, sets equal both directions, **all 535
results present BY ID, 0 new, 0 graded-field changes**; the only movement is `case_title` on 2 records,
both on **C30102**, which is the SECOND session's authorised retitle and **not in this session's write set**.

**12 Story Defects filed, SV-8972 to SV-8983**, all at the new **priority Medium**, 11 field checks each,
**132 of 132 PASS**. One further finding was **dropped as a duplicate of SV-8925** by the duplicate search.

**The build did NOT move during this session** - `v3.5-7168d14` read byte-identical at 09:54:19Z,
10:31:45Z and 10:35:43Z. The single move today (`v3.5-16cf83f` to `v3.5-7168d14` at 08:32:37Z) happened
during the SECOND session and was handled there.

**Sources re-read at write start per Rule 59: unchanged** - SBC 15, SBR 17, PV 5, TU 6, WIP 9, IV 4.

## Outstanding, in the order it blocks work

1. **A second test login as a non-administrator.** Still the branch refusing, not us - both routes 403.
   Blocks roughly 20 permission cases across all six reports.
2. **Chris Ward: Q7** (`QUESTIONS-FOR-CHRIS.md`) - A4 portrait or landscape for the Sales By
   Representative PDFs. The two specifications contradict each other.
3. **A run that can drive the calendar past a 366-day span**, for C30202 and the sister case C30104.
4. **A work order with known billed labour hours and known clocked hours**, invoiced under a
   representative - without it the 8 Inv. Hrs calculation cases cannot be checked at all, because every
   hours figure on this estate is 0.0.
5. **The 432-case `refs` version sweep** - NOT started, still queued for the QA lead's authorisation.
6. **The branch declared final** - it will not be, so the Rule-49 queue stays open by design.

---

# RESUME — Report Suite VIU, as at 2026-08-06 end of the SECOND session

**Read in this order:** this file → `SOURCE-CURRENCY.md` → `SPEC-DIFF.md` → `FINDINGS-SESSION2.md` →
`RECHECK-QUEUE.md` → `REMAINING.txt`. The first session's handover is kept as `RESUME-session1.md`;
its tooling notes and its Sales-By-Customer groundwork are still good, but **its counts are superseded
by the ones below** and two of its claims are corrected (see §6).

---

## 1 · ⚠️ THE BUILD IN FORCE — AND IT MOVED MID-PASS

| Read at | app-version | index.html last-modified | etag |
|---|---|---|---|
| 2026-08-06 08:24:28Z | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT | `177c59546701e7810b894492dabc1423` |
| **2026-08-06 09:25:03Z** | **`v3.5-7168d14`** | **Thu, 06 Aug 2026 08:32:37 GMT** | `207df1aa07090fcf99e98e67f1d1d6d5` |

**The branch redeployed EIGHT MINUTES into the second session.** Read the marker at the start **and**
at the end of every pass — that is the only reason this was caught, and the 69 cases already stamped
with the older marker were corrected because of it.

**The branch is not declared final and will not be before release.** Every verdict is **PROVISIONAL**
and the Rule-49 queue in this folder is **OPEN** — which under Rule 60 is this project's normal steady
state, not a failure.

## 2 · Sources — all CURRENT, verified three times

SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4**. **None moved** at 08:24Z, 08:58Z
or 09:25Z. Epic **SV-8582 = 105 children**, verified two ways, key sets equal.

**Chris Ward's three channel updates are ingested and, for the first time, TESTED.** Two of the three
fail on the build: **SV-8967** (the WO # link) and **SV-8968** (the WIP filters). See `SPEC-DIFF.md`.

## 3 · THE NUMBERS — re-derive them, never copy them forward

| | Count |
|---|---|
| Live under group 4281 | **481** |
| **Ours** | **476** |
| Foreign (Vladimir Tomovic, C38919–C38923) | **5** — hands off, Rule 38 |
| Carrying a verdict on the build now running (`v3.5-7168d14`) | **69** |
| Verdicted today by the first session, on the superseded `v3.5-16cf83f` | **219** |
| **No 6 August verdict at all — THE REAL OUTSTANDING WORK** | **188** |

**69 + 219 + 188 = 476.** How to re-derive, from live:
`python3 tools/census.py` (markers, provenance, raw markup, untouched proof, run 359).

**Markers, live: 357 `READY` + 77 `READY - EXPECT FAIL` + 42 `HOLD` = 476, exactly one each.**
**Gate: 357 + 77 = 434 = 476 − 42. PASSES. Ready to automate = 434 of 476.**

## 4 · THE EXACT NEXT ACTION

**1. Sales By Representative. 109 cases. Never opened.** It is the whole of the gap and nothing blocks
it. `REMAINING.txt` **section A** lists them by section.

**2. The second test login — 17 permission cases. ATTEMPTED, AND BOTH SELF-SERVICE ROUTES ARE CLOSED
ON THIS BRANCH. Read `SECOND-LOGIN-ATTEMPT.md` before trying again.** `POST /api/switch-user` returns
**HTTP 403 "Access denied."** to the administrator against a real, active, confirmed Technician; and
`POST /api/quick-login {"key":"tech"}` returns **HTTP 403 "Access denied."** — only `admin` works here.
**The failed attempt also killed the session (409 "Session has expired."), recovered by calling
`quick-login {"key":"admin"}` and swapping ONLY the returned `PHPSESSID` into the existing cookie
header.** So this needs the QA lead or a developer: a second set of cookies for a non-admin user, or the
`tech` key enabled on `sv8582`, or `switch-user` granted. **Do not spend another session re-discovering
this.**

**3. The remaining 42 Work In Progress cases** — `REMAINING.txt` section A, WIP rows.

**Do NOT start by re-driving section B.** Those 219 were verdicted today; a redeploy does not
invalidate an expectation, only a label or a verdict (Rule 60), and every EXPECT-FAIL among them
carries a Rule-61 block so the automated suite reports a fix or a changed failure by itself.

## 5 · What is already established and can be reused without re-deriving

**Sales By Customer** — finished. Report path `/reports/sales-by-customer`; data endpoint
`GET /api/reporting/reports/sales-by-customer?range=…&productType=all|parts|service&locations=…&pagination[…]`;
`…/customers?…&search=` for the type-ahead; `…/{customerId}/assets?…` and
`…/{customerId}/assets/{assetKey}/invoices?…` for the tree; export at `…/export?variant=summary|expanded&format=csv|pdf`.
- **Presets apply IMMEDIATELY** — no Apply button unless you are building a custom calendar range.
- **Sorting is server-side** (`pagination[sortBy]`, `pagination[descending]`) and the spec agrees
  (S10-R8), unlike Technician Utilization where the spec asked for on-screen.
- **The saved view is one browser key**, `report_view:sales-by-customer`, holding dateRange, locationIds,
  sortBy, descending, columns, productType, customerAll, customerIds. **Reading it settles five cases at
  once.**
- **Money is in cents in the API**; the screen renders dollars.
- **The Parts Sales bucket exists but only shows under `productType=parts`** — `is_parts_sales: true`,
  label literally `Parts Sales`.

**Work In Progress** — the date parameters are **different from the other five reports**: `from=`/`to=`
with full ISO instants, plus `tab=<Tab>`. `…/filters?from=&to=&locations=` returns the scope-wide
advisor, customer and asset lists. `tab_counts` gives all four tab counts in the data response.
Export: `…/work-in-progress/export?format=csv|pdf&tab=…&from=…&to=…` — and **every tab WITH rows
returns HTTP 500** (SV-8907); a tab with 0 rows returns a real file.

**Tooling that works** — `tools/writer.py` (rebuilds an expected-results field, sends all three text
fields, byte-verifies; **refuses on a raw-markup case, keep that guard**), `tools/unmarkup.py`
(HTML→plain numbered text, preserves the build line), `tools/census.py`, `tools/reqx.py` (pulls every
`Sn-Rn` anchor out of a live spec body), `/tmp/rs-viu/boot.mjs`, `/tmp/rs2/lib.mjs`, `/tmp/testrail/tr.py`,
`/tmp/conf_fetch.py`, `/tmp/jql.py`, `/tmp/rs3/jira/tu_tickets.py` (`create()` + `verify()`).

## 6 · TWO CORRECTIONS TO THE FIRST SESSION'S RECORD — read before quoting it

**(a) The export row cap IS documented in three of the six specifications.** `FINDINGS.md` and
`FILED.md` say none of them mentions it. **Wrong**: SBC v15 documents it twice (S14-R16, S15-R25), SBR
v17 once (S14-E2), IV v4 once including the exact message (S10-R12). Only PV, TU and WIP are silent.
Table and consequences in `SPEC-DIFF.md` §8; the narrowed question is Q6 in `QUESTIONS-FOR-CHRIS.md`.

**(b) Report Suite had NO live re-check queue until now.** The first session opened none, so its 219
verdicts were queued nowhere. `RECHECK-QUEUE.md` in this folder now covers both sessions.

## 7 · Write ledger

**This session:** TestRail **156 `update_case` over 82 distinct cases**, every one HTTP 200 +
byte-verified, 30 fields compared each, **0 mismatches, 0 collateral**; **0 add · 0 delete · 0 section ·
0 run writes · 0 results logged**. Jira **9 Story Defects created (SV-8962…SV-8970), 0 edited**, 11 field
checks each, **45 of 45 PASS**. Application **read-only — nothing seeded, nothing impersonated**.

**Cumulative for 6 August (both sessions):** **389 `update_case` over 302 distinct cases**; Jira **38
Story Defects created**, one authorised edit (SV-8937, first session).

## 8 · Outstanding

1. **A second test login** — 17 permission cases. **Authorised, attempted, and BLOCKED on the branch
   itself**: `switch-user` 403s and `quick-login {"key":"tech"}` 403s (`SECOND-LOGIN-ATTEMPT.md`). Needs
   a non-admin cookie set from the QA lead, or a developer enabling one of the two routes.
2. **Chris Ward: six questions** — `QUESTIONS-FOR-CHRIS.md`. Q5 (the Location column) unblocks **16**
   held cases and is probably a five-minute edit, because he has already decided and four requirements
   simply were not tidied up.
3. **432 of 476 cases name a stale spec version in `refs`** — IV v3, PV v4, SBC v13, SBR v15, TU v5,
   WIP v6. Rule 42 depends on that pin. Needs an authorised metadata sweep.
4. **Two tester-facing provenance lines carry a wrong spec version** — one PV case with none, one SBC
   case reading v9 against live v15. Two writes.
5. **Three factual improvements owed to already-filed tickets** — SV-8956's real cause, SV-8937's
   PDF-only mechanism and its scope. Deliberately not edited: the QA lead is retrofitting in one pass.
6. **The branch declared final** — it will not be, so the queue stays open by design.
