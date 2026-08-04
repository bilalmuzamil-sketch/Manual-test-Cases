# REPORT SUITE — IS IT READY FOR AUTOMATION? · 2026-08-04

**Short answer: yes — 392 of the 469 tests can be automated starting now.** The other 77 should be
left alone for the moment, and every one of them is listed below with the reason.

**One thing to know before starting.** The test system was updated this morning at about 10:40. Nearly
everything we checked was checked on the version that was running before that. Nothing we found has
been withdrawn, but if a test fails on the columns or the layout of a downloaded file, please tell us
before assuming your code is wrong — the update may have fixed it.

---

## THE TABLE

| Report | Cases | Verified against the build | Failing because of a known open problem | Held waiting on Chris Ward | Needs a special tool | Ready for automation? |
|---|---:|---:|---:|---:|---:|---|
| Sales By Customer | 84 | 68 | 2 | 9 | 13 | **Yes — 73 of 84** |
| Sales By Representative | 111 | 74 | 2 | 9 | 14 | **Yes — 92 of 111** |
| Parts Velocity | 71 | 53 | 4 | 4 | 5 | **Yes — 66 of 71** |
| Technician Utilization | 59 | 40 | 1 | 5 | 7 | **Yes — 51 of 59** |
| Work In Progress | 76 | 54 | 0 | 11 | 6 | **Yes — 59 of 76** |
| Inventory Value | 68 | 35 | 7 | 9 | 7 | **Yes — 51 of 68** |
| **TOTAL** | **469** | **324** | **16** | **47** | **52** | **Yes — 392 of 469** |

**How to read the columns.**
*Cases* — the tests that exist for that report. *Verified against the build* — we opened the real
report and watched it behave, and it matched. *Failing because of a known open problem* — the test is
correct, the product is not, and a ticket is already open; **automate these and expect them to fail
until the fix lands**. *Held waiting on Chris Ward* — we have asked him a question and his answer
could change what the test expects, so automating now risks locking in the wrong answer. *Needs a
special tool* — the check cannot be done by looking at the screen alone. *Ready for automation* — the
number left once the skip list below is set aside.

**A note on the "verified" column, because it is lower than it looks.** 324 of 469 matched. Of the
rest: 115 are cases where the product does not yet do what the written specification asks, 13 cover
things not built yet, and 17 need something outside the product. **None of those numbers mean a test
is wrong** — they mean the test is waiting on the product or on a tool.

---

## (a) WHAT TO SKIP, AND WHY — 77 tests

**1 · Leave the 47 tests we are waiting on Chris Ward for.** Every one of them now says so in its own
expected results, in these words: *"DO NOT AUTOMATE YET: this behaviour is waiting on an answer from
the product owner."* It also names and links the question sheet. **If a test carries that line, skip
it** — you do not need any other list.

**2 · Leave the 4 Work In Progress tests about the nightly figures.** These figures are written each
night by a background process, and **no screen in the product reads them back**, so there is nothing
for a test to look at. They now tell the tester to mark the test blocked rather than failed.
Cases [C30528](https://shopview.testrail.io/index.php?/cases/view/30528),
[C30530](https://shopview.testrail.io/index.php?/cases/view/30530),
[C30531](https://shopview.testrail.io/index.php?/cases/view/30531),
[C30533](https://shopview.testrail.io/index.php?/cases/view/30533).

**3 · Leave the 2 tests that need more than a year of stored history.** The test system holds about
five days so far, so there is nothing old enough to check. They will become runnable around
**September 2027** unless someone loads older history for us.
Cases [C30609](https://shopview.testrail.io/index.php?/cases/view/30609),
[C30610](https://shopview.testrail.io/index.php?/cases/view/30610).

**4 · Leave the 13 tests for things not built yet.** There is nothing on the screen to drive.

**5 · Leave the 17 tests that need something outside the product** — a second organisation, a
particular customer setup, or access a normal user does not have.

**And two individual warnings, not skips:**

- **[C30590](https://shopview.testrail.io/index.php?/cases/view/30590) is wrong today.** It says the
  downloaded Inventory Value spreadsheet's **first** line is the "As of" line. This morning's update
  added a new "Date Range" line above it, so the "As of" line is now **second**. **Do not code to
  that test until we correct it** — the correction is waiting on approval.
- **The Inventory Value download ignores which columns you picked** and puts them in a different
  order from the screen. That is real and it is not your code. Two tests describe it and both now say
  so plainly.

---

## (b) WAITING ON CHRIS WARD — 47 tests

He has been sent one sheet with all the questions on it. The tests affected are grouped by question:

| What we asked him | How many tests |
|---|---|
| Should the Location column appear automatically, or only when it is switched on? | 8 |
| Which identifier should be shown for an asset, and in what order? | 3 |
| Should the date picker offer exactly the eleven options listed? | 6 |
| Should the Location filter be hidden for someone with only one location? | 5 |
| What value should an Estimate show? | 2 |
| Should the label read "Sales Rep" or "Sales Representative"? | 1 |
| Various smaller wording and behaviour points | 22 |

**Nothing here is blocked on us.** Once he answers, each affected test either loses the warning line
unchanged or gets a small edit, and then it can be automated.

---

## (c) WAITING ON THE DEVELOPERS — 16 tests, plus 3 things nobody has yet

**The 16 tests that will fail until a fix lands.** Three tickets are open and every one of these tests
points at the right one: **SV-8818** (10 tests), **SV-8819** (2 tests), **SV-8820** (4 tests).
**Automate them now** — a failing automated test against an open ticket is useful, and each test
already tells the tester it is a known problem so nobody re-reports it.

**Three things we have asked for and do not have:**

1. **A way to trigger the nightly figures on demand.** Without it, six tests can never be run. We
   tried 25 different routes and none exists.
2. **Stored history older than a year**, or someone to load it for us. Two tests depend on it.
3. **Word on what this morning's update changed.** It already moved the lines at the top of the
   Inventory Value download, so there may be more.

**One more, and it is a decision rather than a fix:** the Inventory Value download ignoring your
chosen columns needs its own ticket. We have **not** raised it — that is the QA lead's call.

---

## THE CHECKS BEHIND THESE NUMBERS

Everything below was measured, not estimated, and each comparison was run in **both** directions so a
count can never hide a difference.

| Check | Result |
|---|---|
| Live cases that are ours vs the id-map | **469 = 469, identical both ways** |
| Local case files (active) vs the id-map | **469 = 469, identical both ways** |
| Live case titles vs the combined import file | **469 = 469, identical both ways** |
| Combined import vs the six per-report imports | **469 = 469, identical both ways** |
| The verdict record vs the id-map, and vs live | **469 = 469 = 469, identical both ways** |
| Local case files: total / active / retired | **535 / 469 / 66** |
| Import file's header line vs the other four projects' | **identical** (`a82ca60c…`) |
| Internal jargon, feature-flag words, duplicate titles, leaked internal ids in the import | **0, 0, 0, 0** |
| Titles longer than 80 characters | **0** (the longest is exactly 80) |
| Import content compared line-by-line against live | **469 of 469 match, 0 differences** |
| Other people's 5 test cases | **untouched — identical in every field, including their timestamps** |
| The execution run (359) | **469 tests, matching our 469 exactly; all 529 recorded results still present, checked one by one by their own id** |

**Contradiction sweep, re-run over all 469.** Cases were grouped by the requirement they cite — 253
requirements are cited by more than one test — and every pair was compared for opposite claims.
**Nothing contradicts anything.** Five tests were flagged by the automatic check and all five turned
out to be **correct**, not conflicting: each one deliberately states both halves, for example
*"For the single-location user the Location filter is NOT shown at all"* **and** *"For the user with
access to two or more locations the Location filter IS shown."* That is exactly how these should be
written. **The 8 tests changed today introduced 0 contradictions.**

**The re-check list.** It now covers **all 469** tests — one test,
[C30098](https://shopview.testrail.io/index.php?/cases/view/30098), had never been on it and was
added. It **stays open**, for two separate reasons: the developers have not said the test system is
finished, and it was updated again this morning.

---

## OUTSTANDING — what I need from you

| What I need | Who from | What it holds up | Since |
|---|---|---|---|
| **Approval to correct [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)** — this morning's update added a "Date Range" line, so its "first line" note is now wrong and a tester will report a problem that is not one | **you** | one test is misleading today | 2026-08-04 |
| **A yes or no on keeping [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) and [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) as two separate tests** — the merge list wanted them combined; I did not do it because they check different things and combining them would leave Work In Progress as the only report without its own pinned-column test | **you** | nothing — both are live and correct as they are | 2026-08-04 |
| **A decision on raising the "download ignores your chosen columns" problem** as its own ticket. Nothing filed | **you** | a real fault has no ticket | 2026-08-04 |
| **Whether the "known and accepted" wording should also go on [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** — I put it only on [C30589](https://shopview.testrail.io/index.php?/cases/view/30589), because we are asking for a ticket on C30588's problem and telling a tester to ignore it would contradict that | **you** | one wording point | 2026-08-04 |
| **Approval for the three small wording fixes** that would make three nightly-figure tests runnable today ([C30605](https://shopview.testrail.io/index.php?/cases/view/30605), [C30606](https://shopview.testrail.io/index.php?/cases/view/30606), [C30607](https://shopview.testrail.io/index.php?/cases/view/30607)) | **you** | 3 tests read as blocked when they are not | 2026-08-04 |
| **Permission to make the import a single command** so it can never again be built from an out-of-date source. Today it silently deleted all 47 warning lines and I had to put them back | **you** | a repeat of today's near-miss | 2026-08-04 |
| **Fresh login details**, if you want two things re-checked on this morning's version: the column order on screen, and a value-by-value comparison of the download | **you** | two findings are carried over from the earlier version rather than re-seen. This was my own error — I broke the session by logging in too many times | 2026-08-04 |
| **Answers to the question sheet** | **Chris Ward** | 47 tests cannot be automated | 2026-08-04 |
| **A correction to the Inventory Value specification** so it stops asking for plain numbers in the spreadsheet, which you have accepted the product will not do | **Chris Ward** | our own records say the product is wrong on a point you have accepted | 2026-08-04 |
| **A way to trigger the nightly figures**, and **history older than a year** | **a developer** | 6 tests can never run; 2 more not until roughly September 2027 | 2026-08-04 |
| **Confirmation of what this morning's update changed**, and whether the test system is now final | **engineering** | every check we have made stays provisional and the re-check list cannot close | 2026-08-03 |

---

## CAN THE AUTOMATION ENGINEER START TODAY?

**Yes — he can start on 392 of the 469 tests right now; he must skip the 77 listed above, treat the 16
that point at an open ticket as expected failures, and check with us first if anything about a
downloaded file's columns disagrees with his code, because the test system was updated this morning
and those two findings come from the version before it.**
