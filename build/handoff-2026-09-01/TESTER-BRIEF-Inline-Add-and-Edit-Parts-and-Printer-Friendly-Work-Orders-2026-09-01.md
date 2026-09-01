# Two suites ready for you to run — 1 September 2026

**For:** Viktoria Videnovic, manual QA  ·  **From:** the build-verification pass finished today
**Where to test:** https://sv9315.qa.shopview.com  ·  **Version checked:** v26.35.6-598cc8a

---

## Read this first

**If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.**

Every test in these two lists has been opened and read today, and the instructions inside it have
been rewritten so you can follow them from the screen — where to start, which record to open, which
tab, and where on the page the thing you are checking appears. If you hit a step you cannot follow,
that is a mistake on our side, not yours: mark the test Blocked and say which step stopped you.

**A few tests are expected to fail, and they say so in plain words.** For those:

- You see exactly what the test describes → mark it **Failed** and raise nothing new.
- You see something **different** → that is a **new** problem. Please report it.
- It **passes** → the fix has shipped. Tell the QA lead so the ticket can be closed.

**Nothing in either list has a result recorded against it yet.** Both runs are empty, so every
result in them will be yours. Nobody has pre-marked anything as Passed on your behalf.

**You do not have to keep this page open.** Every test that cannot be run here yet says so inside
the test itself, in the same words as the table below, at the end of its Expected Results. So if you
work straight from the run and never look at this page again, you will still be told.

**One honest warning about the numbers below.** "Tests to run" counts tests whose steps can be
followed on this version. It is **not** a claim that the feature is fully covered, and it is **not**
a claim that anything passed. What we found when we ran them ourselves is in the accompanying
spreadsheet, and you should still form your own verdict on every test.

---

## The short version

| Feature | Tests you can run | of which: only part of it runs today | Tests to leave alone for now | Total in the area | Where to record your results |
|---|---|---|---|---|---|
| Inline Add and Edit Parts | **114** | 2 | 5 | 119 | Run 418 — [open it](https://shopview.testrail.io/index.php?/runs/view/418) |
| Printer Friendly Work Orders | **37** | 1 | 7 | 44 | Run 419 — [open it](https://shopview.testrail.io/index.php?/runs/view/419) |
| **Both together** | **151** | **3** | **12** | **163** | |

"Tests you can run" plus "tests to leave alone" equals the total on every row — 151 + 12 = 163 — so nothing has been quietly dropped out of a count. The middle column is
**a subset of the first, not a fourth group**: those tests are yours to run, you just will not get
to the end of them.

---

## Inline Add and Edit Parts

**119 tests in total.** 114 of them you can run today — 2 of those only go part of the way. 5 cannot be run here at all yet, and every one of them is listed below with the reason and what to do instead.

**1 of these tests was written by a colleague (Vladimir Tomovic), not by us, so it has been left exactly as it was — we are not allowed to change it.** It is still counted in the 119 above and appears in the leave-alone list below, so you are not left wondering where it went.

Your list is **Run 418** in TestRail: [https://shopview.testrail.io/index.php?/runs/view/418](https://shopview.testrail.io/index.php?/runs/view/418). It holds 119 tests, which is every test in this area — none is missing and none extra has crept in. **No results are recorded in it yet.**

### What is waiting, and on what

So you can see at a glance which one answer would free up how many tests.

| Waiting on | How many | Which ones |
|---|---|---|
| an answer from the product owner | 3 | [C44996](https://shopview.testrail.io/index.php?/cases/view/44996), [C45060](https://shopview.testrail.io/index.php?/cases/view/45060), [C45239](https://shopview.testrail.io/index.php?/cases/view/45239) |
| a second person working at the same time | 1 | [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) |
| nothing - it is not ours to touch | 1 | [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) |
| **total left alone for now** | **5** | |

### Leave these alone for now — and what to do instead

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C44996](https://shopview.testrail.io/index.php?/cases/view/44996) | Checks the row is hidden when a work order cannot be changed for a reason other than status | DO NOT RUN IT YET. Nobody knows yet what makes a work order un-editable other than its status, so there is no way to set the situation up. It is waiting on an answer from the product owner. Leave it Untested. |
| [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) | Checks what you are told when someone else changes the same part while you are editing it | DO NOT RUN IT YET. It needs a second person to change the same part while your edit row is open. If you can get a colleague to do that at the same time, run it; otherwise leave it Untested and tell the QA lead. |
| [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) | Checks the cost and price boxes when the chosen part has no cost or price recorded | DO NOT RUN IT YET. It needs a part that has no cost and no sell price recorded at all. Every part on this test system has at least 0.00 in those boxes, which is not the same as empty. Waiting on an answer from the product owner. |
| [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) | Adding a part to a finished line | NOT YOURS TO RUN OR CHANGE - this case belongs to Vladimir Tomovic and it has no steps written in it. Leave it alone entirely. |
| [C45239](https://shopview.testrail.io/index.php?/cases/view/45239) | Checks what is shown when a part is not kept in any bin | DO NOT RUN IT YET. It needs a part that is not kept in any bin. Every part on this test system is in at least one bin. Waiting on an answer from the product owner. |

### Run these, but you will only get part of the way

Each of these checks the same thing across several situations, and some of those situations do
not exist on this test system. Do the ones you can, then mark the test **Blocked** with the
note given here — **do not mark it Passed on the strength of the part that worked.**

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) | Checks the Add Part button is hidden on work orders that can no longer be changed | RUN THE PART YOU CAN. Open a work order whose status is Paid and check the Add Part button is not there - that part is confirmed working. The other four statuses the case names (Complete, Invoiced, Declined, Imported) do not exist on this test system, so SKIP those and mark the case Blocked with the note "no work order in that status exists here". |
| [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | Checks the pencil (Edit) control is hidden on work orders that can no longer be changed | Same as the case above, for the pencil (Edit) control instead of the Add Part button. |

### Run these, but read the note first

| Test | What it checks, in plain words | What to expect |
|---|---|---|
| [C45068](https://shopview.testrail.io/index.php?/cases/view/45068) | Checks you are asked before your unsaved part is thrown away | RUN IT AND EXPECT IT TO FAIL. Type a part into the inline row without saving, then click the pencil on another part on the same line. The "Discard this part?" question should appear first; it does not - the Edit Part Request window opens straight away and your typed part is left behind it. Mark the case FAILED and add nothing else; the ticket for it is already written and waiting on the QA lead. |

**One more thing on the wording.** 118 of the 119 tests pass our own automated check that a person can follow them from the screen, run against TestRail today rather than against a saved copy. [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) does not, and we are not allowed to rewrite it — see the outstanding list at the end.

---

## Printer Friendly Work Orders

**44 tests in total.** 37 of them you can run today — 1 of those only goes part of the way. 7 cannot be run here at all yet, and every one of them is listed below with the reason and what to do instead.

Your list is **Run 419** in TestRail: [https://shopview.testrail.io/index.php?/runs/view/419](https://shopview.testrail.io/index.php?/runs/view/419). It holds 44 tests, which is every test in this area — none is missing and none extra has crept in. **No results are recorded in it yet.**

### What is waiting, and on what

So you can see at a glance which one answer would free up how many tests.

| Waiting on | How many | Which ones |
|---|---|---|
| an answer from the product owner (the written description contradicts itself) | 2 | [C45107](https://shopview.testrail.io/index.php?/cases/view/45107), [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) |
| a test login that cannot open work orders | 1 | [C45090](https://shopview.testrail.io/index.php?/cases/view/45090) |
| a work order with no customer on it | 1 | [C45097](https://shopview.testrail.io/index.php?/cases/view/45097) |
| a work order with no vehicle on it | 1 | [C45098](https://shopview.testrail.io/index.php?/cases/view/45098) |
| a line whose status is Cancelled | 1 | [C45104](https://shopview.testrail.io/index.php?/cases/view/45104) |
| a tech story about a paragraph long | 1 | [C45111](https://shopview.testrail.io/index.php?/cases/view/45111) |
| **total left alone for now** | **7** | |

### Leave these alone for now — and what to do instead

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C45090](https://shopview.testrail.io/index.php?/cases/view/45090) | Checks someone who cannot open work orders cannot print one either | DO NOT RUN IT YET. It needs an account that cannot open work orders at all. Ask the QA lead to set one up, or leave it Untested. |
| [C45097](https://shopview.testrail.io/index.php?/cases/view/45097) | Checks the printout when the work order has no customer | DO NOT RUN IT YET. It needs a work order with no customer on it, and every work order on this test system has one. |
| [C45098](https://shopview.testrail.io/index.php?/cases/view/45098) | Checks the printout when the work order has no vehicle | DO NOT RUN IT YET. It needs a work order with no vehicle on it, and every work order on this test system has one. |
| [C45104](https://shopview.testrail.io/index.php?/cases/view/45104) | Checks a cancelled line is left off the printout | DO NOT RUN IT YET. It needs a line whose status is Cancelled, and none of the work orders checked had one. If you can set a line to Cancelled yourself, do that and then run it. |
| [C45107](https://shopview.testrail.io/index.php?/cases/view/45107) | Checks the printout of a work order that has no lines on it | DO NOT RUN IT. It cannot be done: on a work order with no lines the Print option is greyed out, so you can never see the printout it describes. The written description contradicts itself here and the product owner has to settle it. Leave it Untested. |
| [C45111](https://shopview.testrail.io/index.php?/cases/view/45111) | Checks a long tech story is printed in full | DO NOT RUN IT YET. It needs a tech story at least 500 characters long - roughly a full paragraph. If you can paste that much text into a line's tech story, do that and then run it. |
| [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) | Checks the totals box on a work order that has no lines on it | DO NOT RUN IT - same reason as the case above. You cannot print a work order that has no lines, so there is no summary to look at. |

### Run these, but you will only get part of the way

Each of these checks the same thing across several situations, and some of those situations do
not exist on this test system. Do the ones you can, then mark the test **Blocked** with the
note given here — **do not mark it Passed on the strength of the part that worked.**

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C45088](https://shopview.testrail.io/index.php?/cases/view/45088) | Checks the Print option appears on work orders in every status | RUN THE THREE YOU CAN. The Print option is confirmed present on Estimate, Approved and Paid work orders. The other seven statuses the case names do not exist on this test system - skip those and mark the case Blocked with the note "only three of the ten statuses exist here". |

### Run these, but read the note first

| Test | What it checks, in plain words | What to expect |
|---|---|---|
| [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) | Checks printing is written into the work order history | RUN IT NORMALLY - the behaviour is correct. One thing to expect: the history row is called "Work order printed history", not "Work Order Printed" as the case says. That difference is already reported, so do NOT raise it again; pass the case on the behaviour. |

**One more thing on the wording.** 43 of the 44 tests pass our own automated check that a person can follow them from the screen, run against TestRail today rather than against a saved copy. [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) does not, and we are not allowed to rewrite it — see the outstanding list at the end.

---

## Also with this brief

| File | What is in it |
|---|---|
| `Inline-Add-and-Edit-Parts_and_Printer-Friendly-Work-Orders_Defects-for-Testers_2026-09-01.xlsx` | Everything that did not pass when we ran it, one tab per kind, each row with a plain "what needs to be done". Read this before you start. |
| `HOW-THE-NUMBERS-WERE-DERIVED.md` | Where every figure above came from, so it can be checked without anyone re-counting. |

---

## OUTSTANDING — what I need from you

| # | What I need | Why it matters | What happens without it |
|---|---|---|---|
| 1 | **Go-ahead to rewrite one Printer Friendly test** | [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) is flagged Automated, so it cannot be touched without your say-so per case. Its steps do not yet name where on the screen to look. | It goes to the tester with vaguer instructions than the other 43. |
| 2 | **A ruling on one colleague-owned test** | [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) belongs to Vladimir Tomovic and has no steps at all. You told me not to change his cases, so I have not. | The tester will open an empty test and not know what to do with it. |
| 3 | **Five answers from the product owner** | They are in the two question spreadsheets already sent. They decide five tests in these suites. | Those five stay Untested rather than Passed or Failed. |
| 4 | **Permission to raise one bug ticket** | The unsaved-part warning does not appear ([C45068](https://shopview.testrail.io/index.php?/cases/view/45068)). The ticket text is written and waiting; you asked me to hold every ticket and to re-check on the build first when you lift that. | A real, reproducible bug stays unrecorded outside these notes. |
| 5 | **A decision on the contradiction in the Printer Friendly description** | The description says printing is switched off when a work order has no lines, and elsewhere describes what that printout should look like. Both cannot be true. | Two tests can never be run by anyone. |

Anything you would rather I changed in this brief before it reaches the tester, tell me and I will regenerate it — none of it is hand-typed.
