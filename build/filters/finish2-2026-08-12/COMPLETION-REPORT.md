# FILTERS — COMPLETION REPORT (Standing Rule 67)

**Every figure below was derived LIVE from TestRail and the build, not carried from a document.**
**Read at 2026-08-12 12:44–12:50 UTC.** Build **`v3.6-3e9dd6d`** (`index.html` sha256
`fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb`, etag
`b1b2623f07bec03883f57a0e17204431`) — **byte-identical at the start and end of the session.**

---

## THE TABLE

| # | Measure | Figure | Read at |
|---|---|---|---|
| 1 | **Total cases** | **ours 115 / live 120** (5 foreign, author user 7 — C43576–C43580) | 12:44Z |
| 2 | **Source-verified** | **115 of 115** — every case carries a provenance sentence, a **per-source read date**, a **Confluence v19** pin and a non-empty `refs` | 12:50Z |
| 3a | **Build-verified — naming the build now running (`v3.6-3e9dd6d`)** | **22 of 115** | 12:44Z |
| 3b | **Build-verified — naming an EARLIER build (`v3.4.2-d00239b`, 5 August)** | **83 of 115** | 12:44Z |
| 3c | **Carrying no build line at all** | **10 of 115** — correct: they say in their own text they have not been checked against a build | 12:44Z |
| 4 | **Steps and preconditions ACTUALLY WALKED on this build** | **22 of 115** — union by case id across every Filters pass (**12 this pass**, 10 previously) | this pass |
| 5 | **Runnable vs held** | **97 runnable · 18 held** | 12:44Z |
| 5a | *gate, first way* | `READY` **90** + `READY - EXPECT FAIL` **7** = **97** | 12:44Z |
| 5b | *gate, second way* | 115 − `HOLD` **18** = **97** ✅ **closes both ways** | 12:44Z |
| 6 | **Created / Updated / Deleted** | **0 / 10 / 0** | this pass |
| 7 | **What is left** | itemised below | — |

**Rows 3a + 3b + 3c = 22 + 83 + 10 = 115.** ✅
**Rows 5a and 5b agree at 97, and 97 + 18 = 115.** ✅

---

## THE TWO NUMBERS IN ROWS 3a AND 4 ARE DIFFERENT ON PURPOSE

**22 cases name the running build** and **22 cases have had every step walked** — and although the
totals coincide, **they are not the same 22 and they do not mean the same thing.**

- **Row 3a** counts cases whose *provenance line* names `v3.6-3e9dd6d`. Two of them (C29622, C38895)
  were stamped by an earlier pass; ten were stamped by this one; ten more were stamped previously.
- **Row 4** counts cases where **a person drove every step** — precondition reachable, navigation
  path present, every named control where the step says it is, steps working in the written order,
  labels matching what is on screen.

**Row 4 is the number that answers "can a tester pick this up tomorrow and run it?"** and it is the
one to quote if only one is quoted.

---

## HOW THIS SITS AGAINST WHAT THE TESTER HAS ALREADY DONE

**Run 352, read live at 12:44Z: 75 Passed · 8 Failed · 1 Blocked · 36 Untested** of 120 tests.

**The tester is nearly finished, and that changes what "not yet walked" means.** A case he has
already **Passed** was, by definition, runnable for him — his pass is direct empirical evidence of
runnability, stronger in its way than a harness check. So the 93 cases we have not walked are **not
93 unknowns**: most have been executed successfully by a human today.

**What our 22 add on top of that** is the thing his pass cannot give: for the cases he **failed**, an
independent check of whether the *case* or the *build* is at fault.

---

## WHAT IS LEFT — ITEMISED, WITH WHAT EACH IS WAITING ON

| # | Item | Cases | Waiting on |
|---|---|---|---|
| 1 | **A ruling on C29603 / SV-8905** — the case **passes as written**; the tester failed it for behaviour on Parts/Reports pages that this case never asserts, and **no case covers that ground** | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | **The QA lead.** Either the result moves, the ticket's evidence is re-pointed, or a new case is authored |
| 2 | **A defect ticket for C38897** — the empty state offers no separate way to clear the search, against spec v19 `S8-R4`/`S8-R5`. Written up, evidence complete, **never filed** | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | **The creation hold at Standing Rule 62's tail.** Verbatim: *"Do not create anything until my next order."* It was reasonable — a ticket cannot be cleanly withdrawn — and one order lifts it |
| 3 | **Two cases need a staff record deactivated** | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581), [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | **A tester.** Barred for us: such an edit destroys the session of every holder, which is how a sibling project lost its technician login today |
| 4 | **Two checks that failed as checks and prove nothing** | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876), [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | **A targeted re-run.** Neither status pick registered; the guard reported `check_could_fail: false`. Recorded as failed checks, not as passes |
| 5 | **Three part-walked cases** | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) (steps 3–6), [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) (steps 1, 2, 4), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) (steps 6–7) | **Time**, plus a real browser close and a second computer for C29614 |
| 6 | **The 42-surface pass on C38891** — two names known wrong (`IBS Batch Transactions` → **IBS Batches**, `Sales Tax Invoices` → **Sales Tax Collected**) | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | **One pass over all 42 surfaces at once**, not two spot fixes. The tester marked it **Blocked** today, correctly |
| 7 | **10 held cases on Parts and Reports** | various `HOLD` | **Branko's Parts/Reports write-up**, outstanding since 27 July |
| 8 | **93 cases not walked by us** | — | **Time.** Most have been executed by the tester already; see the section above |
| 9 | **A playbook note** — the `filter_option_` selector, and the four traps this pass paid for | — | **`build/APP-ACTIONS-PLAYBOOK.md` §J.** Not edited from this worker; flagged |

---

## WHAT THIS SUITE MAY HONESTLY BE CALLED

> **Source-verified and build-accurate in its preconditions, steps, navigation and labels for the
> 22 cases walked — with the behaviour verdict belonging to the tester.**

**It may NOT be called "VIU complete."** The behaviour half has belonged to the manual tester since
the QA lead's ruling of 11 August, and 93 of the 115 have not had their steps walked by us.

**In one line for a stranger:** every case says what the documents require and cites them with a
date; 22 have been proven runnable on the build that ships; the tester has already executed 84 of
them himself; and the one case that most needs attention is C29603, which passes as written while
being marked failed.

---

## SOURCE CURRENCY

| Source | Identifier | Version / date | Checked | Verdict |
|---|---|---|---|---|
| Build | `sv8785.qa.shopview.com` | `v3.6-3e9dd6d`, last-mod 11 Aug 07:45:44 GMT | 12:07Z and 12:44Z, sha256 identical | **CURRENT** |
| TestRail | group 4110 | 120 cases / 115 ours | 12:44Z | **CURRENT** |
| Run 352 | — | 120 tests, 639 results | 12:44Z | **CURRENT** |
| Filters spec | Confluence page, v19 published 6 Aug 2026 | read **11 August** by the previous pass | **not re-fetched this pass** | **PARTIAL — inherited, stated rather than assumed** |
| Epic SV-8785 | — | — | **not re-fetched this pass** | **PARTIAL — inherited** |

**The two PARTIAL rows are named rather than glossed.** This pass was chartered on runnability
against the build; no case's expected behaviour was changed, so no source ruling was relied on that
the previous pass had not already established.
