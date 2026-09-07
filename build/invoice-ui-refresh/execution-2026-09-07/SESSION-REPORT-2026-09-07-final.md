# Invoice Refresh — test execution and defects: FINAL REPORT
**Date:** 7 September 2026 · **Environment:** staging (`app.staging.shopview.com` + `staging.portal.shopview.com`) · **Build:** `v26.35.9-9812433`
**Suite:** Invoice Refresh (Aug 2026), TestRail group **6559**, **120 cases — all executed.**
**Results are held LOCALLY.** Nothing was written to TestRail run R417.

| Verdict | Cases |
|---|---|
| **Passed** | **110** |
| **Failed** | **6** — every one has a ticket |
| **Blocked** | **4** — three have a ticket, the fourth cannot have one |
| **Total** | **120** |

---

## 1 · DONE

| What | Detail |
|---|---|
| **All 120 cases executed** with real verdicts against real documents | C44884–C45275, every id in `RESULTS.json` |
| **The customer portal was reached** and the last three blocked cases run | **C44951 Passed · C45175 Passed · C44952 Failed** (one clause). Route, method and evidence: `PORTAL-BANNER-VERIFICATION-2026-09-07.md` |
| **Every failure carries a ticket** | C44935→SV-9773 · C44926→SV-9680 · C44974→SV-9761 · C44970→SV-9790 · C44917→SV-9642 · **C44952→SV-9797 (new)** |
| **Every remaining blocker carries a ticket** | C44902→**SV-9799 (new)** · C44907→**SV-9800 (new)** · C44916→SV-9710 (existing, commented) |
| **One incidental defect raised** | **SV-9802 (new)** — the asset Invoices tab prints `undefined%` in Tax Rate |
| **Three cases made properly runnable** | C44951, C44952, C45175 now carry the portal route step by step; `check_runnable_cases.py` returns 3/3 runnable, and all three render `markdown fr-view` with no literal tags |
| **One case-text error corrected** | C44952 clause 5 said `"Payment X of Y - Batch"`; spec v45 and v57 both write `"Payment X of Y · Batch"` and the build renders the middle dot. The case was wrong, not the build |
| **Learnings recorded** | L29 (how to reach the portal) · L30 (a rule that restates production is a spec correction) · L31 (`created_by 6` is in scope) · L32 (edit `fr-view` cases through the UI, never the API). Playbook gains a Customer Portal section |

## 2 · LEFT — and how a different session would finish each

| Item | How to finish it, concretely |
|---|---|
| **C45275** cannot be run | It is Vladimir Tomovic's (`created_by 1`) and its Steps and Expected Results are both empty in TestRail. Nobody but its author can fix it. Ask him to supply steps, or ask the QA lead whether to retire it |
| **Three spec rules have no case at all** — G-R2 (PDF filename, added 2026-09-04), S3-R10 and G-R4 (both added 2026-09-07) | Authoring work, not execution. Open `spec-body-confluence-LIVE-2026-09-07b-v57.md`, read those three rules, and add cases in the matching sections of group 6559 following `build/skills/01-CASE-BUILD.md`. G-R4 was in fact verified live this pass and passes, so its case would be written as already-verified |
| **All 120 cases still cite specification version 45**; the live page is **v57** | Re-stamp the provenance line on every case once the four v57 changes are ingested. `SPEC-CHANGES-2026-09-07-v57.md` lists exactly what moved |
| **The imported work order's `undefined, undefined, undefined`** is unticketed | Import one historical invoice through Administration → Invoices (Download Template → fill one row → Select CSV File → Import Invoices), find where the imported record opens in the UI, confirm the shop address still prints as `undefined`, then file it. Screenshot from this pass: `evidence-incidental/imported-wo.png` |
| **Results are not in TestRail** | By standing instruction. If the QA lead wants them in run R417 he must say so per case — only Passed results may go into a shared run, and only with his explicit permission |

## 3 · BLOCKED

| Blocker | What it blocks | What it does NOT block |
|---|---|---|
| **No way to remove a shop logo** (SV-9799) | C44902 clause 2 only | Nothing else. C44902 clause 1 is verified, and every other masthead case passed |
| **All five masthead identity fields are mandatory** (SV-9800) | C44907 clause 1 only | Nothing else. C44907 clause 2 is verified on every document produced |
| **IBS is not connected on staging and no location is mapped** (SV-9710) | C44916 only | Nothing else. Every other Order Reference case passed, including the Authorizer, PO and WO-number rules |
| **C45275 has no steps and no expected results, and is another author's** | C45275 only | Nothing else |

## 4 · HOW TO UNBLOCK

| Blocker | The unblock, in one action |
|---|---|
| SV-9799 | Either add a **Remove logo** control, or name a staging account that has never had a logo uploaded — new accounts start without one, so this needs no code |
| SV-9800 | Decide whether those five fields are meant to be optional. If they are not, S1-N1's hide rule describes an impossible state and C44907 can be retired |
| SV-9710 | Put IBS credentials on a QA-facing environment and map at least one shop location to an IBS Location ID, then take one work order through IBS authorisation |
| C45275 | Its author supplies steps and expected results — or the QA lead rules it retired |

## 5 · HANDOFF-READY

| Gate | State |
|---|---|
| Every case has a verdict | **YES** — 120 of 120 |
| Every failure has a ticket | **YES** — 6 of 6 |
| Every blocker has a ticket or a stated reason it cannot have one | **YES** — 3 tickets, plus C45275 which is another author's empty case |
| Every case a tester will run is runnable from the UI | **YES** — `check_runnable_cases.py` passes on the three cases touched today; the suite's earlier runnability pass is unchanged |
| Every case touched renders correctly in TestRail | **YES** — C44951, C44952 and C45175 re-read live: `markdown fr-view`, zero literal tags, `AUTOMATION:` marker last |
| Tester pack regenerated | **YES** — `TESTER-BRIEF-…md`, `FINDINGS.md`, `Invoice-UI-Refresh_Execution-Results_2026-09-07.xlsx` |
| Committed and pushed | **YES** — branch `claude/slack-session-0sxnd9` |
| **Ready to hand to a manual tester** | **YES** |

---

## Tickets created today

| Ticket | Type | What it says |
|---|---|---|
| **[SV-9797](https://shopview.atlassian.net/browse/SV-9797)** | Task | The paid banner's "Remaining Balance" row (S8-R9) has never existed in production. Raised as a **spec correction**, not a build defect — production serves the byte-identical portal chunk, and the spec's own rule says a non-net-new rule that disagrees with production is amended to describe production |
| **[SV-9799](https://shopview.atlassian.net/browse/SV-9799)** | Task | A shop logo can be added or replaced but never removed, so the "no logo" masthead rule cannot be tested by anyone |
| **[SV-9800](https://shopview.atlassian.net/browse/SV-9800)** | Task | All five masthead identity fields are mandatory, so the "hide when empty" rule cannot be tested |
| **[SV-9802](https://shopview.atlassian.net/browse/SV-9802)** | Bug | The asset Invoices tab prints the word `undefined%` in the Tax Rate column on every row |

**A comment was added to [SV-9710](https://shopview.atlassian.net/browse/SV-9710)** recording that it reproduces on staging, where IBS is not connected at all.

**Nothing was filed for the two observations that could not be given verified UI steps** — the imported work order's `undefined, undefined, undefined`, and the shop-supplies percentage label when the cap binds. Both are written up in `FINDINGS.md`.

---

## Test data created on staging today

All dummy, all on the shared staging organisation, none removed (nothing here needs undoing, but it is listed so nobody is surprised):

* Invoices **S-32220** (from work order S2-32220), **S-32221** (S2-32221) and **S-32052** (S2-32052, Aberdeen Diesel Services LLC).
* Portal card payments through Stripe's **sandbox** on S-32263 ($100.00 then $306.09), S-32220 ($50.00), S-32052 ($5.00), plus two batch payments — S-32264 with S-32221, and S-32220 with S-32136.
* One shop-recorded CASH payment of $5.00 on S-32052, reference `ZZAUTOTEST-SHOP`.
* Work order **S-32136** still carries its `ZZAUTOTEST Line Fee` of $25.00 — the live reproduction for **SV-9773**. It is now paid, which does not affect that reproduction. Say the word and it comes off.
