# Filters — is it ready for automation? (5 August 2026)

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
| **Ready-figure rule now written out in full** | **The figure is still 89 — nothing was recounted and no case changed.** What is new is that the rule behind it is now spelled out in the same words every readiness report uses, and the **8 not-built cases it leaves out are named individually** with their case numbers so the automation engineer can pick them up when those features land. The Schedule report was counting its not-built cases as ready and has been corrected to match. |

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
- **Also needs a browser tool** — the last column is a **flag, not an outcome**, so it is
  deliberately **not** part of the sum. These cases check exact colours, fonts and widths, which
  needs the inspector that is already built into every browser. A manual tester **can** run them;
  it is just not a job for a non-technical tester.

| Part of the feature | Test cases | Work correctly | Product is wrong — the case correctly fails | Waiting on the product owner | Not built yet | Held for a second sign-in | **Ready to automate** | Also needs a browser tool |
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
| Phone screens | 10 | 0 | 2 | 8 | 0 | 0 | **1** | 1 |
| The search box on the page | 13 | 9 | 4 | 0 | 0 | 0 | **10** | 3 |
| Behind the scenes (the data request) | 6 | 3 | 2 | 0 | 0 | 1 | **5** | 0 |
| Parts pages | 5 | 0 | 0 | 0 | 5 | 0 | **0** | 0 |
| Reports pages | 4 | 1 | 0 | 0 | 3 | 0 | **1** | 0 |
| **TOTAL** | **110** | **74** | **19** | **8** | **8** | **1** | **89** | **4** |

### The arithmetic, checked and stated plainly

**Every one of the 16 rows adds up, and so does the total** — the five outcome columns sum to the
Test cases figure in all 17 places. This is a change from the 4 August version of this table, where
three rows did not add up. The reason they did not is worth stating rather than burying, because it
is the same information, just now shown honestly:

- **4 cases sit in two columns at once.** FLT-MOB-09, FLT-PSRCH-01, FLT-PSRCH-02 and FLT-PSRCH-08
  are each **both** "product is wrong" **and** "needs a browser tool". They are counted **once**, in
  "product is wrong", and the browser-tool column is now a separate flag that is not added in. That
  is why the last column is not part of the sum. *(The 4 August note about this named FLT-MOB-10 as
  the double-counted phone case; the case actually double-counted was FLT-MOB-09. The count of 4 was
  right, the name was not. Corrected here.)*
- **1 case used to sit in no column at all.** FLT-API-06 =
  [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) is held for a second sign-in. It
  now has its **own column** instead of falling between the others, so it is counted exactly once like
  everything else.

**How the "Ready to automate" figure is worked out — the same formula every readiness report now
uses:**

> **Ready to automate = cases − waiting on the product owner − could not be set up on this test
> system − not built yet.**

In this report, "could not be set up on this test system" is the column called **"Held for a second
sign-in"** — the same thing under a more specific name. Applying that shared formula to the whole
suite: **110 − 8 − 1 − 8 = 93.**

**Filters then takes out 4 more, and the figure you see is 89.** The 4 are the pixel-measurement cases
that need the browser's own measuring tool — they check exact font names, hex colours and widths, and
the build already uses different values from the written design, so those numbers are likely to move.
**93 − 4 = 89.**

**This is the one remaining difference between this report and the Schedule report, and it has not
been quietly aligned:** Schedule does **not** take its 3 flagged cases out of its ready figure,
because forcing a narrow window or a dark theme is something an automated test does for itself. If the
two reports should treat flagged cases the same way as well, that is a decision for the QA lead, and
it is listed in the outstanding section below. **The not-built rule, which is what actually mattered,
is now identical in both.**

**Why not-built cases are left out.** **The feature is not in the product yet, so an automated test for
it could only fail.** An engineer who wrote these eight would find nothing to test, get eight red
results, and spend time investigating a fault that does not exist. They stay counted as test cases —
they are still in the 110 and still in the "Not built yet" column — they are simply not counted as
automatable. **Pick them up when the features land.**

**The eight cases left out of 89, named in full so they can be picked up later:**

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
   on the build at all, so an automated test for them could only fail. **They are OUTSIDE the 89** —
   pick them up when the features land. **This is one fewer than on 4 August**, because the Reports
   date filter turned out to be built and working — FLT-RPTS-23 =
   [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) is now a passing, automatable
   case.
3. **The 4 pixel-measurement cases** — FLT-MOB-09 =
   [C29629](https://shopview.testrail.io/index.php?/cases/view/29629), FLT-PSRCH-01 =
   [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), FLT-PSRCH-02 =
   [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) and FLT-PSRCH-08 =
   [C38898](https://shopview.testrail.io/index.php?/cases/view/38898). These
   check font names, hex colours and exact widths. Automate them LAST: the build uses different
   values from the written design and those numbers are likely to move. **These 4 are the only thing
   this report takes out that the Schedule report does not** — see the note under the table.
4. **FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895), step 3** — the
   second-account check. Automate steps 1, 2 and 4 now; step 3 needs a
   second test login to be provided.

**Everything else — 89 cases — is ready to automate today**, one more than on 4 August. The 19 that
currently fail should still be automated: they are correct, they describe what the app is supposed
to do, and each one carries its ticket number or says plainly that the difference is accepted, so a
red result is information rather than noise.

**A manual tester can run every single one of these 110 cases today**, with nothing but a browser —
including the 19 that currently fail and the 8 on pages that are not built yet (each of those tells
the tester to mark it **blocked**, not failed). The only exceptions are the 4 that ask for exact
pixel widths, colours and font sizes.

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

**Yes — he can start today on 89 of the 110 cases**, one more than a day ago, and the developers
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
8. **One small rule difference between this report and the Schedule report, for you to settle.** Both
   reports now leave **not-built** cases out of the ready figure — that was the important one and it is
   fixed. What is still different is **flagged cases**: this report takes its 4 pixel-measurement cases
   out of the 89, and the Schedule report leaves its 3 flagged cases inside its 157. Nothing has been
   changed to hide it. If they should match, say which way: Filters would become 93, or Schedule would
   become 154.

Nothing else is outstanding.
