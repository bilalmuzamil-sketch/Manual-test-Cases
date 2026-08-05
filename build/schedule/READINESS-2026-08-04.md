> # ⚠️ SUPERSEDED — 5 August 2026
>
> **This file is superseded by `READINESS-2026-08-05.md`.** It is kept as the record of what
> was measured on build `v3.5-4873abe`, and it is NOT deleted. The branch has since been
> rebuilt to `v3.5-be42149`; two of the verdicts below have changed and one feature it calls
> *not built* has shipped. Use the 5 August file.

> ## ⚠️ ITS VERDICTS ARE NO LONGER CONFIRMED — 5 August 2026
>
> **Every figure in this report was measured on build `v3.5-4873abe`. That build is gone** — the QA
> branch was redeployed at **08:09 UTC on 5 August** and now serves **`v3.5-be42149`**.
>
> A full re-check was attempted the same day and **could not run: 0 of the 165 rows were re-observed**,
> because the QA-branch session had expired (HTTP 401 `sso_required`). **So this report is NOT
> superseded — there is nothing newer to replace it with — but none of its outcomes is confirmed
> against the build being served today.** Do not quote the 138 / 19 / 4 / 2 / 2 split, or the
> **157** ready-to-automate figure, as current.
>
> Two things in it are already known to have changed, from Jira rather than the build:
> **outstanding item 5 is answered** — the eleventh ticket is not needed, because
> [SV-8834](https://shopview.atlassian.net/browse/SV-8834) already covers SCH-MODAL-03 =
> [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) exactly — and SCH-TOOL-03 =
> [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) is no longer unticketed either
> ([SV-8874](https://shopview.atlassian.net/browse/SV-8874)).
>
> The queue that is owed: `build/schedule/recheck-2026-08-05/RECHECK-QUEUE.md`. Why it could not run:
> `build/schedule/recheck-2026-08-05/SOURCE-CURRENCY.md`.

# Schedule — is it ready for automation? (4 August 2026, table restructured and the ready-figure rule finished 5 August)

**What this is.** We ran every one of the **165 Schedule test cases against the real, running app**
for the first time — the Schedule QA branch at `sv8685.qa.shopview.com`. Before then not one of them
had ever been checked against a build; the whole suite was written from the specification.

**How much of it was actually checked: all of it. 165 of the 165 cases have a definite answer** —
not "mostly", not "the important ones". Nothing is left partly-observed and nothing is left
untouched. The count was verified twice over, once from the record of the run and once by re-reading
what each case now says on the live system, and the two agree exactly, area by area.

**The build we tested:** ShopView **v3.5-4873abe**, checked at the start, the middle and the end of
the day, and once more afterwards — the same build every time, so nothing changed under us.

> ## ⚠️ ONE THING TO KEEP IN MIND
>
> **The developers have told us this QA branch is not finished** — they are still working on it. So
> every answer below is **today's answer, not a permanent one**. All 165 are queued to be checked
> again when they tell us the branch is done, one row per case, in
> `viu-2026-08-04/RECHECK-QUEUE.md`. Until then nobody should describe the Schedule suite as
> finished.

## What changed on 5 August

**One number changed: the "ready to automate" figure is now 157, not 161.** Nothing about the
testing changed and no case changed its outcome — every outcome figure below was re-measured from the
record of the run (`viu-2026-08-04/RECHECK-QUEUE.md`, one row per case, all 165 re-counted) and comes
out identical. What changed is the **rule** for working out how many cases can be automated.

**The second half of that rule is now settled too, and Schedule's figure does not move again: it stays
157.** The open question was whether a case marked *"needs a tool"* should be taken out of the ready
figure. **It should not** — unless the tool is something the automation harness genuinely cannot
provide, such as a real physical phone or tablet. **No Schedule case needs anything like that**, so
nothing is subtracted for tools. The Filters report used to subtract its flagged cases and has now
been corrected to match, which moved **its** figure from 89 to 93. **Both reports now use one rule,
written out in the same words in both.**

| | |
|---|---|
| **The ready-to-automate rule is now the same in every report** | The four cases on **features that are not built yet are no longer counted as ready to automate**, so the figure drops from **161 to 157**. This was decided because the Filters report already left its not-built cases out, and an engineer reading both side by side would have written four automated tests for features that are not in the product — they would fail, he would investigate, and the time would be wasted before anyone worked out why. **The four cases are named in full below.** They are still counted as test cases; they are just not counted as automatable. |
| **"Needs a tool" no longer takes anything out of the figure, in either report** | A tool flag is now only allowed to reduce the ready figure if the tool is something an automated test **cannot** provide — a real physical device. **Reading a colour, a size or a network request is the opposite of a problem for automation**: a script reads those values directly, while a person has to open the browser's inspector by hand. So these cases are **easier** to automate than to run by hand, and taking them out was under-counting. **Schedule stays 157.** One of Schedule's three flags was also simply wrong and has been removed — SCH-EDGE-08 uses the app's own dark-mode switch and needs no tool at all. |
| **The table now has one kind of column** | It used to mix "what happened when we tested it" with "this case also needs a tool". Those are different things, and mixing them meant one row appeared to hold 8 cases when it holds 7. **The tool column has been taken out of the table and is now shown separately, below, as a flag.** Adding across a row can no longer overshoot. |
| **Two columns were renamed** (4 August) | *"Broken on the build"* is now **"Product is wrong — the case correctly fails"**: it never meant our case was broken. *"Needs a free tool"* now says plainly that **a manual tester can run those cases today.** |
| **Correction 1** | The 4 August note said all three tool cases sat in the "work correctly" column. **They do not.** One of them, SCH-EDGE-02, is one of the 19 where the product is wrong. The count of three was right; the explanation was wrong. |
| **Correction 2** | The 4 August wording said all three cases "ask for a measuring tool". Only **one** of them really needs the browser's own developer tools. One uses the app's own dark-mode switch, and one needs a busy schedule set up first. Each one now says which. *(Later on 5 August the dark-mode case had its flag removed altogether — the app's own theme switch is not a tool — so the flag list is now **2 cases**, not 3. Its outcome did not change.)* |

## The one table

**Every column here counts TEST CASES, and every column is an OUTCOME — what happened when we tested
that case on the build. Each case sits in exactly ONE of these five columns.** The five outcome
columns add up to the "Test cases" figure on **every single row and on the total**. There is nothing
to work out in your head and nothing hidden.

- **Work correctly** — we drove it on the live build and the product did what the case says it
  should. The case passes. Nothing to do.
- **Product is wrong — the case correctly fails** — **the case is right and the PRODUCT is wrong.**
  These cases are *supposed* to come out red on this build. Automate them and **expect a red
  result**; that red is the case doing its job. It does **not** mean the test case is faulty — these
  are the cases that *caught* the faults. Of these 19: **15 name their developer ticket on the case
  itself, with a link**, and **4 have no ticket** — 3 of those are deliberate (they are questions for
  the product owner rather than code faults, and the reasons are written down in
  `viu-2026-08-04/DELIBERATE-DECISIONS.md`) and **1 needs a ticket and does not have one**.
- **Waiting on the product owner** — a product question is unanswered, so what the case should expect
  could still change. Automating now risks locking in the wrong behaviour. Both of these say
  **"DO NOT AUTOMATE YET"** on the case itself.
- **Not built yet** — the feature does not exist in the product yet, so there is nothing to test. Each
  of these cases tells the tester to mark it **blocked**, not failed. **These are NOT counted as ready
  to automate**, because the feature is not in the product yet, so an automated test for it could only
  fail. They are named individually further down.
- **Could not be set up on this test system** — nothing to do with tools. The starting conditions
  cannot be created here: a clock change that has not happened yet, and a shared setting nobody has
  authorised changing. These cases tell the tester to mark them blocked.
- **Ready to automate** — this is **not** an outcome and **not** part of the sum. It is a **derived
  figure**, recounted from the five outcome columns by the one formula written out under the table.

| Part of the feature | Test cases | Work correctly | Product is wrong — the case correctly fails | Waiting on the product owner | Not built yet | Could not be set up on this test system | **Ready to automate** (derived, not part of the sum) |
|---|---|---|---|---|---|---|---|
| Who is allowed to do what | 13 | 12 | 1 | 0 | 0 | 0 | **13** |
| Spreading a big job over several days | 10 | 7 | 1 | 1 | 1 | 0 | **8** |
| Deleting and undoing | 9 | 9 | 0 | 0 | 0 | 0 | **9** |
| Dragging a job onto a technician | 8 | 6 | 1 | 0 | 1 | 0 | **7** |
| The two toolbar menus | 8 | 6 | 2 | 0 | 0 | 0 | **8** |
| The shift window | 8 | 4 | 4 | 0 | 0 | 0 | **8** |
| Odd situations and small screens | 7 | 4 | 1 | 1 | 0 | 1 | **5** |
| Events (meetings, time off) | 7 | 6 | 0 | 0 | 1 | 0 | **6** |
| Start times and the Unassigned row | 7 | 6 | 0 | 0 | 0 | 1 | **6** |
| Clash warnings | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| The Schedule page, its three views and the department rows | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| Opening a work order to see its lines | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| The work order filters | 6 | 5 | 1 | 0 | 0 | 0 | **6** |
| Does the rest of the app still work | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| The Day view timeline | 5 | 3 | 2 | 0 | 0 | 0 | **5** |
| The hover summary | 5 | 4 | 1 | 0 | 0 | 0 | **5** |
| The work order list and its search box | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| Setting working hours | 5 | 5 | 0 | 0 | 0 | 0 | **5** |
| Behind the scenes (the data requests) | 4 | 3 | 0 | 0 | 1 | 0 | **3** |
| The capacity bars | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| A spread job shown as one run of days | 4 | 3 | 1 | 0 | 0 | 0 | **4** |
| Several jobs at the same time | 4 | 3 | 1 | 0 | 0 | 0 | **4** |
| Choosing what to schedule | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| The little month calendar | 4 | 4 | 0 | 0 | 0 | 0 | **4** |
| Colours | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| The toolbar | 3 | 2 | 1 | 0 | 0 | 0 | **3** |
| Keyboard | 3 | 1 | 2 | 0 | 0 | 0 | **3** |
| Moving a job to another technician | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| What a block on the board says | 3 | 3 | 0 | 0 | 0 | 0 | **3** |
| **TOTAL** | **165** | **138** | **19** | **2** | **4** | **2** | **157** |

### The arithmetic, checked and stated plainly

**All 29 area rows add up, and so does the total — 30 places checked, no sampling.** The five outcome
columns sum to the Test cases figure in every one of them, and down the total column:
**138 + 19 + 2 + 4 + 2 = 165.** Every one of the 165 cases is in exactly one of those five columns,
and no case is in two.

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

Recompute it two ways and it comes out the same both times:

- **Whole suite:** 165 − 2 − 2 − 4 = **157**.
- **Adding the 29 row figures:** 13+8+9+7+8+8+5+6+6+6+6+6+6+5+5+5+5+5+3+4+4+4+4+4+3+3+3+3+3 = **157**.

**The figure used to be 161, because the four not-built cases were counted as ready. They no longer
are.** Not one test result changed — only the rule did.

**Why not-built cases are left out.** **The feature is not in the product yet, so an automated test for
it could only fail.** An engineer who wrote these four would find nothing to test, get four red
results, and spend time investigating a fault that does not exist. They stay counted as test cases —
they are still in the 165 and still in the "Not built yet" column — they are simply not counted as
automatable. **Pick them up when the features land.**

**The four cases left out of 157, named in full so they can be picked up later:**

| Case | C-id | Link | What is missing from the product |
|---|---|---|---|
| SCH-API-02 | C38873 | https://shopview.testrail.io/index.php?/cases/view/38873 | No cap and no confirmation on a very long spread — a 76-hour spread over 26 lines produced 7 shifts with no prompt at all |
| SCH-DND-08 | C29962 | https://shopview.testrail.io/index.php?/cases/view/29962 | There is no click-to-arm alternative to dragging. Clicking a sidebar card opens the line list; clicking a line row does nothing schedulable |
| SCH-EVT-02 | C30017 | https://shopview.testrail.io/index.php?/cases/view/30017 | No live preview and no drag-to-resize while creating an event in Day view |
| SCH-SPREAD-11 | C38863 | https://shopview.testrail.io/index.php?/cases/view/38863 | No cap and no confirmation exist on a long spread. Also unsettled: whether the 8-week / 120-shift limit is a product requirement at all |

**What is deliberately NOT subtracted, and why — read this before you rely on 157:**

- **The 19 "product is wrong" cases are NOT subtracted.** They should be automated and are expected
  to come out red until the tickets are fixed.
- **The flag below is NOT subtracted**, because forcing a narrow window or setting up a busy week is
  something an automated test does for itself — and does more reliably than a person. **The Filters
  report no longer subtracts its flagged cases either.** It used to take out 4, which is why its figure
  read 89; those 4 were checked one by one, none of them needs anything an automated test cannot
  provide, and its figure is now **93**. **The two reports now apply the same rule in the same words,
  so the two figures mean the same thing.**

## Flags — an extra note on some cases, NOT an outcome

**These are FLAGS, not outcomes.** A flag is an extra property of a case. **A flagged case still sits
in exactly one outcome column above, and flag counts must never be added into the table.** Flags can
overlap each other and they can apply to a case in any outcome column.

**Flag: the case needs the screen or the data put into a special state first — 2 cases.** *(It was 3.
The third flag was wrong and has been removed — see immediately below the table. No case changed its
outcome column, and the table above is untouched.)*

| Case | C-id | Link | Which outcome column it is in | What it needs | Does it stop automation? |
|---|---|---|---|---|---|
| SCH-EDGE-02 | C30086 | https://shopview.testrail.io/index.php?/cases/view/30086 | **Product is wrong** (one of the 19) | The browser window forced to just under 960px wide. Dragging the window edge works; the browser's own developer tools make the width exact. | **No — it makes it easier.** Setting an exact window size is one line of instruction to an automated test, and it gets the exact number every time; a person has to drag an edge or open the inspector. |
| SCH-EDGE-04 | C30088 | https://shopview.testrail.io/index.php?/cases/view/30088 | Work correctly | A busy week set up first — around 15 technicians across 7 days with several shifts each — then a judgement that the grid still draws smoothly. | **No.** The busy week is data, and a script can create it far faster than a person. Honest caveat: the *judgement* at the end is "does it feel smooth", which a person judges better than a machine — so automate the set-up and keep a human eye on the result. |

**The flag that has been REMOVED:** SCH-EDGE-08 =
[C38866](https://shopview.testrail.io/index.php?/cases/view/38866) (dark mode). It was flagged as
needing a tool; **it does not need one.** The case's own steps say *"Switch the app to dark mode"*, and
that switch is **the app's own theme control in the user menu**. **Its outcome is unchanged — it is
still in the "Work correctly" column and still one of the 165.** Only the flag has gone.

**A manual tester can run both of these today, on the machine they already have, with nothing to
install.** The only tool that comes into it is the developer tools already built into every browser
(F12), and only for the first one. They are flagged so nobody hands them to a brand-new
non-technical tester without walking them through it once.

**One case we did NOT flag, in case you were expecting it:** SCH-EDGE-03 =
[C30087](https://shopview.testrail.io/index.php?/cases/view/30087) checks the sidebar list stays
smooth with 50 or more items. It is the same kind of performance check as SCH-EDGE-04, but it ran on
the work orders already in the system (92 of them) with nothing set up specially, so it needs no
flag.

## LEGEND — the two points that get misread

**Read these two before drawing any conclusion from the table.**

- **A case in the "Product is wrong" column is a GOOD case.** The **case** is correct; the
  **product** is wrong. A ticket is open and named on the case itself for 15 of the 19. **A FAIL
  there is the expected result** until the ticket is fixed. Nothing in that column means our test
  case is faulty — those are the cases that *caught* the faults. Do not raise a new ticket for them,
  and do not treat the case as broken.
- **A flagged "needs a tool" case CAN be run by a manual tester today, with nothing to install, and it
  does NOT reduce the ready figure.** The tool is the browser's own developer tools, which are already
  on every machine, and only one of the two flagged cases even needs that. It is a note for whoever
  runs them by hand; it is **not** something that stops a person testing them, and it is **not** a
  reason to leave them out of automation — **a script reads a size or a colour more easily than a
  person can.**

**A manual tester CAN run all 165 of these cases today, with nothing but a browser** — including the
19 where the product is wrong (they are *supposed* to fail, so a red result is information rather
than noise) and the 4 on features that are not built yet (each one tells the tester to mark it
**blocked**, not failed).

## What the automation engineer should SKIP, and why

1. **The 2 shop-closure cases — SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) and SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983).** The specification says two opposite
   things about whether a shop closure day blocks a spread, and nobody has ruled. Automating now could
   lock in the wrong behaviour. Both cases say, in the case itself: *"DO NOT AUTOMATE YET."*
2. **The 2 cases that cannot be set up here — SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) and SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970).** One waits for a clock
   change in November, the other for a shared setting nobody has authorised changing.
3. **The 4 not-built cases** — SCH-API-02 =
   [C38873](https://shopview.testrail.io/index.php?/cases/view/38873), SCH-DND-08 =
   [C29962](https://shopview.testrail.io/index.php?/cases/view/29962), SCH-EVT-02 =
   [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) and SCH-SPREAD-11 =
   [C38863](https://shopview.testrail.io/index.php?/cases/view/38863). The features behind them do not
   exist in this build, so an automated test for them could only fail. **They are OUTSIDE the 157** —
   pick them up when the features land.
4. **Leave the 8 drag-and-drop cases until last, and budget more time for them.** There is no
   click-to-arm alternative to dragging on this build (SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) — that is itself a gap we reported),
   so every one of those cases needs real mouse-press-move-release emulation, not a simple click.
   They all work — we drove every one of them by hand — but they are the slowest to write.

**One warning worth more than the four points above.** Some of these cases move real work already
on the board. If a test drags an existing shift, **put it back and then compare every field to what
it was before** — owner, start, end and length, not just the one you changed. We learned this the
hard way: a drag test restored a shift's start time and left it on the wrong technician and
seven and a half hours short, and nobody noticed until the whole week was compared field by field.
That shift has been put back.

**Everything else — 157 cases — is ready to automate today.** The 19 that currently fail should still
be automated: **the cases are correct — it is the product that is wrong** — they describe what the app
is supposed to do, and 15 of them already carry their ticket number. **A red result on those 19 is the
expected result, not a faulty test.**

**One thing that will make automation much easier, and it is very good news:** the developers have put
**166 stable test handles** on this feature — every toolbar button, every toggle in both menus, every
sidebar card and its status badge, every mini-calendar date, the shift window and every field inside
it, each line row, the capacity bars (which even carry the percentage and the date as attributes), and
each conflict row keyed by its shift. The full list is in
`build/schedule/viu-2026-08-04/snapshots/testids-union.json`. **An automation engineer will not have to
guess at a single selector.** The grid itself is FullCalendar, which is well documented and stable.

## What is blocked on Branko (the product owner)

1. **The shop-closure contradiction — 2 cases frozen.** Section 4.5 says *"Shop closures and public
   holidays are not skipped in V1."* Section 12 says closures *"block the spread step from placing
   shifts on those days."* Both sentences are still in version 23. There is no shop-closure setting in
   the app at all, so testing cannot settle it — **only he can**. **This has been open since 22 July
   and the question has still not been sent to him** — that is the single oldest item on this project.
2. **Two of the twelve tickets another QA raised argue against Branko's own earlier rulings.**
   **[SV-8835](https://shopview.atlassian.net/browse/SV-8835)** says the hover summary should hide the VIN when the switch is off; Branko ruled on
   31 July that it is always visible. **[SV-8829](https://shopview.atlassian.net/browse/SV-8829)** says the shift window should show labor and total
   figures; Branko ruled on 22 July that no money is shown anywhere on the Schedule. Our cases follow
   his rulings, and we changed nothing on either side. He needs to confirm which stands — **and the
   specification needs correcting either way, because the sentences those tickets were read from are
   still in it.**
3. **Should a technician with no working hours saved be treated as working weekends?** Right now they
   are, which is why a Sunday shift raises no clash for them and Sunday capacity looks as full as a
   Tuesday. It is the single cause behind two of the twelve tickets. It is a product decision, not a
   code bug.
4. **Is the 8-week / 120-shift limit on a long spread a real product requirement?** It is in the
   engineering plan only and the app enforces neither. If it is not a requirement, two of our cases
   should change rather than the code.

## What is blocked on the developers

**Ten tickets were raised from this pass**, all at priority **Low**, all hanging off epic
**[SV-8685](https://shopview.atlassian.net/browse/SV-8685)** with the owning story linked. Every one was read back from Jira afterwards to confirm it
saved correctly.

**The "Cases" column below counts every case that NAMES the ticket in its text. That is a flag-style
count, and it is NOT the same thing as the 19 "product is wrong" cases** — a case can pass its own
check and still carry a known-issue note about a ticket. The two reconcile like this: of the 19
product-is-wrong cases, 15 name a ticket and 4 name none; and **5 further cases that PASS also name a
ticket** — the four under [SV-8848](https://shopview.atlassian.net/browse/SV-8848) and one under
[SV-8841](https://shopview.atlassian.net/browse/SV-8841).

| Ticket | What is wrong | Cases naming it |
|---|---|---|
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Every time on the Schedule shows **six hours later** than the time it was scheduled for. A 7 AM job reads 1 PM. **This is the one to fix first** — the board is unusable as a planning tool until it is. | 4 *(all 4 pass their own check; they carry it as a known issue)* |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | A spread job cannot be opened at all from the Week view, so it cannot be recoloured, noted or deleted from there. | 1 |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | The "+1 more" link on a crowded day opens an empty box — the hidden jobs are never listed. | 1 |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | The Tech Hours option in View Options does nothing. | 1 |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | The clash warning in the shift window offers no way to fix the clash. | 1 |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Escape and Enter do nothing on the delete and reassign confirmation windows. | 2 |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | A user who is not allowed to see work orders can still read the whole work order list on the Schedule. | 1 |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | The spread window has no start date, so two technicians cannot be scheduled one after the other. | 1 |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Dragging a job sideways in Day view jumps a whole hour instead of a quarter of an hour. | 1 |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | The sidebar filters have no "Clear all" and no count of how many are on. | 1 |

**Six of the twelve tickets another QA raised were independently confirmed** — [SV-8826](https://shopview.atlassian.net/browse/SV-8826),
[SV-8831](https://shopview.atlassian.net/browse/SV-8831), [SV-8837](https://shopview.atlassian.net/browse/SV-8837), [SV-8839](https://shopview.atlassian.net/browse/SV-8839), [SV-8840](https://shopview.atlassian.net/browse/SV-8840) and [SV-8841](https://shopview.atlassian.net/browse/SV-8841). **Two do not reproduce as written** and are questions
back to their author rather than code changes: **[SV-8830](https://shopview.atlassian.net/browse/SV-8830)** (a weekend shift IS flagged, but only for a
technician who actually has working hours saved — the steps used one who has none) and **[SV-8827](https://shopview.atlassian.net/browse/SV-8827)**
(the Business Hours half is real, the Tech Hours half is not — Tech Hours already defaults off). None
of their tickets was touched.

**The four cases in the "product is wrong" column with no ticket at all** are SCH-EDGE-02 =
[C30086](https://shopview.testrail.io/index.php?/cases/view/30086), SCH-TIP-01 =
[C30034](https://shopview.testrail.io/index.php?/cases/view/30034), SCH-TOOL-03 =
[C30041](https://shopview.testrail.io/index.php?/cases/view/30041) and SCH-MODAL-03 =
[C30010](https://shopview.testrail.io/index.php?/cases/view/30010). The first three are deliberate,
with the reasons written down in `viu-2026-08-04/DELIBERATE-DECISIONS.md`. **The fourth needs a
ticket and does not have one** — see the outstanding list.

## OUTSTANDING — what I need from you

1. **Send Branko the shop-closure question.** Two cases stay frozen and unautomatable until he
   answers, and this has been waiting since 22 July.
2. **Rule on the two tickets that clash with his earlier answers** ([SV-8835](https://shopview.atlassian.net/browse/SV-8835) and [SV-8829](https://shopview.atlassian.net/browse/SV-8829)). Our cases
   follow his rulings; another QA's tickets say the opposite. Nothing was changed on either side.
3. **Nothing needed — this one is settled.** The question used to be whether "not built yet" cases
   count as ready to automate. **They do not, in every report**, so Schedule's figure is now **157**
   and it matches the rule Filters was already using. **One thing is still different between the two
   reports and you may want to rule on it:** Filters also takes out its 4 cases that need the browser's
   measuring tool; Schedule does not take out its 3 flagged cases. If they should match on that too,
   Schedule's figure becomes 154. **UPDATE, 5 August — this second half is now settled as well, and it
   went the other way: flagged cases are NOT taken out, in either report.** The only tool allowed to
   take a case out of the ready figure is one an automated test genuinely cannot provide — a real
   physical device — and **no Schedule case and no Filters case needs one**. The reasoning, plainly:
   needing the browser's inspector, a forced window size or a set-up data state makes a case **easier**
   to automate than to run by hand, because a script does all three for itself and gets the exact number
   every time, while a person has to open the inspector and drag a window edge. **So Schedule stays
   157** and **Filters rises from 89 to 93**, because Filters was taking out 4 cases it should not have
   been. One Schedule flag was also removed as simply wrong — SCH-EDGE-08 =
   [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) uses the app's own dark-mode
   switch, not a tool. No case changed its outcome and the total is still 165. **Nothing is needed from
   you here unless you disagree with that call.**
4. **Say whether you want a ticket for the one API-only finding.** It is written up and waiting in
   `build/schedule/viu-2026-08-04/API-ASK.md` and has NOT been filed, because an API-only defect is
   never raised without your explicit say-so — even inside a batch you have already approved.
5. **Say whether you want an eleventh ticket for a real fault we found and did not raise.** The shift
   window's "time logged" bar showed a job as **fully worked when nothing had been clocked against
   it** — it looks like it is showing the estimate twice. It is the only product-is-wrong case with no ticket
   and no stated reason, and it affects one case (SCH-MODAL-03 =
   [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)).
6. **Authorise one new test case.** Another QA found a hole we had no case for: nothing checks that a
   technician showing on the board is a real, findable staff member. The case is drafted, not written.
7. **Authorise a small tidy-up on 16 cases.** Sixteen of the 165 show raw page markup — literal
   `<ol>` and `<li>` tags — in their steps and expected results. It is readable and it is **not new**
   (it predates this work), but it looks unprofessional to a tester and should be cleaned.
8. **Ask engineering to tell us when this branch is final.** Until they do, all 165 answers are
   provisional and the re-check queue stays open.
9. **Decide whether run 357 should be reset.** It holds 429 result records, all of them ours and all
   Untested, and Ayesha has not started. Nothing was written to it, and that was verified
   afterwards rather than assumed.

## Can the automation engineer start on Schedule?

**Yes — he can start on 157 of the 165 cases**, **beginning with the shift window, the toolbar, the
sidebar and permissions; leave the 8 drag cases for last and skip the ones named above.** The one thing to keep in mind is that these are
today's answers: the branch is not finished, so expect some of the 19 product-is-wrong cases to start
passing as tickets are fixed, and re-check rather than assume.
