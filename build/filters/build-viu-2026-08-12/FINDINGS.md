# Filters — what a manual tester can actually run tomorrow

**Build `v3.6-3e9dd6d`. Source: TestRail read live 2026-08-12. Nothing here was observed on the build — see `BUILD-VERIFICATION.md`.**

## 1. The number that matters

Run 352 holds **115 tests**, of which **43 are Untested**. Those 43 are not equal work:

| | cases |
|---|---|
| Untested and **genuinely runnable** | **28** |
| Untested but **held** — cannot be honestly run | **15** |
| **Untested total** | **43** |

**So the real morning workload is ~28 cases, not 43.** The other 15 will consume tester time and produce results that do not mean what they appear to mean.

### The 28 runnable ones

[C29581](https://shopview.testrail.io/index.php?/cases/view/29581), [C29588](https://shopview.testrail.io/index.php?/cases/view/29588), [C29618](https://shopview.testrail.io/index.php?/cases/view/29618), [C29619](https://shopview.testrail.io/index.php?/cases/view/29619), [C29620](https://shopview.testrail.io/index.php?/cases/view/29620), [C29633](https://shopview.testrail.io/index.php?/cases/view/29633), [C29634](https://shopview.testrail.io/index.php?/cases/view/29634), [C38876](https://shopview.testrail.io/index.php?/cases/view/38876), [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C38878](https://shopview.testrail.io/index.php?/cases/view/38878), [C38879](https://shopview.testrail.io/index.php?/cases/view/38879), [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), [C38884](https://shopview.testrail.io/index.php?/cases/view/38884), [C38886](https://shopview.testrail.io/index.php?/cases/view/38886), [C38888](https://shopview.testrail.io/index.php?/cases/view/38888), [C38889](https://shopview.testrail.io/index.php?/cases/view/38889), [C38893](https://shopview.testrail.io/index.php?/cases/view/38893), [C38896](https://shopview.testrail.io/index.php?/cases/view/38896), [C38897](https://shopview.testrail.io/index.php?/cases/view/38897), [C38898](https://shopview.testrail.io/index.php?/cases/view/38898), [C38899](https://shopview.testrail.io/index.php?/cases/view/38899), [C38900](https://shopview.testrail.io/index.php?/cases/view/38900), [C38902](https://shopview.testrail.io/index.php?/cases/view/38902), [C38903](https://shopview.testrail.io/index.php?/cases/view/38903), [C43560](https://shopview.testrail.io/index.php?/cases/view/43560), [C43561](https://shopview.testrail.io/index.php?/cases/view/43561), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563), [C43590](https://shopview.testrail.io/index.php?/cases/view/43590)

### The 15 held ones, and what each is waiting on

| Case | Title | Waiting on |
|---|---|---|
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | held for the QA lead's ruling only - the behaviour IS documented (S10-R4 says each Parts view and each Report  |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the upd | cannot be run - it needs an account whose filters were saved before the redesign, and none exists |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom s | waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states t |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports,  | cannot be run yet - its own precondition needs the page-search rollout finished everywhere, and it is still pa |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | Saved-filters service round-trip: save, reload, and per-us | needs a second test login to prove one person's saved filters do not reach another |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate | only half of it can be run - the report pages have no page search box yet, so the report-tab half cannot be te |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear S | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the n | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change cover | Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons eac |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Trans | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it  |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a ph | the new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet |

---

## 2. 🔴 FIVE HELD CASES ALREADY CARRY A **PASSED** RESULT — and one of them cannot honestly be passed

Cross-tabulating run 352's results against the cases' own `AUTOMATION` markers turns up something
that matters more than any wording fix:

| Case | Title | Its own HOLD reason | Graded |
|---|---|---|---|
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Estimates tab | waiting on Branko's Status-chip ruling | **Passed** 5 Aug 11:27Z |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: Status chip greyed out and pre-filled | waiting on Branko's Status-chip ruling | **Passed** 5 Aug 19:00Z |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: Status chip greyed out and pre-filled | waiting on Branko's Status-chip ruling | **Passed** 5 Aug 19:00Z |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs | waiting on Branko's Status-chip ruling | **Passed** 5 Aug 19:04Z |
| [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | **Saved filters are per user: one user's filters do not appear for another** | **needs a second test login** | **Passed** 6 Aug 09:49Z |

All five were graded by **user 7 (Ahtasham Amjad)**. Every result carries an **empty comment**.

**[C29615](https://shopview.testrail.io/index.php?/cases/view/29615) is the one to look at.** Its
entire assertion is that **one person's saved filters do not reach another person**. That cannot be
observed from a single sign-in — it is the *same* blocker this session was created to clear, and it
has been outstanding since 5 August. So either:

- **he had a second login on 6 August** — in which case the blocker has been solvable for six days
  and everyone including this session has been waiting on something that already existed; or
- **the case was graded without driving the per-user step**, and the suite currently reports coverage
  of per-user isolation that nobody has actually seen.

**Both readings are worth knowing before a release, and neither is ours to settle.** This is another
author's result on our case: **reported, not touched** (Rule 38). Nothing was changed on any of the
five, and no result was written anywhere.

**The wider point for tomorrow, and it is the practical one:** the `AUTOMATION: HOLD` marker is
**not stopping testers from running held cases**. It is labelled *AUTOMATION*, it sits at the very
end of Expected Results, and a manual tester reasonably reads it as somebody else's concern. With
**15 held cases still Untested** in the run, the same thing will happen again tomorrow unless the
testers are told which ones to skip. **Section 1's list is that list.**

---

## 3. The build stamps understate how recently the suite was checked

| What the cases say | cases |
|---|---|
| `Last checked against build v3.4.2-d00239b on 8/5/2026` | **95** |
| `Last checked against build v3.6-3e9dd6d on 8/11/2026` | **8** |
| no build sentence at all | **12** |
| **total** | **115** |

**95 cases name a build from 5 August — a whole minor version behind the `v3.6` that is running.**

**But that is misleading in the cases' favour, not against them.** Yesterday's pass
(`build/filters/build-verify-2026-08-11/`) checked **106 of the 114** cases against
**`v3.6-3e9dd6d`** — the *same* build running now, byte-identical marker — and deliberately wrote to
only the **8** it had to correct. Its own resume says so plainly and lists the re-stamp as
outstanding work item 4.

**So roughly 89 cases were checked against the running build yesterday and their stamps do not say
so.** That is a one-pass fix and it needs the QA lead's go-ahead.

**This session deliberately did NOT re-stamp them.** The brief is explicit — *re-stamp only cases you
actually observed* — and this session observed nothing. Stamping 89 cases on the strength of another
pass's observation would be exactly the kind of second-hand claim Rule 12 exists to stop.

---

## 4. Correcting a number in the brief: the second-sign-in blocker is **8 cases, not 11**

The brief describes *"11 cases blocked on exactly this second sign-in"*. The evidence says 8, and the
8 are named in yesterday's committed ledger:

[C29613](https://shopview.testrail.io/index.php?/cases/view/29613),
[C29614](https://shopview.testrail.io/index.php?/cases/view/29614),
[C29615](https://shopview.testrail.io/index.php?/cases/view/29615),
[C29616](https://shopview.testrail.io/index.php?/cases/view/29616),
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880),
[C38881](https://shopview.testrail.io/index.php?/cases/view/38881),
[C38895](https://shopview.testrail.io/index.php?/cases/view/38895),
[C43560](https://shopview.testrail.io/index.php?/cases/view/43560)

— seven Persistence cases plus C38895.

**And only 2 of the 115 carry a marker that actually names a second login** as the blocker: C29615
and C38895. The other six were simply not driven, for a mix of reasons; their markers read `READY`,
`READY - EXPECT FAIL (SV-8832)` and two unrelated `HOLD`s.

**Worth separating, because it changes what a second login buys:** a second sign-in unblocks the
*build-check* of 8 cases, but it only clears the *stated blocker* on 2. C38880 is waiting on the QA
lead's ruling and C38881 on an account that does not exist — **neither is fixed by a login.**

---

## 5. Structural audit of all 115 — clean on every check

No sampling; every case, every field.

| Check | Result |
|---|---|
| raw HTML markup shown literally to the tester | **0 of 115** |
| cases with no `AUTOMATION` marker | **0** |
| cases with more than one marker | **0** |
| marker not in one of the three legal forms | **0** |
| marker not the last line of Expected Results | **0** |
| Rule-54 provenance line missing | **0** |
| Rule-54 provenance line duplicated | **0** |
| `READY - EXPECT FAIL` case missing its Rule-61 symptom block | **0 of 7** |
| dead `blob/main` GitHub links | **0** |
| titles over 80 characters | **0** |
| empty Preconditions, Steps or Expected | **0** |
| `refs` comma-entry over the 248-character limit | **0** |

**The arithmetic gate passes both ways: 88 `READY` + 7 `READY - EXPECT FAIL` = 95, and 115 − 20
`HOLD` = 95.**

**Counts reconcile:** ours **115** / live total **120** under group 4110, the difference being the
five foreign cases C43576–C43580 authored by user 7. Run 352 holds **115** tests and the case-id sets
are **equal in both directions**, so the run is already in sync — `update_run` was neither needed nor
called.
