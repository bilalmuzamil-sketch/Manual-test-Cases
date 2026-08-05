# Filters — is it ready for automation? (5 August 2026)

> ## ➕ ADDENDUM — 5 August, 17:22 UTC: all 110 provenance lines re-stamped. FIGURES UNCHANGED.
>
> **The ready-to-automate figure is still 100 of 110 and no verdict or marker moved.** The QA lead
> ruled that a provenance line may never present an expectation as *"as per the build tested on
> <date>"* — the build can be wrong, so crediting it confuses the tester and invites leadership to
> conclude our expectations are reverse-engineered from whatever shipped.
>
> **86 of the 110 lines carried that barred phrasing** (and 4 more named the build as corroboration
> inside their trailing note). All 110 now carry the Rule-54 two-sentence form: **sentence 1 names
> only documents** — epic SV-8785 and the Filters specification at Confluence version 18 with the
> requirement anchor — and **sentence 2 names the build only as what the case was last checked
> against**: *"Last checked on 8/5/2026 against build ShopView v3.4.2-d00239b on the Filters QA
> branch."*
>
> **The word "passed" was deliberately not written.** He permits it, but only **29 of the 110** were
> driven live today (the other 81 carry forward from the 04:20–04:53Z re-check on the **same build
> marker**), and the branch is not declared final — so *"last checked against"* is the most this
> pass can stand behind.
>
> **110 × `update_case`, every one HTTP 200 + byte-verified, 28 fields each, 0 mismatches.** Markers
> read back live: **READY 82 + EXPECT FAIL 18 + HOLD 10 = 110, gate 82+18 = 100** ✓. Run 352 proven
> undamaged — all **443** prior results present by ID with **0** field changes; the **1** new record
> is Ahtasham's own (user 7, 17:21:04Z, Passed).
>
> **⚠️ STILL WRONG AND NOT FIXED: all 110 `refs` values still pin `[spec v1.6 2026-07-28]`** — the
> in-body trap number, eight Confluence versions stale. The tester-facing line now says version 18
> while the metadata still says 1.6, so the two halves of each case disagree about which
> specification it was written against, and Rule 42's version-pin mechanism cannot fire. **Needs one
> authorised pass over the `refs` field.** Detail: `provenance-restamp-2026-08-05/FINDINGS.md`.
>
> ## ⚠️ SUPERSEDED LATER THE SAME DAY — 5 August, 14:25 UTC. READ THIS BANNER FIRST.
>
> **A fresh QA sign-in arrived, the eight phone cases were finally observed on the running app, and the
> QA lead found a fault of principle in five other cases. Both change this report's figures.**
>
> **THE READY-TO-AUTOMATE FIGURE IS NOW 100 OF 110** — not 93, and not the 101 predicted below.
> It is 100 rather than 101 because the eight phone cases came off HOLD (+8) **and one case correctly
> went ON to HOLD (−1)**: FLT-RPTS-23 [C38882](https://shopview.testrail.io/index.php?/cases/view/38882)
> tests a report date filter that is not in the product beyond the first report tab.
>
> Live marker count, read back from TestRail after the writes:
> **`AUTOMATION: READY` 82 + `READY - EXPECT FAIL` 18 + `HOLD` 10 = 110.** The arithmetic gate holds.
>
> **THE PHONE QUESTION IS ANSWERED AND OBSERVED.** At a 390 × 844 viewport on build `v3.4.2-d00239b`:
> the **combined "All Filters" sheet defers correctly** (ticking two statuses fired **zero** list
> requests and left the address bar untouched; pressing the button then applied both), but a **single
> filter's own sheet applies the moment you tap and has no button at all**. **The button's exact
> on-screen label is `Apply Filters` — with a capital F** (`data-test-id="apply_filters"`), while the
> specification writes *"Apply filters"*. The tester reads the screen, so the cases follow the build on
> the label and the specification on the behaviour.
>
> **FIVE CASES WERE TELLING TESTERS TO IGNORE A REAL SPEC VIOLATION, AND THAT IS NOW FIXED.** The QA
> lead read [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) and found it had been
> rewritten to describe the build instead of the specification. An audit of **all 110** found **5 such
> cases** (C29557, C29602, C29606, C29607, C38899), plus **1 over-specified** case and **0** where the
> specification is silent. All six are repaired. Full evidence:
> `../expected-behaviour-audit-2026-08-05.md`.
>
> **THREE CLOSED TICKETS STILL REPRODUCE ON THIS BUILD** — SV-8843 (the filter bar sits beside the tabs,
> measured: tabs y81–121, bar y86–116, side by side), SV-8847 (the empty-state message never mentions
> the search and there is no way to clear the query), and SV-8845 (**on a phone every filter link is
> ignored and `estimate` is sent instead** — proven on declined, paid and imported, while the same link
> works correctly on desktop). None was reopened; that is the QA lead's decision.
>
> **What is corrected in the body below:**
> - the ready figure **93 → 100**, and the predicted 101 **→ 100**
> - the eight phone cases are **no longer HOLD**; six are READY and two are READY - EXPECT FAIL (SV-8875)
> - point 5 of the previous banner says SV-8876 covers *"ground the QA lead has already closed as accepted
>   in SV-8843"*. **That framing was wrong and it is the root of the whole class-A problem: a closed
>   ticket is not an acceptance of a spec violation.** Ahtasham's SV-8876 is a legitimate open question
>   for Branko.
> - all 110 provenance lines now name the specification at **Confluence version 18**, not the in-body
>   *"1.6"* that never moves
>
> **Still true, and not to be dropped from any summary: the branch has NOT been declared final, so every
> verdict remains PROVISIONAL** (Standing Rule 49) and `final-viu-2026-08-05/RECHECK-QUEUE.md` is OPEN.
>
> Detail: `final-viu-2026-08-05/` — read `FINDINGS.md`, then `testrail-execution-log.md`.

> ## ⚠️ UPDATED LATER THE SAME DAY — 5 August, 12:30 UTC
>
> **Two numbers in this report were already out of date when it was written, and the phone question
> below has been ANSWERED.**
>
> **1. The product owner answered the phone question.** Item 1 under *"What is blocked on Branko"*
> says [SV-8825](https://shopview.atlassian.net/browse/SV-8825) is *"still Open, still no comment on
> it"*. **It is closed.** Branko commented at **2026-08-05T05:18:22 −0500** — *"This is updated in the
> filters prd, I'm closing it."* — and closed it Done fifteen seconds later. On a phone, filters apply
> **only when you tap "Apply filters"** (specification §4 Key Decisions and S12-R6, Confluence
> version 18).
>
> **This report was about five and a half hours out of date on that point, not 28 minutes.** It was
> finished around **04:50 UTC**; his comment was **10:18 UTC**. An earlier note put the gap at 28
> minutes by reading a **−0500** timestamp as if it were UTC. Corrected here.
>
> **2. The eight phone cases have been rewritten, but the ready figure has NOT moved.** Their false
> *"waiting on an answer from the product owner"* line is gone, and
> [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) — which asserted the exact opposite
> of the ratified specification — has been reversed. **But no working sign-in exists on the QA branch,
> so nothing was observed on the running app**, and under Standing Rule 12 no case may be marked as
> passing or failing on something nobody has looked at. All eight therefore carry
> **`AUTOMATION: HOLD - needs one live check…`**.
>
> **So the ready-to-automate figure stays at 93 of 110.** It becomes **101** in one short pass as soon
> as fresh QA cookies arrive. What to observe is written out in
> `cleanup-2026-08-05/PENDING-LIVE-CHECK.md`, and each of the eight has a row in
> `cleanup-2026-08-05/RECHECK-QUEUE.md`.
>
> **3. The defect was already raised by someone else.** [SV-8875](https://shopview.atlassian.net/browse/SV-8875)
> (Ahtasham Amjad, 05:50 −0500, Open) reports exactly the phone Apply-button gap. **We filed nothing.**
>
> **4. [SV-8845](https://shopview.atlassian.net/browse/SV-8845) is no longer Open** — the table under
> *"What is blocked on the developers"* says it is. Ahtasham closed it **OBSOLETE / Done** at
> **04:41:58 −0500**, after this report was written. Two of our cases still describe it as an open
> reported problem; that needs a decision.
>
> **5. Three further defects and one clarification were raised today** and are not in this report:
> **SV-8872**, **SV-8875**, **SV-8878** (Story Defects, all Ahtasham) and **SV-8876**, a clarification
> about the filter bar sharing the tab row — which is ground the QA lead has already closed as accepted
> in SV-8843.
>
> Everything else below still stands. Detail: `cleanup-2026-08-05/`.

**What this is.** We have now checked every one of the **110 Filters test cases against the real,
running app** twice: first on 4 August, and again today after the branch was rebuilt overnight.
Every case has a definite answer, and every number below was measured on the build that is
serving right now.

**The build we tested:** ShopView **v3.4.2-d00239b**, read at the start, the middle and the end of
the pass — the same build all three times, so nothing changed under us. *(The 4 August version of
this report described `v3.4.2-4f8211c`, which no longer exists. Every number here has been
re-measured and re-added up; nothing has been carried over.)*

> ## ⚠️ ONE THING TO KEEP IN MIND
>
> **Engineering has not declared this branch final.** Everything below is therefore
> **provisional**: observed live with evidence, but it has to be re-checked when the branch
> settles. The re-check list is written and dated, one row per case, in
> `recheck-2026-08-05/RECHECK-QUEUE.md`.

## What changed since 4 August

**Two problems were fixed, one turned out to be real after all, and we found one new one.**

| | |
|---|---|
| **Fixed** | The filter dropdown no longer closes when you tick one value, so you can pick several without reopening it (12 cases now pass). And text typed in the page search is no longer remembered forever (3 cases now pass). |
| **Still there, and accepted** | The filter buttons still share the tab row, and the "nothing found" screen still only offers Clear Filters. Both tickets were closed by the QA lead, so these 5 cases now say "known and accepted — do not raise this again". |
| **We were wrong** | One case we had passed — a deleted customer being ignored — actually fails. The tester who marked it Failed was right. |
| **New problem** | A saved Customer, Lead Technician or Service Advisor filter comes back without its name on the button. Raised as [SV-8871](https://shopview.atlassian.net/browse/SV-8871). |
| **Specification moved** | The date filter rule was reversed by the product owner on 4 August, and the build already matched the new wording, so one Reports case was rewritten — and it now passes. |
| **Ready-figure rule now written out in full** | The rule behind the figure is now spelled out in the same words every readiness report uses, and the **8 not-built cases it leaves out are named individually** with their case numbers so the automation engineer can pick them up when those features land. The Schedule report was counting its not-built cases as ready and has been corrected to match. |
| **The ready figure has gone UP, from 89 to 93** | **No test result changed and no case changed its outcome — only the rule did.** This report used to take out 4 cases because they were flagged as needing the browser's inspector. Each of the 4 was then read again, one by one, and **not one of them needs anything an automated test cannot do for itself** — three of them need no tool at all, and the fourth checks sizes and colours, which a script reads far more easily than a person can. **Taking them out was under-counting the work the automation engineer can start on.** The full reasoning, and what each of the 4 actually asks for, is set out under the table. |

**Cases whose answer changed: 19 of 110. The other 91 came out exactly the same.**

## The one table

**How to read each column** — every column counts TEST CASES. The **first five outcome columns add
up to the "Test cases" figure on every single row, and on the total.** Nothing is hidden and nothing
needs adding up in your head.

- **Work correctly** — the product does what the case says. The case passes. Nothing to do.
- **Product is wrong — the case correctly fails** — **the case is right and the PRODUCT is wrong.**
  These cases are *supposed* to fail on this build. Automation should **expect a red result**, and
  that red is the case doing its job. It does **not** mean the test case is broken. Of these 19:
  **8 have a developer ticket that is open**, **5 are differences the QA lead has closed and
  accepted** (so they will not be fixed, and the case says so), and **6 have no ticket of their
  own** — 4 are the exact-colour-and-font differences we deliberately reported as one design item
  instead of filing, and 2 are a button-label difference already described inside someone else's
  ticket.
- **Waiting on the product owner** — the correct answer could still go either way, so do not
  automate these yet; a decision would change what "pass" means.
- **Not built yet** — the screen or control is not in this build at all, so there is nothing to
  test. A tester marks these **blocked**, not failed. **These are NOT counted as ready to automate**,
  because the feature is not in the product yet, so an automated test for it could only fail. They are
  named individually further down.
- **Held for a second sign-in** — one case needs a second test account to prove one person's saved
  filters do not leak to another. A manual tester with two accounts runs it in a minute. **This is the
  same column the Schedule report calls "could not be set up on this test system"** — the starting
  conditions cannot be created here.
- **Ready to automate** — the automation engineer can start on these today. It is **not** a sum of
  the other columns; it is worked out by the formula written out under the table. Cases that currently
  fail **are** included, on purpose.
- **Also needs the browser's inspector** — the last column is a **flag, not an outcome**, so it is
  deliberately **not** part of the sum — **and, from 5 August, it is not subtracted from the ready
  figure either.** One case is flagged. It checks sizes and colours, which needs the inspector that is
  already built into every browser. A manual tester **can** run it; it is just not a job for a
  non-technical tester. **An automated test does not need the inspector at all** — it reads those values
  directly — so the flag is a note for whoever runs it by hand, not a limit on automation.

| Part of the feature | Test cases | Work correctly | Product is wrong — the case correctly fails | Waiting on the product owner | Not built yet | Held for a second sign-in | **Ready to automate** | Also needs the browser's inspector (flag — not subtracted) |
|---|---|---|---|---|---|---|---|---|
| The filter bar and collapsing it | 8 | 6 | 2 | 0 | 0 | 0 | **8** | 0 |
| The Status filter | 7 | 7 | 0 | 0 | 0 | 0 | **7** | 0 |
| The Customer filter | 9 | 9 | 0 | 0 | 0 | 0 | **9** | 0 |
| The Lead Technician filter | 7 | 7 | 0 | 0 | 0 | 0 | **7** | 0 |
| The Service Advisor filter | 7 | 7 | 0 | 0 | 0 | 0 | **7** | 0 |
| The Asset on Site filter | 7 | 7 | 0 | 0 | 0 | 0 | **7** | 0 |
| Active buttons and Clear Filters | 6 | 6 | 0 | 0 | 0 | 0 | **6** | 0 |
| The "nothing found" screen | 3 | 1 | 2 | 0 | 0 | 0 | **3** | 0 |
| Switching tabs | 6 | 6 | 0 | 0 | 0 | 0 | **6** | 0 |
| Remembering your filters | 6 | 4 | 2 | 0 | 0 | 0 | **6** | 0 |
| Sharing a link with filters in it | 6 | 1 | 5 | 0 | 0 | 0 | **6** | 0 |
| Phone screens | 10 | 0 | 2 | 8 | 0 | 0 | **2** | 0 |

*(Phone-screen row, corrected 12:30 UTC: the 8 are no longer "waiting on the product owner" — he has answered. They are now waiting on **one live look at the app**, which is a different reason for the same answer: they are still **not** counted as ready. The row, and the total of 93, are unchanged.)*
| The search box on the page | 13 | 9 | 4 | 0 | 0 | 0 | **13** | 1 |
| Behind the scenes (the data request) | 6 | 3 | 2 | 0 | 0 | 1 | **5** | 0 |
| Parts pages | 5 | 0 | 0 | 0 | 5 | 0 | **0** | 0 |
| Reports pages | 4 | 1 | 0 | 0 | 3 | 0 | **1** | 0 |
| **TOTAL** | **110** | **74** | **19** | **8** | **8** | **1** | **93** | **1** |

### The arithmetic, checked and stated plainly

**Every one of the 16 rows adds up, and so does the total** — the five outcome columns sum to the
Test cases figure in all 17 places. This is a change from the 4 August version of this table, where
three rows did not add up. The reason they did not is worth stating rather than burying, because it
is the same information, just now shown honestly:

- **Cases used to sit in two columns at once.** On 4 August, FLT-MOB-09, FLT-PSRCH-01, FLT-PSRCH-02
  and FLT-PSRCH-08 were each counted **both** as "product is wrong" **and** as "needs a browser tool".
  They are counted **once**, in "product is wrong", and the browser-tool column is a separate flag that
  is not added in. That is why the last column is not part of the sum. *(The 4 August note about this
  named FLT-MOB-10 as the double-counted phone case; the case actually double-counted was FLT-MOB-09.
  The count of 4 was right, the name was not. Corrected here.)* **Three of those four flags have since
  been removed as simply wrong — the case-by-case table under the formula below shows why — so only one
  case now carries the flag.**
- **1 case used to sit in no column at all.** FLT-API-06 =
  [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) is held for a second sign-in. It
  now has its **own column** instead of falling between the others, so it is counted exactly once like
  everything else.

**How the "Ready to automate" figure is worked out — one formula, written out below in the same words
in every readiness report:**

> **Ready to automate = test cases − waiting on the product owner − could not be set up on this test
> system − not built yet.**
>
> **A case flagged as "needs a tool" is NOT subtracted.** The only tool that is allowed to take a case
> out of this figure is one an automated test genuinely cannot provide — a real physical device such as
> an actual phone or tablet. Needing the browser's own inspector, a forced window size, a theme switch
> or a set-up data state does **not** count, because an automated test does all of those for itself.
> **No case in the Schedule suite and no case in the Filters suite needs a real physical device, so
> nothing at all is subtracted for tools in either report.**

In this report, "could not be set up on this test system" is the column called **"Held for a second
sign-in"** — the same thing under a more specific name. Applying the formula to the whole suite:
**110 − 8 − 1 − 8 = 93.**

Adding the 16 row figures gives the same answer:
**8+7+9+7+7+7+6+3+6+6+6+2+13+5+0+1 = 93.**

**The figure used to be 89, because 4 flagged cases were taken out on top. They no longer are.** Not
one test result changed and no case changed its outcome column — only the rule did. Those 4 were read
again one by one against what each case actually asks the tester to do, and the honest answer is that
**none of them needs anything an automated test cannot do for itself**:

| Case | C-id | Link | What the case actually asks for | Does it stop automation? |
|---|---|---|---|---|
| FLT-MOB-09 | C29629 | https://shopview.testrail.io/index.php?/cases/view/29629 | Its steps are *"Look at the toolbar row … Look for any control that would hide the filter chip row"*, and it expects there to be no such control on a phone. **No measuring, no colours, no sizes.** | **No.** It needs a phone-sized screen, not a phone: an automated test sets the screen size itself, which is exactly how we checked it. **It does not need a real device.** |
| FLT-PSRCH-01 | C38883 | https://shopview.testrail.io/index.php?/cases/view/38883 | Click Search, type, clear it with the round x, click away. It expects the placeholder *"Type to search"*, the list to narrow, and the box to collapse when empty. **Nothing is measured.** | **No.** This is ordinary clicking and typing. It needed no tool in the first place. |
| FLT-PSRCH-02 | C38884 | https://shopview.testrail.io/index.php?/cases/view/38884 | Apply a filter, type a search, then clear each one separately, and check clearing one does not wipe the other. **Nothing is measured.** | **No.** Ordinary clicking and typing. It needed no tool in the first place. |
| FLT-PSRCH-08 | C38898 | https://shopview.testrail.io/index.php?/cases/view/38898 | The one that really is about looks: *"Hovering over it gives it a light grey background"*, and the box *"(the design sets it at 180 pixels wide)"*. To be exact about the grey and the width you open the inspector. | **No — it makes it easier.** A script reads a colour and a width directly and gets the same answer every time; a person has to open the inspector and squint at it. |

**Three of those four flags have been removed altogether**, because those cases never needed a tool:
FLT-MOB-09, FLT-PSRCH-01 and FLT-PSRCH-02. **Only FLT-PSRCH-08 stays flagged**, and its flag is now
plainly a note for the manual tester rather than a reason to leave it out. **No case changed its
outcome column and the total is still 110.**

**Both reports now use the same rule in the same words, so the two figures mean the same thing.**
Schedule's figure stays at **157** — none of its flagged cases needed a real device either, and one of
its three flags was removed for the same reason ours were.

**One honest caveat, so nobody is caught out:** FLT-PSRCH-08 should still be automated **last**. The
build uses different greys, fonts and paddings from the written design, so it is expected to come out
red, and those numbers are likely to change once the design difference is settled. That is a
scheduling note, not a reason to leave it out of the count.

**Why not-built cases are left out.** **The feature is not in the product yet, so an automated test for
it could only fail.** An engineer who wrote these eight would find nothing to test, get eight red
results, and spend time investigating a fault that does not exist. They stay counted as test cases —
they are still in the 110 and still in the "Not built yet" column — they are simply not counted as
automatable. **Pick them up when the features land.**

**The eight cases left out of 93, named in full so they can be picked up later:**

| Case | C-id | Link | What is missing from the product |
|---|---|---|---|
| FLT-PARTS-01 | C38904 | https://shopview.testrail.io/index.php?/cases/view/38904 | The Parts list pages have no filter bar on this build |
| FLT-PARTS-09 | C38905 | https://shopview.testrail.io/index.php?/cases/view/38905 | There is no Part Type filter (Core / Non Core) to open |
| FLT-PARTS-11 | C38906 | https://shopview.testrail.io/index.php?/cases/view/38906 | No Parts filter exists to choose, so nothing can narrow the list |
| FLT-PARTS-12 | C38907 | https://shopview.testrail.io/index.php?/cases/view/38907 | No Parts filter exists, so multiple choices and clearing cannot be tested |
| FLT-PARTS-13 | C38908 | https://shopview.testrail.io/index.php?/cases/view/38908 | There is no new Parts filter bar to compare the old filters against |
| FLT-RPTS-01 | C38909 | https://shopview.testrail.io/index.php?/cases/view/38909 | The report pages do not show the designed filter buttons |
| FLT-RPTS-21 | C38910 | https://shopview.testrail.io/index.php?/cases/view/38910 | No Reports filter exists to choose, so nothing can narrow the results |
| FLT-RPTS-22 | C38911 | https://shopview.testrail.io/index.php?/cases/view/38911 | The new Reports filter types are not on the build yet |

**One of these came back on to the list of automatable cases today:** FLT-RPTS-23 =
[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) was "not built" on 4 August, but the
Reports date filter turned out to be built and working, so it is now a passing, automatable case. That
is why this list has eight cases and not nine.

## What the automation engineer should SKIP, and why

1. **The 8 phone cases** — FLT-MOB-01 = [C29621](https://shopview.testrail.io/index.php?/cases/view/29621),
   FLT-MOB-02 = [C29622](https://shopview.testrail.io/index.php?/cases/view/29622), FLT-MOB-03 =
   [C29623](https://shopview.testrail.io/index.php?/cases/view/29623), FLT-MOB-04 =
   [C29624](https://shopview.testrail.io/index.php?/cases/view/29624), FLT-MOB-05 =
   [C29625](https://shopview.testrail.io/index.php?/cases/view/29625), FLT-MOB-06 =
   [C29626](https://shopview.testrail.io/index.php?/cases/view/29626), FLT-MOB-07 =
   [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) and FLT-MOB-10 =
   [C29630](https://shopview.testrail.io/index.php?/cases/view/29630). The product owner has told us
   two different things about phones on the same day and the question is still open, so automating
   now could lock in the wrong behaviour. Each of these cases says, in the case itself:
   *"DO NOT AUTOMATE YET."*
2. **The 8 Parts and Reports cases, because those features are not built** — FLT-PARTS-01 =
   [C38904](https://shopview.testrail.io/index.php?/cases/view/38904), FLT-PARTS-09 =
   [C38905](https://shopview.testrail.io/index.php?/cases/view/38905), FLT-PARTS-11 =
   [C38906](https://shopview.testrail.io/index.php?/cases/view/38906), FLT-PARTS-12 =
   [C38907](https://shopview.testrail.io/index.php?/cases/view/38907), FLT-PARTS-13 =
   [C38908](https://shopview.testrail.io/index.php?/cases/view/38908), FLT-RPTS-01 =
   [C38909](https://shopview.testrail.io/index.php?/cases/view/38909), FLT-RPTS-21 =
   [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) and FLT-RPTS-22 =
   [C38911](https://shopview.testrail.io/index.php?/cases/view/38911). Those filter bars do not exist
   on the build at all, so an automated test for them could only fail. **They are OUTSIDE the 93** —
   pick them up when the features land. **This is one fewer than on 4 August**, because the Reports
   date filter turned out to be built and working — FLT-RPTS-23 =
   [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) is now a passing, automatable
   case.
3. **Not a skip any more — leave ONE case until last instead.** FLT-PSRCH-08 =
   [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) checks the Search box's greys,
   fonts and widths. **Automate it, but do it LAST**: the build uses different values from the written
   design, so it is expected to come out red and those numbers are likely to move once that difference
   is settled. **It is INSIDE the 93.** The other three cases that used to sit here — FLT-MOB-09 =
   [C29629](https://shopview.testrail.io/index.php?/cases/view/29629), FLT-PSRCH-01 =
   [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) and FLT-PSRCH-02 =
   [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) — **should not be skipped at
   all**: they measure nothing, they need no tool, and they are ordinary clicking and typing (the
   phone one needs a phone-sized screen, which an automated test sets for itself, not a real device).
4. **FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895), step 3** — the
   second-account check. Automate steps 1, 2 and 4 now; step 3 needs a
   second test login to be provided.

**Everything else — 93 cases — is ready to automate today**, five more than the 88 reported on
4 August: one because the Reports date filter turned out to be built, and four because the flagged
cases should never have been taken out. The 19 that currently fail should still be automated: they are
correct, they describe what the app is supposed to do, and each one carries its ticket number or says
plainly that the difference is accepted, so a red result is information rather than noise.

**A manual tester can run every single one of these 110 cases today**, with nothing but a browser —
including the 19 that currently fail and the 8 on pages that are not built yet (each of those tells
the tester to mark it **blocked**, not failed). The only awkward one for a person is **FLT-PSRCH-08 =
[C38898](https://shopview.testrail.io/index.php?/cases/view/38898)**, which asks for exact widths,
colours and font sizes and so wants the browser's inspector open. **That is a note about hand-testing
only — it is no harder for an automated test, it is easier.**

**One thing that makes automation much easier, and it is good news:** the developers have put stable
test handles on every control in this feature — the filter buttons, every option in every dropdown,
Clear Selection and Clear Filters, the search box, the collapse toggle, the phone sheets, and now
every ready-made period in the Reports date picker. An automation engineer will not have to guess at
selectors.

## What is blocked on Branko (the product owner)

1. **Do filters on a phone apply as you tap, or only when you press an Apply button?** On 4 August
   he answered our question sheet saying they apply **as you tap, with no Apply button** — which is
   what the app does. A few hours later, the same day, he added a rule to the written specification
   saying the opposite. We are not choosing between two answers from the same person on the same
   day. Logged as [SV-8825](https://shopview.atlassian.net/browse/SV-8825) — **still Open, still no
   comment on it. It blocks 8 test cases.**
2. **Two small errors in the written specification.** One rule points at the wrong neighbouring rule
   after his renumbering, and one rule contradicts its own example. **No test cases are blocked** —
   we wrote them to the example and to the app. He just needs to tidy the sentences.
3. **His answer of 17 July is out of date** about the Status button on the Estimates and Completed
   tabs. We followed his specification and the app, and corrected 6 cases. He should know his July
   answer and that design picture no longer match what shipped.
4. **The specification's own version number has stopped moving.** The page has been revised
   eighteen times but still says "Version: 1.6" inside. Nothing is blocked by it, but it is exactly
   how a specification drifts several versions without anyone noticing.

## What is blocked on the developers

| Ticket | What is wrong | Cases | Where it stands |
|---|---|---|---|
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | **NEW today.** A saved Customer, Lead Technician or Service Advisor filter comes back switched on but without the name of the value, so the list is filtered by something the screen does not name | 2 | **Open**, priority Low, hanging off the Filters epic, linked to both stories it belongs to |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | On a phone, a shared link with filters shows the buttons as on but lists different work orders | 2 | **Open.** Still happens on the new build |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | On a phone there is no Clear Filters button at all | 1 | **Open.** Still happens |
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | The filter buttons share the tab row, so collapsing frees no space | 2 | **Closed by the QA lead.** Still happens, so the cases now say "known and accepted" |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | When only a search is active the empty screen offers Clear Filters, which does not help | 3 | **Closed by the QA lead.** Still happens, same treatment |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Page search text saved to the account forever | 3 | **Our finding is FIXED.** The ticket was closed to us and then retitled by someone else to a different complaint |

**Two tickets raised by the tester working through the run, not by us:**

| Ticket | What is wrong | Cases | Where it stands |
|---|---|---|---|
| [SV-8824](https://shopview.atlassian.net/browse/SV-8824) | A filter dropdown closed the moment you ticked one value | 12 | **FIXED, and now Ready for QA.** We proved it on all five buttons. Those 12 cases now pass and no longer warn about it |
| [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | A deleted filter value is hidden from the dropdown but still used to filter the results | 5 | **Open, and we reproduced it with seeded data.** This is the one where our earlier pass was wrong and the tester was right |
| [SV-8828](https://shopview.atlassian.net/browse/SV-8828) | Saved filters need a "Back To My Saved Filters" click after closing the browser | 0 | **Open. We could not reproduce it**, on either build. Not saying he is wrong — someone should ask him what he saw |

## One thing we found that we did NOT raise, and why

A made-up **Yes/No** filter value is silently ignored and you get the unfiltered list back, while a
made-up filter **name** is properly rejected. **No customer and no manual tester can reach this** —
it needs a hand-crafted request the app itself never sends. Under our rules an issue like that is
never raised without asking you first, so it is written up and waiting for your word. Still true on
the new build.

## Can the automation engineer start on Filters?

**Yes — he can start today on 93 of the 110 cases**, five more than a day ago, and the developers
have already given him stable test handles for every control he needs.

## OUTSTANDING — what I need from you

1. **Tell Ahtasham that five of his seven failures are now fixed** so he can re-run them, and **ask
   him what he saw on FLT-PERS-02** — we could not reproduce a failure of what that case asks for.
   None of his results were touched.
2. **Confirm one judgement call of mine.** You told me to delete the known-issue line where the
   defect is fixed. I applied the same rule to the **12** cases carrying the
   [SV-8824](https://shopview.atlassian.net/browse/SV-8824) line, because
   that defect is fixed too. If you would rather they kept the line, say so and it goes back.
3. **Branko's answer on the phone Apply button
   ([SV-8825](https://shopview.atlassian.net/browse/SV-8825)).** Until it comes, 8 phone cases cannot be
   automated and cannot be given a pass or a fail.
4. **Your word on the one API-only issue** above — raise a ticket for it, or leave it. Nothing is
   filed either way until you say so.
5. **A second test login** so the "one user's filters do not leak to another" case can be run.
6. **Tell us when engineering says this branch is final.** Everything above was measured on a
   branch they are still working on, so every finding is provisional and has to be re-checked when
   it settles.
7. **A decision on the 19 dropdown merges** left over from the July audit. They were waiting for a
   live build to confirm the filter dropdowns share one component. They do.
8. **Nothing needed — this one is now settled, and it went in Schedule's favour.** The question was
   whether a case flagged as *"needs a tool"* should be taken out of the ready figure: this report took
   its 4 out, Schedule left its 3 in. **The answer is that they should NOT be taken out** — unless the
   tool is something an automated test genuinely cannot provide, meaning a real physical phone or
   tablet, **and not one of the seven flagged cases across the two projects needs that.** Each of the
   seven was read again against what the case actually asks the tester to do, and the reasoning is
   plain: **needing the browser's inspector, a forced window size, a theme switch or a set-up data
   state makes a case EASIER to automate than to run by hand** — a script reads a colour, a width or a
   network request directly and gets the same answer every time, whereas a person has to open the
   inspector. **So this report's figure rises from 89 to 93 and Schedule's stays at 157**, and both now
   carry the same formula in the same words. Three of this report's four flags were also removed as
   simply wrong (FLT-MOB-09, FLT-PSRCH-01, FLT-PSRCH-02 measure nothing and need no tool), as was one of
   Schedule's three (its dark-mode case uses the app's own theme switch). **No case changed its outcome
   and the total is still 110.** **Nothing is needed from you here unless you disagree with that call.**
   *(The same rule still has to be applied to the Report Suite report, which has not been looked at
   yet — that is the one loose end this decision leaves.)*

Nothing else is outstanding.
