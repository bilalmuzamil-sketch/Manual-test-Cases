# REPORT SUITE — IS IT READY FOR AUTOMATION? · corrected later on 2026-08-04

**Short answer: yes. 402 of the 469 tests can be automated starting now**, and **468 of the 469
need nothing you do not already have on your machine.** The rest are listed below with the reason,
and nothing is hidden behind a vague label.

**Two things were wrong in the version of this report you read earlier today, and both are fixed
here.**

**1 · A column was misleading.** There was a column headed *"Needs a special tool"*, and it read as
though those tests could not be run. **That was wrong, and it was our fault for naming it badly.**
Almost every one of those tests needs something that is **already on your computer or free to
download**. The column is now named properly and the full breakdown is below.

**2 · A problem we had recorded as "accepted" has been re-opened, so four tests now say so.**
Details in the section after the table.

**Note added 5 August, after you read this: two column names have been changed again, because they
were still being misread — and one of them was still misleading in exactly the way you said.**

- *"Will fail because of a known open problem"* is now **"Product is wrong (ticket open) — the case
  correctly fails"**. It never meant that our test case was broken. It means **the product is wrong,
  the ticket is open, and the test correctly comes out red.**
- *"Needs a free or built-in tool"* is now **"Manual tester can run it; needs a tool only for
  automated checking"**. It never meant a manual tester could not run those tests. **They can, today,
  with nothing to install.**

**Only the labels and the legend changed. No number, no verdict and no finding was altered.**

---

## THE TABLE

| Report | Tests | Checked on the build running now | Product is wrong (ticket open) — the case correctly fails | Waiting on an answer from Chris Ward | Cannot be run on this test system | Manual tester can run it; needs a tool only for automated checking | **Can be automated now** |
|---|---:|---:|---:|---:|---:|---:|---|
| Sales By Customer | 84 | 84 | 3 | 9 | 0 | 11 | **75 of 84** |
| Sales By Representative | 111 | 97 | 3 | 9 | 14 | 13 | **88 of 111** |
| Parts Velocity | 71 | 68 | 2 | 4 | 0 | 5 | **67 of 71** |
| Technician Utilization | 59 | 59 | 1 | 5 | 0 | 9 | **54 of 59** |
| Work In Progress | 76 | 76 | 0 | 11 | 4 | 6 | **61 of 76** |
| Inventory Value | 68 | 67 | 9 | 9 | 2 | 7 | **57 of 68** |
| **TOTAL** | **469** | **451** | **18** | **47** | **20** | **51** | **402 of 469** |

## LEGEND — what every column above means, in plain words

**Read this before drawing any conclusion from the table.** Two of these column names were misread
last time, so they are now spelled out in full — and the two most important points are these:

- **A test in the "Product is wrong (ticket open)" column is a GOOD test.** The **test** is correct;
  the **product** is wrong. A ticket is already open and linked. **A FAIL there is the expected
  result** until the ticket is fixed. Nothing in that column means our test case is faulty.
- **A test in the "Manual tester can run it; needs a tool only for automated checking" column CAN be
  run by a manual tester today, with nothing to install.** The tool is what an *automated* check
  needs; it is not something that stops a person testing it. (One single test in that column — the
  QuickBooks one — is the one exception, and it is called out by name below.)

Column by column:

- **Report** — which of the six reports the row is about.
- **Tests** — how many test cases exist for that report.
- **Checked on the build running now** — we opened the real report on the build that is live at this
  moment and watched it behave.
- **Product is wrong (ticket open) — the case correctly fails** — **the test is right and the product
  is wrong**, and a ticket is already open. **Automate these and expect a red result** until the fix
  lands. Do not raise a new ticket for them. **16 of these 18 are inside the 402** — they run, they
  just come out red. The other 2 are also waiting on Chris Ward, so they sit in the next column
  instead. *(This column says nothing bad about the test case. It is the test case that caught the
  fault.)*
- **Waiting on an answer from Chris Ward** — we have asked him a product question and his answer
  could change what the test should expect. Automating now risks locking in the wrong answer. **Every
  one of these says so on its own face**, in these words: *"DO NOT AUTOMATE YET: this behaviour is
  waiting on an answer from the product owner."* If a test carries that line, skip it — you need no
  other list.
- **Cannot be run on this test system** — nothing to do with tools. Either the data cannot be created
  here, or no screen in the product reads the value back so there is nothing to look at.
- **Manual tester can run it; needs a tool only for automated checking** — **a manual tester can run
  these today on the machine they already have; nothing needs installing.** What the tool is for is
  the technical layer of the check — the browser's own developer tools (F12), a screen reader that is
  already built into the operating system, or any PDF viewer's search box. Full breakdown in the next
  section. **These tests are counted as automatable and they are included in the 402.** **The only
  genuine exception is the single QuickBooks test**, which needs a connected QuickBooks company we do
  not have — that one test tells the tester to mark it Blocked rather than guess.
- **Can be automated now** — the tests left once the two skip columns are set aside (the ones waiting
  on Chris Ward, and the ones that cannot be run on this test system). **The "product is wrong"
  column is NOT subtracted** — those tests are automated and expected to come out red.

**468 of the 469 tests can be run by a manual QA tester with free or built-in tools. Only one
cannot — the QuickBooks test — because that one needs a company whose QuickBooks account is
actually connected, and we do not have one.**

**Why these numbers differ from this morning's.** Two reasons, and the second one is an
embarrassment we are not going to dress up. First, four tests moved into the product-is-wrong column
(next section). Second, **the earlier per-report "ready" figures could not be reproduced from any
single rule** — we checked. They have been rebuilt from one stated rule, which is the rule written
above: *tests, minus those waiting on Chris Ward, minus those that cannot be run here.* This morning's
figures were 73 / 92 / 68 / 51 / 59 / 51, total 394. They are now 75 / 88 / 67 / 54 / 61 / 57, total
402. **The suite did not change size — the arithmetic got honest.**

---

## THE TOOL BREAKDOWN — 51 tests, and the honest position on each

| What it needs | Tests | Do you have to install anything? |
|---|---:|---|
| **The browser's own developer tools** — press F12 and use the "Network" tab, the element inspector, or the throttling dropdown | **39** | **No.** Built into Chrome, Edge and Firefox. |
| **A screen reader** — to check what a blind user would hear | **10** | **No, or free.** VoiceOver is already built into macOS (Cmd+F5). On Windows, NVDA is free. **And you do not have to listen to anything:** the browser's developer tools have an "Accessibility" panel that shows the same names. |
| **Reading the text inside a PDF** | **1** | **No.** Open the file in any PDF viewer and use its own search (Ctrl+F). |
| **A QuickBooks connection** | **1** | **Yes — and this is the only genuine gap.** It needs a test company whose QuickBooks account is connected, plus sign-in to that QuickBooks company. We do not have one. That test says so itself and tells the tester to mark it Blocked rather than guess. |
| **Total** | **51** | |

**So the true position is: 50 of these 51 need nothing you do not already have.** These counts were
counted from the tests themselves — each one names its tool in its own preconditions — not carried
over from the earlier report. **The earlier report said 52; the real number is 51.**

---

## THE FOUR TESTS THAT MOVED — a closed problem was re-opened

Earlier today a problem with the **Inventory Value spreadsheet** was closed as accepted, and one test
was given a line saying so: *"Known and accepted: the product behaves this way on purpose for now.
Do not raise this as a new problem."*

**That ticket has since been re-opened** ([SV-8823](https://shopview.atlassian.net/browse/SV-8823) —
confirmed Open). So that sentence was **false**, and it has been replaced. **Four tests** now carry
the normal wording used everywhere else:

> *Known issue: the product does not currently do this. It has been filed for a fix here:
> https://shopview.atlassian.net/browse/SV-8823*

| Test | Report | What it checks |
|---|---|---|
| [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | Sales By Customer | money in the spreadsheet should be a plain number |
| [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) | Sales By Representative | money in the spreadsheet should be a plain number |
| [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | Inventory Value | the spreadsheet should carry the columns you chose, in the order shown on screen |
| [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | Inventory Value | money in the spreadsheet should be a plain number |

**None of these tests was weakened.** They are the tests that found the problem, so they keep asking
for the right thing and **they are expected to come out red** until it is fixed. That is what the
"Product is wrong (ticket open) — the case correctly fails" column is for.

### Two things worth knowing before you code against the downloads

**We checked all six reports, not just the one the ticket names — and the problem is wider than the
ticket's title says.**

**Money arrives as text on five of the six reports.** Inventory Value, Sales By Customer, Sales By
Representative, Parts Velocity and Work In Progress all write money as `$11,176.88` — a dollar sign,
and a comma once the value passes a thousand. **Only Technician Utilization writes plain numbers.**
So **anything doing sums on a download must strip the `$` and the commas first.** The amounts
themselves are correct — 55,584 cells were checked against the reports' own figures and not one value
was wrong.

**The "give me only these columns" instruction is ignored on three reports** — Inventory Value, Sales
By Customer and Sales By Representative. Asking for three columns, or for a column that does not
exist, returns **exactly the same file**, with no error. **Parts Velocity, Technician Utilization and
Work In Progress get it right** and reject a bad column name properly. Only Inventory Value has a test
that fails on this, because Sales By Customer and Sales By Representative have no column picker for a
user to choose from in the first place — but **the fault is real on all three**, and it is on the
outstanding list below.

---

## WHAT IS STILL WRONG IN THE PRODUCT — and all of it is ticketed

**To be clear: this section is about faults in the PRODUCT, not about faults in our test cases.**
Every one of these is ticketed, and the tests that catch them are correct tests.

- **Downloading a PDF still fails on a large report**
  ([SV-8818](https://shopview.atlassian.net/browse/SV-8818), still Open). Parts Velocity, the long
  Technician Utilization download and Inventory Value all fail after 30–45 seconds. The spreadsheet
  version of the very same report works, and the PDF works once you narrow it down. **10 tests will
  fail on this — expected.**
- **Inventory Value still values stock one day late**
  ([SV-8820](https://shopview.atlassian.net/browse/SV-8820), still Open). Ask for 31 July and it
  reports 1 August. **4 tests will fail on this — expected.**
- **The Inventory Value spreadsheet ignores the columns you chose, and money arrives as text**
  ([SV-8823](https://shopview.atlassian.net/browse/SV-8823), **re-opened**). **4 tests will fail on
  this — expected.**

**And one piece of good news: a bug was fixed today.** The "Turns / Yr" figure on Parts Velocity was
being worked out over a period one day too short whenever you used the **This Year** shortcut, so the
number came out too high. **That is fixed** — the shortcut and the same dates picked by hand now give
exactly the same figure, measured across 500 rows for every date shortcut. The two tests are
[C30367](https://shopview.testrail.io/index.php?/cases/view/30367) and
[C30374](https://shopview.testrail.io/index.php?/cases/view/30374), and the "known issue" line has
been taken off both. **Its ticket, [SV-8819](https://shopview.atlassian.net/browse/SV-8819), now
reads Done in Jira** — so the ticket and the build agree. (This morning's report asked for that to be
done; it has been.)

---

## WHAT TO SKIP, AND WHY — 67 tests

**1 · The 47 tests waiting on Chris Ward.** Each says so in its own expected results and links the
question sheet. **We counted these on the live build this run: 47, all still present.**

**2 · The 20 tests that cannot be run on this test system.**
- **14 Sales-Representative tests** about switching a representative off, and the assignments
  download. Creating an invoice on this test system fails with a server error, and the assignments
  download is not built. **We could not re-check these and we are not claiming we did.**
- **4 Work In Progress tests** about the nightly figures — written by a background job that no screen
  reads back, so there is nothing for a test to look at.
  [C30528](https://shopview.testrail.io/index.php?/cases/view/30528),
  [C30530](https://shopview.testrail.io/index.php?/cases/view/30530),
  [C30531](https://shopview.testrail.io/index.php?/cases/view/30531),
  [C30533](https://shopview.testrail.io/index.php?/cases/view/30533).
- **2 tests** that need more than a year of stored history — this test system holds about six days.
  [C30609](https://shopview.testrail.io/index.php?/cases/view/30609),
  [C30610](https://shopview.testrail.io/index.php?/cases/view/30610).

**The 18 "product is wrong (ticket open)" tests are NOT on this skip list.** Automate them and
expect red — that red is the correct result.

---

## HONEST LIMITS — what this did NOT cover

- **The branch is still not final.** Engineering has not withdrawn that, and today's deploy proved the
  point. So these results are **provisional**: good enough to automate against today, but every one
  stays on the re-check list for the next time the build moves. That list is
  `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` and it **stays open**.
- **We re-observed the surfaces the tests read — we did not hand-run 469 test scripts.** All 36
  download surfaces, all six screens' columns and menus, all six column pickers, every error message
  and every calculation were re-driven and compared. That covers what the tests assert. It is not the
  same as executing every test by hand, and we will not describe it as if it were.
- **One question is still genuinely open**: whether the Location filter should disappear for a user
  who can only see one location. We proved the **download** behaves correctly. Proving what the
  **filter** does needs a user account restricted to a single location, which we did not create.

---

## CAN THE AUTOMATION ENGINEER START TODAY?

**Yes — start on the 402.** They are stable, their wording matches the build running now, and every
one says on its own face which build and which specification version it was checked against. **Skip
anything carrying the "DO NOT AUTOMATE YET" line.** Treat the 18 in the "product is wrong (ticket
open)" column as expected failures, not new bugs, and not as faulty test cases. **And do not let the tool column put you off** — 50 of those 51 tests need
nothing but your browser or a free download.

---

## OUTSTANDING — what I need from you

1. **[SV-8823](https://shopview.atlassian.net/browse/SV-8823)'s title says "Inventory Value spreadsheet", but the behaviour is wider.** Money arrives
   as text on **five** of the six reports, and the chosen-columns instruction is ignored on **three**.
   **Should the ticket be widened to say so, or should a second ticket be raised?** I have not touched
   the ticket. *(Blocks: nothing today. It matters when someone fixes only the Inventory Value
   download and believes the job is finished.)*
2. **One test, [C30588](https://shopview.testrail.io/index.php?/cases/view/30588), is in two columns
   at once** — filed as "product is wrong (ticket open)" *and* still carrying the "waiting on Chris Ward" line. I left
   the line on because I cannot show Chris has answered the question behind it. **Tell me if you want
   it moved cleanly into the "product is wrong (ticket open)" column** and I will take the line off. *(Blocks: nothing;
   it makes one row of the table above slightly ambiguous.)*
3. **Chris Ward still owes answers on 47 tests.** Outstanding since 2026-08-03. *(Blocks: those 47
   cannot be automated without risking locking in the wrong behaviour.)*
4. **A test company with QuickBooks connected** would close the only genuine tool gap — one test.
   *(Blocks: one test.)*
5. **A user account restricted to a single location** would settle the last open Location question.
   *(Blocks: one line of a coverage claim, nothing more.)*
6. **Tell us when the branch is declared final** — that is the trigger to re-run the whole re-check
   list and close it. *(Blocks: calling the suite finished at all.)*

**Two earlier asks are now closed:** [SV-8819](https://shopview.atlassian.net/browse/SV-8819) has been moved to Done, and the decision on the
Inventory Value columns problem has been made — you re-opened [SV-8823](https://shopview.atlassian.net/browse/SV-8823), and the four affected tests
now point at it.
