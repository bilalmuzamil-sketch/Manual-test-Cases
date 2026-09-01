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
| Inline Add and Edit Parts | **117** | 2 | 2 | 119 | Run 418 — [open it](https://shopview.testrail.io/index.php?/runs/view/418) |
| Printer Friendly Work Orders | **39** | 1 | 5 | 44 | Run 419 — [open it](https://shopview.testrail.io/index.php?/runs/view/419) |
| **Both together** | **156** | **3** | **7** | **163** | |

"Tests you can run" plus "tests to leave alone" equals the total on every row — 156 + 7 = 163 — so nothing has been quietly dropped out of a count. The middle column is
**a subset of the first, not a fourth group**: those tests are yours to run, you just will not get
to the end of them.

---

## Inline Add and Edit Parts

**119 tests in total.** 117 of them you can run today — 2 of those only go part of the way. 2 cannot be run here at all yet, and every one of them is listed below with the reason and what to do instead.

**1 of these tests was written by a colleague (Vladimir Tomovic), not by us, so it has been left exactly as it was — we are not allowed to change it.** It is still counted in the 119 above and appears in the leave-alone list below, so you are not left wondering where it went.

Your list is **Run 418** in TestRail: [https://shopview.testrail.io/index.php?/runs/view/418](https://shopview.testrail.io/index.php?/runs/view/418). It holds 119 tests, which is every test in this area — none is missing and none extra has crept in. **No results are recorded in it yet.**

### What is waiting, and on what

So you can see at a glance which one answer would free up how many tests.

| Waiting on | How many | Which ones |
|---|---|---|
| a second person working at the same time | 1 | [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) |
| nothing — it is not ours to touch | 1 | [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) |
| **total left alone for now** | **2** | |

### Leave these alone for now — and what to do instead

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) | Checks what you are told when someone else changes the same part while you are editing it | THIS ONE REALLY DOES NEED A SECOND PERSON. Ask a colleague to change or delete the same part while your edit row is open, then press Save. If you cannot arrange that, leave it Untested and tell the QA lead - do not guess. We tried it from a second connection rather than a second person and could not get the row open at the right moment, so nothing is known about this behaviour either way. |
| [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) | Adding a part to a finished line | NOT YOURS TO RUN OR CHANGE - this case belongs to Vladimir Tomovic and it has no steps written in it. Leave it alone entirely. |

### Run these, but you will only get part of the way

Each of these checks the same thing across several situations, and some of those situations do
not exist on this test system. Do the ones you can, then mark the test **Blocked** with the
note given here — **do not mark it Passed on the strength of the part that worked.**

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) | Checks the Add Part button is hidden on work orders that can no longer be changed | RUN THE PART YOU CAN. Open a work order whose status is Paid and check the Add Part button is not there - that part is confirmed working. Of the other four the case names, Declined and Imported are not statuses this product has at all (its list is Estimate, Approved, In progress, Review, Complete, Invoiced, Paid), and no work order here is Complete or Invoiced. Mark the case Blocked with the note "only the Paid status could be checked". |
| [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | Checks the pencil (Edit) control is hidden on work orders that can no longer be changed | Same as the case above, for the pencil (Edit) control instead of the Add Part button. |

### Run these, but read the note first

| Test | What it checks, in plain words | What to expect |
|---|---|---|
| [C44996](https://shopview.testrail.io/index.php?/cases/view/44996) | Checks Add Part is hidden once a line is finished | RUN IT AND EXPECT IT TO FAIL. Pick a line with NO parts on it, click Approve, then mark it Complete from the same row (going straight to Complete is refused, and a line that has parts cannot be completed at all). With the badge reading "Complete", look at that line's Parts section: the "+ Add Part" button is still there, and it should not be. Mark the case FAILED. |
| [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) | Checks the cost and price boxes when the chosen part has no cost or price recorded | RUN IT AND EXPECT IT TO FAIL. Click Add Part, type "F40010212" in the Part number box and click the suggestion marked "Catalog" (Slack Adjuster - it is stocked nowhere and has no price on record). The Cost and Sell price boxes should open EMPTY and stop you saving until you fill them; instead they open showing "0.00" and the part saves at 0.00. Mark the case FAILED. |
| [C45068](https://shopview.testrail.io/index.php?/cases/view/45068) | Checks you are asked before your unsaved part is thrown away | RUN IT AND EXPECT IT TO FAIL. Type a part into the inline row without saving, then click the pencil on another part on the same line. The "Discard this part?" question should appear first; it does not - the Edit Part Request window opens straight away and your typed part is left behind it. Mark the case FAILED and add nothing else. |
| [C45239](https://shopview.testrail.io/index.php?/cases/view/45239) | Checks what is shown when a part is not kept in any bin | RUNS AND PASSES - kept here only so you know how to reach the state. Click Add Part, type "F40010212" and pick the suggestion marked "Catalog": it sits in no bin, so you get no bin chip and no "Pulled from" line, which is correct. |

**One more thing on the wording.** 118 of the 119 tests pass our own automated check that a person can follow them from the screen, run against TestRail today rather than against a saved copy. [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) does not, and we are not allowed to rewrite it — see the outstanding list at the end.

---

## Printer Friendly Work Orders

**44 tests in total.** 39 of them you can run today — 1 of those only goes part of the way. 5 cannot be run here at all yet, and every one of them is listed below with the reason and what to do instead.

Your list is **Run 419** in TestRail: [https://shopview.testrail.io/index.php?/runs/view/419](https://shopview.testrail.io/index.php?/runs/view/419). It holds 44 tests, which is every test in this area — none is missing and none extra has crept in. **No results are recorded in it yet.**

### What is waiting, and on what

So you can see at a glance which one answer would free up how many tests.

| Waiting on | How many | Which ones |
|---|---|---|
| a product-owner ruling — the app forbids the state | 5 | [C45097](https://shopview.testrail.io/index.php?/cases/view/45097), [C45098](https://shopview.testrail.io/index.php?/cases/view/45098), [C45104](https://shopview.testrail.io/index.php?/cases/view/45104), [C45107](https://shopview.testrail.io/index.php?/cases/view/45107), [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) |
| **total left alone for now** | **5** | |

### Leave these alone for now — and what to do instead

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C45097](https://shopview.testrail.io/index.php?/cases/view/45097) | Checks the printout when the work order has no customer | DO NOT RUN IT - it cannot be done. The app will not create a work order without a customer: leaving Customer empty on the New Work Order window answers "Customer is a required field" and nothing is saved. So the printout this case describes can never exist. It is waiting on a product-owner ruling. Leave it Untested. |
| [C45098](https://shopview.testrail.io/index.php?/cases/view/45098) | Checks the printout when the work order has no vehicle | DO NOT RUN IT - it cannot be done, same as the customer one. Choosing a customer and pressing Save with Add Asset empty answers "Asset is a required field". Waiting on a product-owner ruling. Leave it Untested. |
| [C45104](https://shopview.testrail.io/index.php?/cases/view/45104) | Checks a cancelled line is left off the printout | DO NOT RUN IT - there is no "Cancelled" status for a work order line in this product. A line offers only Authorization required, Declined, Authorized and Complete, and those are the only four the system accepts. Waiting on a product-owner ruling. Leave it Untested. |
| [C45107](https://shopview.testrail.io/index.php?/cases/view/45107) | Checks the printout of a work order that has no lines on it | DO NOT RUN IT. It cannot be done: on a work order with no lines the Print option is greyed out, so you can never see the printout it describes. The written description contradicts itself here and the product owner has to settle it. Leave it Untested. |
| [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) | Checks the totals box on a work order that has no lines on it | DO NOT RUN IT - same reason as the case above. You cannot print a work order that has no lines, so there is no summary to look at. |

### Run these, but you will only get part of the way

Each of these checks the same thing across several situations, and some of those situations do
not exist on this test system. Do the ones you can, then mark the test **Blocked** with the
note given here — **do not mark it Passed on the strength of the part that worked.**

| Test | What it checks, in plain words | What to do |
|---|---|---|
| [C45088](https://shopview.testrail.io/index.php?/cases/view/45088) | Checks the Print option appears on work orders in every status | RUN THE THREE YOU CAN. The Print option is confirmed present on Estimate, Approved and Paid work orders. Note that the product itself only has seven work order statuses - Estimate, Approved, In progress, Review, Complete, Invoiced, Paid - and only those three exist in the data here, so mark the case Blocked with the note "only three of the statuses exist here". |

### Run these, but read the note first

| Test | What it checks, in plain words | What to expect |
|---|---|---|
| [C45090](https://shopview.testrail.io/index.php?/cases/view/45090) | Checks someone who cannot open work orders cannot print one either | RUNS AND PASSES. To set it up: Settings > Roles & Permissions > pencil on a role > switch its work-order viewing OFF, and switch the work-order line editing and part-picking permissions off in the same role (viewing alone will not stay off - the others depend on it). A user on that role is then bounced off the work order entirely, "Work Orders" disappears from the top menu, and there is no More menu and no print option. Put the permissions back afterwards. |
| [C45111](https://shopview.testrail.io/index.php?/cases/view/45111) | Checks a long tech story is printed in full | RUNS AND PASSES. To set it up: open the work order's Lines tab, click a line, paste about a full paragraph (500+ characters) into its Tech Story box and save. The whole story then prints, with no cut-off and no "Show more". |
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
| 1 | **Go-ahead to rewrite one Printer Friendly test** | [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) is flagged Automated, so it cannot be touched without your say-so per case. Its behaviour is verified as correct; only its steps are short of naming where on the screen to look, which is why it is the one case in that suite failing the runnability check. | It goes to the tester with vaguer instructions than the other 43. |
| 2 | **A product-owner ruling on five tests the application forbids** | [C45097](https://shopview.testrail.io/index.php?/cases/view/45097) and [C45098](https://shopview.testrail.io/index.php?/cases/view/45098) describe a work order with no customer / no vehicle — the app answers "Customer is a required field" and "Asset is a required field" and creates nothing. [C45104](https://shopview.testrail.io/index.php?/cases/view/45104) needs a Cancelled line status, which the product does not have (its list is Authorization required, Declined, Authorized, Complete). [C45107](https://shopview.testrail.io/index.php?/cases/view/45107) and [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) describe the printout of a work order with no lines, which cannot be printed at all. In every case the written requirement asks for behaviour in a state the product does not permit. | Those five stay Untested — nobody can run them, now or later, until the requirement changes. |
| 3 | **A colleague for one test** | [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) needs a second person changing the same part while the tester's edit row is open. Two attempts from a second connection could not get the row open at the right moment, so nothing is known about the behaviour either way. | It stays Untested; a tester with a colleague settles it in a minute. |
| 4 | **Nothing on Vladimir Tomovic's case — recorded, not asked** | [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) has no steps and is the one Inline case failing the runnability check. Your instruction is recorded and I have not touched it, and I am not asking again. | The tester will open an empty test; the brief tells her to leave it alone. |
| 5 | **For your information — four more cases became Automated today** | [C45223](https://shopview.testrail.io/index.php?/cases/view/45223), [C45224](https://shopview.testrail.io/index.php?/cases/view/45224), [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) and [C45237](https://shopview.testrail.io/index.php?/cases/view/45237) are now flagged Automated in TestRail; this morning only [C45005](https://shopview.testrail.io/index.php?/cases/view/45005), [C45026](https://shopview.testrail.io/index.php?/cases/view/45026) and [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) were. All four were written before the flag appeared, so nothing was written to a protected case. | From now on those four need a per-case go-ahead like any other Automated case. |

Anything you would rather I changed in this brief before it reaches the tester, tell me and I will regenerate it — none of it is hand-typed.
