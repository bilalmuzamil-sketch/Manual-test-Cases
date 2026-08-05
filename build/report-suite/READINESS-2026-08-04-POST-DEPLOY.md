> # ⚠️ SUPERSEDED — 2026-08-05
> **This file is superseded by `READINESS-2026-08-05.md` and is kept for the record only.**
> Its ready-to-automate figure of **401 is out of date on two counts**: 4 cases have been added
> since, and 35 cases it held have been released. The current figure is **440 of 473**, derived
> by one written formula in the new file.
> **Its verdicts are also no longer confirmed** — they were taken on build `v3.4.1-3d03023` and
> the branch has since redeployed twice, to `v3.5-16cf83f`.

# Report Suite — is it ready for automation? (4 August 2026, table restructured 5 August)

**What this is.** We have checked all **469 Report Suite test cases** against the real, running app —
the Report Suite QA branch — and every one of them has a definite answer. This report says which
ones an automation engineer can start on, which ones he must leave alone, and why.

**The build we tested:** ShopView **v3.4.1-3d03023**. The branch was redeployed on 4 August at
10:41:58 UTC (`v3.4.1-0ed4433` → `v3.4.1-3d03023`), so every case fell due for a re-check and every
case was re-checked. The build marker was read at the start, the middle and the end of the run —
the same build all three times, so nothing changed under us
(`recheck-2026-08-04/evidence/build-marker-MIDRUN.json`, etag `9875201c58ba78d9851c37f7039c16e1`).

**How many cases are ours: 469.** TestRail holds **474** under the Reports Suite group. The other
**5** were written by **Vladimir Tomovic** — they are his, we never touch them, and they are never
counted in our figures. This was proven both ways: the 474 live case numbers minus his 5 equal our
469 exactly, with nothing left over in either direction.

> ## ⚠️ ONE THING TO KEEP IN MIND
>
> **Engineering has not declared this branch final** — they told us they are still working on it, and
> the 4 August redeploy proved the point. So every answer below is **today's answer, not a permanent
> one**. All 469 stay on the re-check list, one row per case, in
> `viu-2026-08-03/RECHECK-QUEUE.md`, which **stays open**. Nobody should describe the Report Suite
> as finished while it is open.

## What changed on 5 August

**The table has been rebuilt. No test was re-run, no verdict was reversed, and no finding changed.**
Two things in the old version could be read against each other, and one number was quietly wrong.
Both are fixed by changing the *shape* of the report, not by adding notes explaining the problem.

| | |
|---|---|
| **The table now holds one kind of column only** | It used to mix *"what happened when we tested it"* with *"this case also needs a tool"* and with *"we re-observed it after the redeploy"*. Those are three different questions. The table now holds **outcomes only** — every case sits in exactly one column, and every row adds up to that report's case count. Anything that is a property rather than an outcome has moved to the **Flags** section below the table. |
| **The "468 of 469" sentence is gone** | It was a statement about **tools**, sitting a few lines away from a statement about **environment**, and a reader could set the two against each other. There is now **one** set of runnability buckets — a case is either runnable by a manual tester on this test system, or it is blocked, and if it is blocked the reason is named. **There is no second figure left to argue with.** |
| **No case is in two columns any more** | Two cases used to be counted in both the product-is-wrong column and the waiting-on-Chris-Ward column. Each now sits in **one** column, with the other fact carried as a **flag** on the case. The note that used to confess the double-count has been **deleted** — there is nothing left to confess. |
| **One number was wrong and is now corrected: the ready figure is 401, not 402** | One case needs a QuickBooks-connected company we do not have, and the case itself tells the tester to mark it **Blocked**. It was nevertheless being counted as ready to automate. It is now in its own column and taken out of the figure. **This is a counting error in our own data, found by this pass, and it is stated rather than smoothed over.** |
| **The ready-figure rule is now the same rule, in the same words, as the Schedule and Filters reports** | Cases on features that are **not built** are left out (they already were here, inside another column — they now have their own column so they can be named). A case that **needs a tool** is **not** taken out, unless the tool is something an automated test genuinely cannot provide. |

## The one table

**Every column here counts TEST CASES, and every column is an OUTCOME — what happened when we tested
that case on the build. Each case sits in exactly ONE of these six columns.** The six outcome columns
add up to the "Tests" figure on **every single row and on the total**. There is nothing to work out in
your head and nothing hidden.

- **Work correctly** — we drove it on the live build and the product did what the case says it should.
  The case passes. Nothing to do.
- **Product is wrong — the case correctly fails** — **the case is right and the PRODUCT is wrong.**
  These cases are *supposed* to come out red on this build. Automate them and **expect a red result**;
  that red is the case doing its job. It does **not** mean the test case is faulty — these are the
  cases that *caught* the faults. **Every one of these 16 names its developer ticket on the case
  itself, with a link.** They are **inside** the ready figure.
- **Waiting on an answer from Chris Ward** — a product question is unanswered, so what the case should
  expect could still change. Automating now risks locking in the wrong behaviour. **Every one of these
  says so on its own face**, in these words: *"DO NOT AUTOMATE YET: this behaviour is waiting on an
  answer from the product owner."* If a case carries that line, skip it — you need no other list.
- **Could not be set up on this test system** — nothing to do with tools. The starting conditions
  cannot be created here: creating an invoice on this estate fails, or the value is written by a
  background job that no screen reads back, or it needs more than a year of stored history and this
  system holds about six days. These cases tell the tester to mark them **blocked**.
- **Not built yet** — the feature does not exist in the product yet, so there is nothing to test.
  These cases tell the tester to mark them **blocked**, not failed. **They are NOT counted as ready to
  automate**, because an automated test for a feature that is not there could only fail. They are
  named individually further down.
- **Blocked by an outside account we do not have** — one case only. It checks what was sent to
  QuickBooks, and that needs a test company whose QuickBooks account is actually connected. We do not
  have one, and no amount of set-up here produces one. The case itself says so and tells the tester to
  mark it **Blocked** rather than guess.
- **Ready to automate** — this is **not** an outcome and **not** part of the sum. It is a **derived
  figure**, recounted from the six outcome columns by the one formula written out under the table.

| Report | Tests | Work correctly | Product is wrong — the case correctly fails | Waiting on an answer from Chris Ward | Could not be set up on this test system | Not built yet | Blocked by an outside account we do not have | **Ready to automate** (derived, not part of the sum) |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Sales By Customer | 84 | 72 | 3 | 9 | 0 | 0 | 0 | **75** |
| Sales By Representative | 111 | 85 | 3 | 9 | 8 | 6 | 0 | **88** |
| Parts Velocity | 71 | 64 | 2 | 4 | 0 | 0 | 1 | **66** |
| Technician Utilization | 59 | 53 | 1 | 5 | 0 | 0 | 0 | **54** |
| Work In Progress | 76 | 61 | 0 | 11 | 4 | 0 | 0 | **61** |
| Inventory Value | 68 | 50 | 7 | 9 | 2 | 0 | 0 | **57** |
| **TOTAL** | **469** | **385** | **16** | **47** | **14** | **6** | **1** | **401** |

### The arithmetic, checked and stated plainly

**All 6 report rows add up, and so does the total — 7 places checked, no sampling.** The six outcome
columns sum to the Tests figure in every one of them, and down the total column:
**385 + 16 + 47 + 14 + 6 + 1 = 469.** Every one of the 469 cases is in exactly one of those six
columns, and **no case is in two**. Each column also sums down to its stated total.

**How the "Ready to automate" figure is worked out — one formula, written out below in the same words
in every readiness report:**

> **Ready to automate = test cases − waiting on the product owner − could not be set up on this test
> system − not built yet.**
>
> **A case flagged as "needs a tool" is NOT subtracted.** The only tool that is allowed to take a case
> out of this figure is one an automated test genuinely cannot provide — a real physical device such as
> an actual phone or tablet, or an outside account that cannot be obtained. Needing the browser's own
> inspector, a forced window size, a theme switch or a set-up data state does **not** count, because an
> automated test does all of those for itself.

**In this report, "waiting on the product owner" is the column called "Waiting on an answer from Chris
Ward"** — 47 cases, and 47 is also exactly the number of cases carrying the DO-NOT-AUTOMATE line, so
there is only one figure. **And this report has one extra column the other two do not:** the single
case blocked by an outside account we cannot obtain. That is the one thing the shared tool rule does
allow to be taken out, so it is subtracted — **once, through its own outcome column**. There is no
second route and no double subtraction.

Recompute it two ways and it comes out the same both times:

- **Whole suite:** 469 − 47 − 14 − 6 − 1 = **401**.
- **Adding the 6 row figures:** 75 + 88 + 66 + 54 + 61 + 57 = **401**.

**The figure used to be 402. It is now 401.** Not one test result changed — only the counting did, and
only for one case. The two settled rules were applied in full:

| Rule | What it does to the Report Suite figure |
|---|---|
| **Not-built cases are left out of "ready to automate"** | **No change — 0 cases.** Report Suite's 6 not-built cases were **already** being subtracted, because they were sitting inside the old "cannot be run on this test system" column. They now have **their own column** so they can be named and picked up when the feature lands. |
| **A tool flag does not reduce the ready figure unless the tool is something automation genuinely cannot provide** | **−1 case.** 50 of the 51 tool-flagged cases stay **inside** the figure. Exactly one is taken out: the QuickBooks case, which needs an outside account we cannot obtain. It had wrongly been counted as ready. |

**Why not-built cases are left out.** **The feature is not in the product yet, so an automated test for
it could only fail.** An engineer who wrote these six would find nothing to test, get six red results,
and spend time investigating a fault that does not exist. They stay counted as test cases — they are
still in the 469 — they are simply not counted as automatable. **Pick them up when the feature lands.**

**The six not-built cases left out of 401, named in full so they can be picked up later.** All six are
the Sales Representative **Assignments export**, which does not exist on this build. All six were
re-observed on the current build and are unchanged (`viu-2026-08-03/RECHECK-QUEUE.md`, per-case rows;
`recheck-2026-08-04/per-case-recheck-verdicts.csv`).

| Case | C-id | Link | What is missing from the product |
|---|---|---|---|
| SBR-ASGN-01 | C30292 | https://shopview.testrail.io/index.php?/cases/view/30292 | The Sales Representative Assignments export has not been built |
| SBR-ASGN-02 | C30293 | https://shopview.testrail.io/index.php?/cases/view/30293 | No assignments export file exists to check |
| SBR-ASGN-03 | C30294 | https://shopview.testrail.io/index.php?/cases/view/30294 | No assignments export file exists to check |
| SBR-ASGN-04 | C30295 | https://shopview.testrail.io/index.php?/cases/view/30295 | No assignments screen to read the export back from |
| SBR-ASGN-05 | C30296 | https://shopview.testrail.io/index.php?/cases/view/30296 | No assignments export file exists to check |
| SBR-ASGN-06 | C30297 | https://shopview.testrail.io/index.php?/cases/view/30297 | No assignments export file exists to check |

**The fourteen cases that could not be set up on this test system, named in full:**

| Case | C-id | Link | Why it could not be set up here |
|---|---|---|---|
| SBR-DEACT-02 | C30253 | https://shopview.testrail.io/index.php?/cases/view/30253 | Needs an invoice created on this estate, and creating one fails with a server error ([SV-8821](https://shopview.atlassian.net/browse/SV-8821)) |
| SBR-DEACT-03 | C30254 | https://shopview.testrail.io/index.php?/cases/view/30254 | Same — invoice creation fails on this estate |
| SBR-DEACT-04 | C30255 | https://shopview.testrail.io/index.php?/cases/view/30255 | Same — invoice creation fails on this estate |
| SBR-DEACT-05 | C30256 | https://shopview.testrail.io/index.php?/cases/view/30256 | Same — invoice creation fails on this estate |
| SBR-DEACT-06 | C30257 | https://shopview.testrail.io/index.php?/cases/view/30257 | Same — invoice creation fails on this estate |
| SBR-DEACT-07 | C30258 | https://shopview.testrail.io/index.php?/cases/view/30258 | Same — invoice creation fails on this estate |
| SBR-DEACT-08 | C30259 | https://shopview.testrail.io/index.php?/cases/view/30259 | Same — invoice creation fails on this estate |
| SBR-DEACT-09 | C30260 | https://shopview.testrail.io/index.php?/cases/view/30260 | Same — invoice creation fails on this estate |
| WIP-API-01 | C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 | The nightly figures are written by a background job and no screen reads them back |
| WIP-API-03 | C30530 | https://shopview.testrail.io/index.php?/cases/view/30530 | Same — nothing in the product reads the value back |
| WIP-API-04 | C30531 | https://shopview.testrail.io/index.php?/cases/view/30531 | Same — nothing in the product reads the value back |
| WIP-API-06 | C30533 | https://shopview.testrail.io/index.php?/cases/view/30533 | Same — nothing in the product reads the value back |
| IV-API-05 | C30609 | https://shopview.testrail.io/index.php?/cases/view/30609 | Needs more than a year of stored history; this test system holds about six days |
| IV-API-06 | C30610 | https://shopview.testrail.io/index.php?/cases/view/30610 | Same — not enough stored history on this test system |

**The one case blocked by an outside account we do not have:** PV-PREC-02 =
[C38925](https://shopview.testrail.io/index.php?/cases/view/38925). It reads the journal entry
QuickBooks created for an invoice and checks the amount to the cent. Its own preconditions say:
*"This test cannot be run without a company whose QuickBooks account is connected, because it checks
what was sent to QuickBooks. If no QuickBooks-connected company is available, mark this test Blocked
and say so — do not guess the result."* **That is the evidence for its column, and it is the reason it
is the only case taken out of the ready figure for a tool.**

## Can a manual tester run them? — ONE set of buckets, so there is nothing to argue with

**These buckets answer a different question from the table above: not "did it pass" but "can a person
carry the steps out and record a real result on this test system today".** Every case sits in exactly
one of them, and they add up to 469.

| Can a manual tester run it here, today? | Cases | What they need |
|---|---:|---|
| **Yes — nothing to install** | **448** | A browser. Nothing else. **51 of these 448 are easier with a free or built-in tool** (the browser's own developer tools, a screen reader that ships with the operating system, or a PDF viewer's search box) — that is a **flag**, listed below, and it is **not** a reason a person cannot run them. |
| **No — blocked by data or environment on this test system** | **14** | The starting state cannot be created here. The case tells the tester to mark it **Blocked**. |
| **No — the feature is not built** | **6** | There is nothing on the screen to test. The case tells the tester to mark it **Blocked**. |
| **No — needs an outside account we do not have** | **1** | A QuickBooks-connected test company. The case tells the tester to mark it **Blocked**. |
| **Total** | **469** | |

**448 + 14 + 6 + 1 = 469.** And the two figures in this report relate to each other by one line of
arithmetic, so they cannot be set against each other:

> **Ready to automate (401) = runnable by a manual tester here (448) − waiting on Chris Ward (47).**

**A case can be perfectly runnable by a person and still not safe to automate.** That is the whole of
the difference between 448 and 401: the 47 cases whose expected result Chris Ward could still change.
A person running one of those today gets a real, useful result; an automated test written today could
bake in the wrong answer and then keep passing for months.

## FLAGS — extra notes on some cases, NOT outcomes

**These are FLAGS, not outcomes.** A flag is an extra property of a case. **A flagged case still sits
in exactly one outcome column above, and flag counts must never be added into the table.** Flags can
overlap each other and they can apply to a case in any outcome column. Every case carrying each flag
is named below, with the outcome column it lives in.

### Flag A — the case is easier with a free or built-in tool: 51 cases

**Every one of these 51 can be run by a manual tester today, and 50 of them need nothing that is not
already on the machine.** The tool makes the *technical layer* of the check exact; it is not a barrier.
**50 of the 51 are inside the 401.** The one exception is the QuickBooks case, and it is taken out
through its own outcome column, not through this flag.

| What it needs | Cases | Do you have to install anything? | Can an automated test do it? |
|---|---:|---|---|
| **The browser's own developer tools** — press F12 and use the Network tab, the element inspector, or the throttling dropdown | **39** | **No.** Built into Chrome, Edge and Firefox. | **Yes, and more easily than a person.** A script reads a request, a colour or a size directly and gets the same answer every time. **Not subtracted.** |
| **A screen reader** — to check what a person using one would hear | **10** | **No, or free.** VoiceOver ships with macOS (Cmd+F5); NVDA is free on Windows. | **Yes. A screen reader is software, not a device — and you do not even need one.** What these cases actually check is the name each control announces, and the browser's own Accessibility panel shows exactly those names; an automated test reads the same accessibility tree directly. **Decided explicitly: NOT subtracted.** |
| **Reading the text inside a PDF** | **1** | **No.** Any PDF viewer's own search box (Ctrl+F). | **Yes.** Reading text out of a PDF is ordinary work for an automated test. **Not subtracted.** |
| **A QuickBooks connection** | **1** | **Yes — and this is the only genuine gap.** It needs a test company whose QuickBooks account is connected, plus sign-in to that company. We do not have one. | **No.** This is an outside account that cannot be obtained, which is exactly what the shared rule allows to be taken out. **Subtracted — once, through its own outcome column.** |
| **Total** | **51** | | |

**The 39 that need the browser's developer tools:**

| Case | C-id | Link | Outcome column it lives in |
|---|---|---|---|
| SBC-EXP-06 | C30164 | https://shopview.testrail.io/index.php?/cases/view/30164 | Work correctly |
| SBC-EXP-11 | C30169 | https://shopview.testrail.io/index.php?/cases/view/30169 | Work correctly |
| SBC-EMPTY-01 | C30181 | https://shopview.testrail.io/index.php?/cases/view/30181 | Work correctly |
| SBC-EMPTY-04 | C30184 | https://shopview.testrail.io/index.php?/cases/view/30184 | Work correctly |
| SBC-VIS-02 | C30186 | https://shopview.testrail.io/index.php?/cases/view/30186 | Waiting on an answer from Chris Ward |
| SBC-API-01 | C30190 | https://shopview.testrail.io/index.php?/cases/view/30190 | Work correctly |
| SBC-API-02 | C30191 | https://shopview.testrail.io/index.php?/cases/view/30191 | Work correctly |
| SBC-API-03 | C30192 | https://shopview.testrail.io/index.php?/cases/view/30192 | Work correctly |
| SBC-API-04 | C30193 | https://shopview.testrail.io/index.php?/cases/view/30193 | Work correctly |
| SBC-API-05 | C30194 | https://shopview.testrail.io/index.php?/cases/view/30194 | Product is wrong |
| SBC-API-06 | C43546 | https://shopview.testrail.io/index.php?/cases/view/43546 | Work correctly |
| SBR-EXP-14 | C30289 | https://shopview.testrail.io/index.php?/cases/view/30289 | Work correctly |
| SBR-STATE-03 | C30300 | https://shopview.testrail.io/index.php?/cases/view/30300 | Work correctly |
| SBR-STATE-04 | C30301 | https://shopview.testrail.io/index.php?/cases/view/30301 | Work correctly |
| SBR-MOB-03 | C30304 | https://shopview.testrail.io/index.php?/cases/view/30304 | Work correctly |
| SBR-API-01 | C30316 | https://shopview.testrail.io/index.php?/cases/view/30316 | Work correctly |
| SBR-API-02 | C30317 | https://shopview.testrail.io/index.php?/cases/view/30317 | Work correctly |
| SBR-API-03 | C30318 | https://shopview.testrail.io/index.php?/cases/view/30318 | Work correctly |
| SBR-API-04 | C30319 | https://shopview.testrail.io/index.php?/cases/view/30319 | Work correctly |
| SBR-API-05 | C30320 | https://shopview.testrail.io/index.php?/cases/view/30320 | Product is wrong |
| SBR-API-06 | C30321 | https://shopview.testrail.io/index.php?/cases/view/30321 | Work correctly |
| PV-API-01 | C30388 | https://shopview.testrail.io/index.php?/cases/view/30388 | Work correctly |
| PV-API-02 | C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 | Work correctly |
| PV-API-03 | C30390 | https://shopview.testrail.io/index.php?/cases/view/30390 | Work correctly |
| PV-API-04 | C30391 | https://shopview.testrail.io/index.php?/cases/view/30391 | Work correctly |
| TU-DAY-02 | C30419 | https://shopview.testrail.io/index.php?/cases/view/30419 | Work correctly |
| TU-TECH-02 | C30424 | https://shopview.testrail.io/index.php?/cases/view/30424 | Work correctly |
| TU-API-01 | C30449 | https://shopview.testrail.io/index.php?/cases/view/30449 | Work correctly |
| TU-API-02 | C30450 | https://shopview.testrail.io/index.php?/cases/view/30450 | Work correctly |
| WIP-EXP-09 | C30518 | https://shopview.testrail.io/index.php?/cases/view/30518 | Work correctly |
| WIP-API-01 | C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 | Could not be set up on this test system |
| WIP-API-03 | C30530 | https://shopview.testrail.io/index.php?/cases/view/30530 | Could not be set up on this test system |
| WIP-API-04 | C30531 | https://shopview.testrail.io/index.php?/cases/view/30531 | Could not be set up on this test system |
| WIP-API-06 | C30533 | https://shopview.testrail.io/index.php?/cases/view/30533 | Could not be set up on this test system |
| IV-API-01 | C30605 | https://shopview.testrail.io/index.php?/cases/view/30605 | Work correctly |
| IV-API-02 | C30606 | https://shopview.testrail.io/index.php?/cases/view/30606 | Work correctly |
| IV-API-03 | C30607 | https://shopview.testrail.io/index.php?/cases/view/30607 | Work correctly |
| IV-API-05 | C30609 | https://shopview.testrail.io/index.php?/cases/view/30609 | Could not be set up on this test system |
| IV-API-06 | C30610 | https://shopview.testrail.io/index.php?/cases/view/30610 | Could not be set up on this test system |

**The 10 that are easier with a screen reader:**

| Case | C-id | Link | Outcome column it lives in |
|---|---|---|---|
| SBR-VIS-03 | C30307 | https://shopview.testrail.io/index.php?/cases/view/30307 | Work correctly |
| SBR-VIS-04 | C30308 | https://shopview.testrail.io/index.php?/cases/view/30308 | Work correctly |
| TU-ELL-04 | C30407 | https://shopview.testrail.io/index.php?/cases/view/30407 | Work correctly |
| TU-SORT-01 | C30409 | https://shopview.testrail.io/index.php?/cases/view/30409 | Work correctly |
| TU-DAY-01 | C30418 | https://shopview.testrail.io/index.php?/cases/view/30418 | Work correctly |
| TU-DAY-04 | C30421 | https://shopview.testrail.io/index.php?/cases/view/30421 | Work correctly |
| WIP-VIS-06 | C30524 | https://shopview.testrail.io/index.php?/cases/view/30524 | Work correctly |
| IV-VIS-06 | C30601 | https://shopview.testrail.io/index.php?/cases/view/30601 | Work correctly |
| IV-VIS-07 | C30602 | https://shopview.testrail.io/index.php?/cases/view/30602 | Work correctly |
| TU-COL-01 | C38859 | https://shopview.testrail.io/index.php?/cases/view/38859 | Work correctly |

**The 1 that needs to read the text inside a PDF:**

| Case | C-id | Link | Outcome column it lives in |
|---|---|---|---|
| SBR-EXP-08 | C30283 | https://shopview.testrail.io/index.php?/cases/view/30283 | Work correctly |

**The 1 that needs a QuickBooks connection:**

| Case | C-id | Link | Outcome column it lives in |
|---|---|---|---|
| PV-PREC-02 | C38925 | https://shopview.testrail.io/index.php?/cases/view/38925 | Blocked by an outside account we do not have |

**All 51 accounted for: 39 + 10 + 1 + 1 = 51**, and the enumerated lists above hold exactly 39, 10, 1
and 1 rows.

### Flag B — the product is ALSO wrong on this case, and a ticket is open: 2 cases

**These two cases are in the "Waiting on an answer from Chris Ward" column, and they also have a real,
ticketed product fault.** Both facts are true, and the case is counted **once**.

**Why the waiting column wins:** the columns are ordered by what stops you automating. **If the right
answer is not settled, that outranks a known fault — you cannot write the case's expected result at
all until Chris answers.** So the wait decides the column, and the open ticket is carried here as a
flag so nothing is lost. **Both cases are named, both tickets are named, and neither is counted twice
anywhere.**

| Case | C-id | Link | Outcome column it lives in | The open ticket on it | Evidence for the column |
|---|---|---|---|---|---|
| IV-DATE-04 | C30564 | https://shopview.testrail.io/index.php?/cases/view/30564 | Waiting on an answer from Chris Ward | [SV-8820](https://shopview.atlassian.net/browse/SV-8820) — Inventory Value values stock one day late | Listed in the held set in `corrections-2026-08-04/data/readiness-sets.json`; the DO-NOT-AUTOMATE line was written onto it per `automation-hold-2026-08-04/AUTOMATION-HOLD.md` |
| IV-EXP-02 | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 | Waiting on an answer from Chris Ward | [SV-8823](https://shopview.atlassian.net/browse/SV-8823) — the Inventory Value spreadsheet ignores the columns you chose, and money arrives as text | `automation-hold-2026-08-04/AUTOMATION-HOLD.md` quotes this case's own text in full, showing the DO-NOT-AUTOMATE line on it; the product-is-wrong half is recorded in `corrections-2026-08-04/CORRECTION-1-SV-8823.md` |

**Both cases will move column once Chris answers.** [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) is one of the 39 cases whose wait is
already resolved by his answers of 5 August, so when those staged edits are executed it moves into
**Product is wrong** and stays an expected red until [SV-8823](https://shopview.atlassian.net/browse/SV-8823)
is fixed. **[C30564](https://shopview.testrail.io/index.php?/cases/view/30564) stays waiting** — his answers do not cover it.

## LEGEND — the points that get misread

**Read these before drawing any conclusion from the table.**

- **A case in the "Product is wrong" column is a GOOD case.** The **case** is correct; the **product**
  is wrong. **A ticket is open and named on the case itself, for all 16.** **A FAIL there is the
  expected result** until the ticket is fixed. Nothing in that column means our test case is faulty —
  those are the cases that *caught* the faults. Do not raise a new ticket for them, do not treat the
  case as broken, and **do not leave them out of automation**: they are inside the 401.
- **A flagged "needs a tool" case CAN be run by a manual tester today, with nothing to install, and it
  does NOT reduce the ready figure.** The tools involved are the browser's own developer tools, a
  screen reader that already ships with the operating system, or a PDF viewer's search box. It is a
  note for whoever runs the case by hand — **not** something that stops a person testing it, and
  **not** a reason to leave it out of automation, because **a script reads a size, a colour or a
  network request more easily than a person can.** The single exception is the QuickBooks case, and
  that is taken out through its own outcome column, not through this flag.
- **Outcomes partition; flags overlap.** A case has exactly one outcome. It can carry any number of
  flags, or none. **Never add a flag count into a table row** — that is what made the old version of
  this report look as though rows did not add up.

## The re-check after the redeploy — a coverage figure, not an outcome

This is a **separate question** from the table above: after the 4 August redeploy, how much did we
re-observe rather than carry over? **All 469 fell due and all 469 were dealt with.**

| | Cases |
|---|---:|
| **Re-observed on the new build, unchanged** | **451** |
| **Re-observed and something had changed** — a reportable finding | **4** |
| **Could not be re-driven, and not claimed as checked** | **14** |
| **Total** | **469** |

**451 + 4 + 14 = 469.** The **14** are the eight Sales-Representative deactivation cases and the six
assignments-export cases — the same 14 that sit in the "could not be set up here" and "not built yet"
columns of the main table, so the two tables agree. The **4** that changed were three Parts Velocity
Turns/Yr cases (the fault is fixed) and one Inventory Value export case whose wording was corrected
the same run. Source: `recheck-2026-08-04/per-case-recheck-verdicts.csv`, one row per case.

**This is about re-checking, not about passing or failing.** It is stated here, away from the outcome
table, precisely so it cannot be mistaken for one.

## What is still wrong in the product — and all of it is ticketed

**To be clear: this section is about faults in the PRODUCT, not faults in our test cases.** Every one
is ticketed, and the cases that catch them are correct cases.

**The "Cases" column below counts every case that NAMES the ticket. That is a flag-style count, and it
is NOT the same thing as the 16 in the "product is wrong" column** — two of the cases naming a ticket
sit in the waiting column instead (Flag B above). The two reconcile like this: **10 + 4 + 4 = 18 cases
name a ticket; 16 of them are in the "product is wrong" column and 2 are in the waiting column.**

| Ticket | What is wrong | Cases naming it | Of those, in "product is wrong" |
|---|---|---:|---:|
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | Downloading a PDF still fails on a large report — Parts Velocity, the long Technician Utilization download and Inventory Value all fail after 30–45 seconds. The spreadsheet version of the same report works, and the PDF works once you narrow it down. **Still Open.** | 10 | 10 |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value still values stock one day late — ask for 31 July and it reports 1 August. **Still Open.** | 4 | 3 *(the fourth is [C30564](https://shopview.testrail.io/index.php?/cases/view/30564), in the waiting column)* |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | The Inventory Value spreadsheet ignores the columns you chose, and money arrives as text. **Re-opened**, confirmed Open. | 4 | 3 *(the fourth is [C30588](https://shopview.testrail.io/index.php?/cases/view/30588), in the waiting column)* |

**Four cases had a false "known and accepted" line removed.** Earlier on 4 August the Inventory Value
spreadsheet problem was closed as accepted, and one case was given a line saying so. **That ticket has
since been re-opened**, so the sentence was false. Four cases now carry the normal wording used
everywhere else — *"Known issue: the product does not currently do this. It has been filed for a fix
here: https://shopview.atlassian.net/browse/SV-8823"* — and **none of them was weakened**: they are
the cases that found the problem, so they keep asking for the right thing and are expected to come out
red until it is fixed. They are [C30162](https://shopview.testrail.io/index.php?/cases/view/30162)
(Sales By Customer), [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) (Sales By
Representative), [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) and
[C30589](https://shopview.testrail.io/index.php?/cases/view/30589) (both Inventory Value).

**And one piece of good news: a fault was fixed.** The "Turns / Yr" figure on Parts Velocity was being
worked out over a period one day too short whenever the **This Year** shortcut was used, so the number
came out too high. **That is fixed** — the shortcut and the same dates picked by hand now give exactly
the same figure, measured across 500 rows for every date shortcut. The known-issue line was taken off
[C30367](https://shopview.testrail.io/index.php?/cases/view/30367) and
[C30374](https://shopview.testrail.io/index.php?/cases/view/30374). Its ticket,
[SV-8819](https://shopview.atlassian.net/browse/SV-8819), **now reads Done in Jira** — so the ticket
and the build agree.

### Two things worth knowing before you code against the downloads

**We checked all six reports, not just the one the ticket names — and the problem is wider than the
ticket's title says.**

**Money arrives as text on five of the six reports.** Inventory Value, Sales By Customer, Sales By
Representative, Parts Velocity and Work In Progress all write money as `$11,176.88` — a dollar sign,
and a comma once the value passes a thousand. **Only Technician Utilization writes plain numbers.** So
**anything doing sums on a download must strip the `$` and the commas first.** The amounts themselves
are correct — 55,584 cells were checked against the reports' own figures and not one value was wrong.

**The "give me only these columns" instruction is ignored on three reports** — Inventory Value, Sales
By Customer and Sales By Representative. Asking for three columns, or for a column that does not
exist, returns **exactly the same file**, with no error. **Parts Velocity, Technician Utilization and
Work In Progress get it right** and reject a bad column name properly. Only Inventory Value has a case
that fails on this, because Sales By Customer and Sales By Representative have no column picker for a
user to choose from in the first place — but **the fault is real on all three**, and it is on the
outstanding list below.

## What the automation engineer should SKIP, and why — 68 cases

**1 · The 47 cases waiting on an answer from Chris Ward.** Each one says so in its own expected
results and links the question sheet. **Skip anything carrying the "DO NOT AUTOMATE YET" line — you
need no other list.** *(Read the next section before planning around this number: most of these are
about to be released.)*

**2 · The 14 cases that could not be set up on this test system** — the eight Sales-Representative
deactivation cases (invoice creation fails here), the four Work In Progress nightly-figure cases (no
screen reads the value back) and the two Inventory Value cases needing over a year of stored history.
All fourteen are named in full above.

**3 · The 6 not-built cases** — the Sales Representative Assignments export, named in full above. The
feature does not exist on this build, so an automated test for it could only fail. **They are OUTSIDE
the 401** — pick them up when it lands.

**4 · The 1 QuickBooks case** — PV-PREC-02 =
[C38925](https://shopview.testrail.io/index.php?/cases/view/38925). It needs a test company with
QuickBooks actually connected. **It is OUTSIDE the 401.**

**The 16 "product is wrong" cases are NOT on this skip list.** Automate them and expect red — that
red is the correct result, and every one of the 16 names its ticket.

## IMPORTANT SEQUENCING — 46 case edits are staged but NOT executed, and they will RAISE this figure

**Chris Ward answered on 5 August, and 46 case edits have been fully prepared from his answers —
but nothing has been written to TestRail.** Standing Rule 6 is absolute: no TestRail write without the
QA lead's explicit permission, and it has not been given for this pass. The plan is in
`build/report-suite/chris-answers-2026-08-05/` (`testrail-sync-manifest.md` and
`staged-operations.json`, one byte-exact payload per case). **46 `update_case`, 0 adds, 0 deletes, 0
test-run writes.**

**Every figure in this report is today's true figure, measured against TestRail exactly as it stands
now.** Nothing from those staged edits has been pre-applied — doing that would report a state that
does not exist.

**What happens the moment they are executed:**

- **39 of the 47 waiting cases lose their "DO NOT AUTOMATE YET" line**, because his answers settle
  them. The waiting column drops from **47 to 8**.
- **The ready-to-automate figure rises from 401 to 440.** Same formula: 469 − 8 − 14 − 6 − 1 = **440**.
- **One of the 39 is [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)**, so it also moves out of the waiting column into **Product is wrong**,
  taking that column from 16 to 17. The other 38 move into **Work correctly**, taking it from 385 to
  423. **The total stays 469** and every row still adds up: 423 + 17 + 8 + 14 + 6 + 1 = 469.
- **The 8 cases still waiting afterwards** would be SBC-NAV-01 =
  [C30096](https://shopview.testrail.io/index.php?/cases/view/30096), SBC-VIS-02 =
  [C30186](https://shopview.testrail.io/index.php?/cases/view/30186), SBR-WO-01 =
  [C30310](https://shopview.testrail.io/index.php?/cases/view/30310), SBR-WO-06 =
  [C30315](https://shopview.testrail.io/index.php?/cases/view/30315), TU-EXP-07 =
  [C30440](https://shopview.testrail.io/index.php?/cases/view/30440), WIP-SUM-05 =
  [C30491](https://shopview.testrail.io/index.php?/cases/view/30491), WIP-FLT-05 =
  [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) and IV-DATE-04 =
  [C30564](https://shopview.testrail.io/index.php?/cases/view/30564).

**So the honest position is: 401 today, 440 the moment you authorise the staged push.** The 39 are the
single biggest thing standing between the automation engineer and the rest of this suite.

## HONEST LIMITS — what this did NOT cover

- **The branch is still not final.** Engineering has not withdrawn that, and the 4 August deploy proved
  the point. So these results are **provisional**: good enough to automate against today, but every one
  stays on the re-check list for the next time the build moves. That list is
  `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` and it **stays open**.
- **We re-observed the surfaces the cases read — we did not hand-run 469 test scripts.** All 36
  download surfaces, all six screens' columns and menus, all six column pickers, every error message
  and every calculation were re-driven and compared. That covers what the cases assert. It is not the
  same as executing every case by hand, and we will not describe it as if it were.
- **One question is still genuinely open**: whether the Location filter should disappear for a user
  who can only see one location. We proved the **download** behaves correctly. Proving what the
  **filter** does needs a user account restricted to a single location, which we did not create.
- **One counting error of our own was found by this pass and is not being smoothed over.** The
  QuickBooks case was being counted as ready to automate although its own text tells the tester to mark
  it Blocked. That is why the figure is 401 and not 402.
- **A second, smaller one.** The note that used to sit under this table named **one** case as being
  counted in two columns. It was **two** — [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) as well as [C30588](https://shopview.testrail.io/index.php?/cases/view/30588). The legend beside it said "2", so
  the table and the legend disagreed. **Neither is a problem any more, because no case is in two
  columns.**

## Can the automation engineer start today?

**Yes — start on the 401.** They are stable, their wording matches the build running now, and every one
says on its own face which build and which specification version it was checked against. **Skip
anything carrying the "DO NOT AUTOMATE YET" line.** Treat the 16 in the "product is wrong" column as
expected failures — not new bugs, and not faulty test cases. **And do not let the tool flag put you
off:** 50 of those 51 cases need nothing but a browser, and an automated test finds them *easier* than
a person does.

**And plan for 440.** Authorising the staged push releases 39 more cases the same day.

## OUTSTANDING — what I need from you

1. **Authorise the 46 staged case edits from Chris Ward's answers.** They are prepared byte-exact in
   `build/report-suite/chris-answers-2026-08-05/` and **nothing has been written**. *(Blocks: 39 cases
   stay unautomatable, and the ready figure stays at 401 instead of 440. This is the single largest
   thing waiting on you.)*
2. **[SV-8823](https://shopview.atlassian.net/browse/SV-8823)'s title says "Inventory Value
   spreadsheet", but the behaviour is wider.** Money arrives as text on **five** of the six reports,
   and the chosen-columns instruction is ignored on **three**. **Should the ticket be widened to say
   so, or should a second ticket be raised?** I have not touched the ticket. *(Blocks: nothing today.
   It matters when someone fixes only the Inventory Value download and believes the job is finished.)*
3. **Chris Ward still owes answers on 8 cases** — the eight named in the sequencing section above.
   Outstanding since 2026-08-03. *(Blocks: those 8 cannot be automated without risking locking in the
   wrong behaviour.)*
4. **A test company with QuickBooks connected** would close the only genuine tool gap — one case,
   PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925). *(Blocks: one case,
   and it is the only case in the suite a manual tester cannot run for want of an account.)*
5. **A user account restricted to a single location** would settle the last open Location question.
   *(Blocks: one line of a coverage claim, nothing more.)*
6. **Tell us when the branch is declared final** — that is the trigger to re-run the whole re-check
   list and close it. *(Blocks: calling the suite finished at all.)*
7. **Nothing needed on the ready-figure rule — it is settled and applied.** The rule is now identical
   in all three readiness reports: not-built cases are left out, and a tool flag does not subtract
   unless the tool is something automation genuinely cannot provide. Applying it here moved this report
   from **402 to 401** (the QuickBooks case), left the not-built cases exactly where they already were,
   and left Schedule at **157** and Filters at **93**. **Nothing is needed from you here unless you
   disagree with that call.**

**Two earlier asks are now closed:** [SV-8819](https://shopview.atlassian.net/browse/SV-8819) has been
moved to Done, and the decision on the Inventory Value columns problem has been made — you re-opened
[SV-8823](https://shopview.atlassian.net/browse/SV-8823), and the four affected cases now point at it.

**And one earlier ask is withdrawn, because the structure removed it:** the old report asked you to
decide which column [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) belonged in. **It no longer needs a decision** — it sits in one column, the
open ticket is carried on it as a flag, and both facts are visible without either being counted twice.
