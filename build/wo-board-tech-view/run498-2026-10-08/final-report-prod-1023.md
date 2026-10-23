# Work Orders Board View and Tech View — the full test run on the live site (production)

Production build v26.43.0, tested 22–23 October 2026 (last readings 03:02 UTC on 23 October), signed in as the second admin test account at Truck Hill 1.

## In one paragraph

Every test in the run was tried on the live site, and every result I could stand behind is now on the run. **156 tests passed on production.** **Two real problems were found**: the board page itself scrolls when it should not (new; the cause is the new Technician filter, which no longer fits in the toolbar row at a normal laptop width; report written and waiting for you), and the message after a keyboard lead change still has no Undo button (already reported, its fix is still being reviewed). Three fixes that were reported earlier now show on production: dark-theme column scrollbars, the count bubbles on the Compact status label, and two people reordering one column at once. **89 tests are not marked yet.** In almost all of them, production did what the test expects wherever it was seen. They are held back because my script took a short cut the test's steps do not allow (most often: opening a page by typing its address instead of clicking to it), or because the step depends on the time of day (see the time question below). **26 tests could not be run on production at all.** Some need things production cannot give (a second company, a Windows computer, a second person signed in at the same time, an imported work order), and some are new tests that have no script yet. Ten questions below need your decision; each one says what I recommend.

---

## 1 · DONE

| What | Result |
|---|---|
| Full run of the suite on production | Done: all 79 steps of the run order, then five rounds of re-runs for every test whose script had to be adjusted to production (names, locations, departments, sign-in) |
| Results written to the run, with annotated pictures | 156 tests confirmed working on production; 2 tests show a real problem (above); 4 tests marked as unable to run — one proved tonight (a set-up production cannot have), three are out-of-date entries from yesterday afternoon that need a clean re-run (see LEFT) |
| New problem found and confirmed three times | The board page scrolls up and down when the mouse wheel is turned over an empty part of the board. Cause found: the new Technician filter makes the toolbar row too wide for a 1600 px window, so "Create Work Order" drops to a second line and the page becomes 56 px taller than the window. The test is marked Failed; the problem report is written with two annotated pictures and is **waiting for your go-ahead** (question 1) |
| Why two tests passed on staging and fail on production (your question this morning) | Board scroll: the Technician filter arrived on 20 October, after our last staging pass. Keyboard lead change: the product did not change, the expected message did (new wording with Undo, asked for by the product owner on 19 October). Both comments were rewritten in place to say only where and how the test fails, with annotated pictures of the failure only (your new rule) |
| Known problem seen again | The message after a keyboard lead change says "Lead technician updated" with no Undo. Marked Failed against the existing report (still being reviewed by developers) |
| Earlier fixes confirmed on production | Dark-theme column scrollbars look right; count bubbles no longer cover the status name at Compact; when two people reorder the same column at once, each moved card keeps its place |
| Spacing tests for the automation engineer | The seven tests whose steps or expected results were changed for the spacing rules were sent to you this morning (numbers in the reference section) |
| Your decisions from yesterday applied | Spacing steps moved to Tech View in four usage-tracking tests; one test step moved to Tech View; one usage test's expected count changed as you said; the "compare production with itself" test and the "scroll loads count as pages" test passed |
| Time-zone check (the Schedule shows the wrong day and hour) | Measured six times and traced as far as I can: every time-zone setting I can see on production says Pakistan time, yet the Schedule draws the day and hour in UTC (5 hours behind). On staging the same check matches. Question 2 |
| Switching into another person's account from the screen | Checked: the test account cannot do it from the screen, and no role setting controls it. Question 5 |
| Everything saved | All results, pictures, scripts and notes are saved in the shared repository |

## 2 · LEFT — what is not finished, and exactly how to finish it

| What is left | How many | How to finish it (another person could do this) |
|---|---|---|
| Tests held only because the script opened a page by its address | 15 | If you agree (question 3), I mark them Passed with the pictures already taken. If not, each needs its first step clicked through the top menu and a re-run |
| Tests held for other script short cuts (a step done behind the screen, a start setting not made, a reading or picture missing) | 51 | Each one's note names the step and the one-minute check by hand that settles it. Re-running needs the script fixed at that step; the list with the step for each test is in the reference section |
| Tests held because the step depends on the time of day | 8 | Wait for question 2. Once the Schedule shows the location's time, re-run them |
| Tests that need a second person signed in at the same time, or a brand-new user's first sign-in (an invitation email) | 9 | Not possible unattended with one test account on production: either a second production test account, or a tester checks them by hand (about 2 minutes each) |
| Tests from the last re-run list whose set-up did not work on production | 6 | One needs a location with only a few technicians picked before step 7; one needs a "Deleted user" that production cannot make the way the script tried (a technician with logged time cannot be deleted); four need their script to put technicians on lines in the way production accepts. Each test's note names the step |
| Tests never run on production | 26 | 15 new "release" tests and several others have no production script yet; 4 usage-tracking tests need two separate days or two people; 3 need things production does not have (a second company, a Windows computer); the sign-out test stopped twice after signing in without taking a picture (it needs its script watched step by step) |
| Three tests still show an old Blocked result on production (from yesterday afternoon, before your spacing decision) | 3 | Their re-runs came out "not yet sure"; the old Blocked stays until they are re-run cleanly. No decision needed |
| One test still shows yesterday's Passed that came from a stand-in for a lost connection | 1 | Its re-run with the connection really dropped did not finish every step; it needs a clean re-run. I recommend treating that Passed as not yet proved |

## 3 · BLOCKED — what stops something, and what it does not stop

| What is blocked | Why | What it does NOT block |
|---|---|---|
| Filing the board-scrolling problem | Needs your go-ahead (question 1) | The test result is already written (Failed, report held); every other test |
| Judging anything that depends on the time of day | The Schedule on production draws times in UTC (question 2) | All tests that do not look at a time or a day |
| The two tests that start or end "switching into another person's account" while a page loads | The test account cannot start this from the screen on production (question 5) | Everything else that switches account behind the screen for set-up |
| One test about a technician whose staff name and sign-in name differ | On production these are one shared name. Proved this morning on screen, through Profile > Edit Profile > Change Name, and behind the screen; both names always change together | Nothing else |

## 4 · HOW TO UNBLOCK

| Blocker | What unblocks it |
|---|---|
| Board-scrolling report | Your answer to question 1; then I file it, add its link to the test and tell you |
| Time of day on the Schedule | Your answer to question 2 |
| Account switching on screen | Your answer to question 5 |
| Staff name vs sign-in name test | Your answer to question 6 |

## 5 · HANDOFF-READY

| Check | |
|---|---|
| Every posted result has its picture and plain-words comment | Yes |
| Every held test has a written reason and the step that needs a hand check | Yes |
| Every script change and learning saved in the repository | Yes |
| No problem report filed without your go-ahead | Yes |
| Every test in the run has a production result | No — 115 are held or not run, as listed above. Those still show their earlier STAGING result in the run (mostly Passed), so the run's totals (271 Passed) are not all production |
| **Ready to hand over as finished** | **NO** |

---

## OUTSTANDING — what I need from you

**Question 1 — Where should the report about the board page scrolling go?**

What it is for: on Board View, the columns scroll on their own and the page around them stays still, so the toolbar (tabs, Search, filters, view switcher) never moves off the screen. The product document says: "The page itself does not scroll vertically; only the content inside each column does."

What happened: on production, in a 1600 x 1000 window, the new Technician filter makes the toolbar row too wide, so "Create Work Order" drops to a second line. That pushes the board 56 px lower, so the page is taller than the window. When you turn the mouse wheel over an empty area below a short column, the whole page moves up and the toolbar slides off the top. I saw it three times, with pictures. Scrolling inside a full column works correctly. The same steps passed on staging on 19 October, before the Technician filter was added. I searched for an existing report: there is none.

Why it is a question: the part of the work this belongs to is already marked finished. Your rule says I raise problems only against work that is ready for testing, being tested, or signed off, and "finished" is not in that list. Recently, problems found after the release went into the "Fast Follow" collection as bugs (that is where Chris moved three of ours on 21 October).

Your options:
- (a) File it as a bug in the Fast Follow collection, medium priority. **My recommendation** — it matches how the last three after-release problems were handled.
- (b) File it as a problem against the original, finished piece of work.
- (c) Do not file it; leave the test marked Failed with the report kept ready.

If you do not answer: the test stays Failed with the report ready; nothing else waits on it.

**Question 2 — The Schedule on production shows the day and hour in UTC, not the location's time**

What it is for: the Schedule draws shifts and a red "now" line at the location's local time. Several tests check shift times and day boundaries.

What happened: on production, the location (Truck Hill 1), the user and my browser are all set to Pakistan time. Yet at 4:24 AM on Friday Pakistan time, the Schedule showed Thursday 22 October with the "now" line near 11 PM — that is UTC, five hours behind. I checked every place a time zone can be set that I can reach: all say Pakistan time, and the company settings page has no time-zone field. On staging the same check shows the location's time correctly.

Why it is a question: this looks like a real difference on production, but it sits in the Schedule, which is a different feature from the one this run tests, and I may be missing a setting I cannot see.

Your options:
- (a) I write it up as a problem report with the pictures and readings, and you decide where it goes. **My recommendation** — it affects anyone using the Schedule on production, not only our tests.
- (b) You or a developer check whether production has a company-wide time setting I cannot reach; I re-check after.
- (c) Leave it; the eight time-of-day tests stay unmarked on production.

If you do not answer: the eight time-of-day tests stay unmarked; everything else is unaffected.

**Question 3 — May I count "opened the page by its link" as following the step, where the step only says to open the page?**

What it is for: many tests start with "Open Work Orders" (or open a customer, a report). The check is what happens after that, not how the page was reached.

What happened: in 15 tests, production did everything the test expects, but my script reached the first page by typing its address instead of clicking the top menu. Under my own rules a step done another way is not the step, so I held them. Earlier in the day (the first 100 or so results) the same short cut was accepted, so the run is not consistent either way.

Your options:
- (a) Accept it where the step only says "open" and how you get there is not what the test checks; I mark those 15 Passed with their pictures. **My recommendation.**
- (b) Do not accept it; I fix the scripts to click through the menu and re-run all of them.

If you do not answer: the 15 stay unmarked; nothing else waits on it.

**Question 4 — Two more report tests that also compare production with itself**

What it is for: two report-filter tests (Parts Velocity vendor filter, Inventory Value category filter) end with "compare with production", like the one you passed yesterday.

What happened: every behaviour they list was seen and correct ("1 selected", the report narrows, no Clear button). The comparison step compares production with itself.

Your options:
- (a) Apply the same decision you gave yesterday and mark both Passed with the same note. **My recommendation.**
- (b) Leave them without a production result.

If you do not answer: both stay unmarked.

**Question 5 — Two tests need "switch into another person's account" from the screen**

What it is for: the tests check that starting or ending account switching while a page is still loading shows the right person's data.

What happened: the production test account cannot start account switching from the screen — the Staff list offers no such item, and the switching page opens without switching. Its role is the full Admin role, the same as the built-in one, and no permission controls this.

Your options:
- (a) Keep these two as staging-only; I note that on them. **My recommendation** — they passed on staging and need no production data.
- (b) I run them once with your own sign-in, at a time you tell me you are not using production (it would sign you out).

If you do not answer: both stay without a production result.

**Question 6 — One test needs a technician whose staff name and sign-in name are different**

What it is for: the work order's Lines tab names a technician by their staff name, not their sign-in name.

What happened: on staging it passed because staging already had such a person (sign-in "Carol Neal", staff record "David Sparks"). On production these are one shared name: I signed in as the technician, changed her name in Profile > Edit Profile and pressed "Change Name", and both names changed together; changing it behind the screen or from Settings > Staff did the same. So the test's set-up cannot exist on production. It is Blocked with that proof and a picture. (My first proof yesterday read the same name list twice; this morning's check reads both lists and was done on screen, and the comment on the test was corrected.)

Your options:
- (a) Note it as staging-only. **My recommendation.**
- (b) Leave it Blocked on production.

If you do not answer: it stays Blocked with the proof written on it.

**Question 7 — One usage-tracking test still saves Board View with a spacing choice**

What it is for: like the four you changed yesterday, it checks the records the app keeps when someone switches views.

What happened: its set-up says "the dispatcher is saved on Board View with a spacing choice". Board View has no spacing on production, so that set-up cannot exist; the step that switches views then records once instead of twice.

Your options:
- (a) Move the set-up's spacing to Tech View, as you did for the other four; I re-run it. **My recommendation.** The expected results stay as they are unless you say otherwise.
- (b) Leave it as it is, unmarked on production.

If you do not answer: it stays unmarked.

**Question 8 — One test closes the payment window after creating an invoice, and on production that undoes the invoice**

What it is for: the test checks that a work order cannot get a new lead technician once it is invoiced.

What happened: its steps say: Create Invoice, then close the "New Customer Payment" window with its X. On production, closing that window with X takes the invoice back off, so the work order never becomes Invoiced and the rest of the test cannot be checked. (Another test that leaves the window open passed: the change is refused with the right message.)

Your options:
- (a) Change the step to "leave the payment window open" (or pay it), and I re-run it. **My recommendation.**
- (b) Treat "X takes the invoice off" as a possible problem and ask the product owner.

If you do not answer: it stays unmarked.

**Question 9 — One new keyboard test contradicts itself**

What it is for: the first Tab press goes to the first work order, even when it is off-screen.

What happened: the set-up asks for three work orders for the third customer, but step 9 expects only one of them to show. Production showed all three; everything else in the test matched.

Your options:
- (a) Tell me which part is right: the set-up (three work orders) or the expected result (only one). If it is the set-up, the expected result needs your go-ahead to change. **My recommendation:** keep three work orders and change step 9's expected result to "all three show, the first one off to the right".
- (b) Leave it unmarked.

If you do not answer: it stays unmarked.

**Question 10 — Checking staging with the cookies you sent**

What it is for: confirming that the board-scroll problem also shows on staging now that staging has the Technician filter.

What happened: I saved the cookies, but this session's safety check blocked running anything on staging with them.

Your options:
- (a) Skip the staging check. **My recommendation** — the cause is proven on production and the filter is the same on both.
- (b) Add a rule in this session's permission settings that allows the staging checks; I then run the board-scroll check on staging and tell you the result.

If you do not answer: no staging check; nothing else waits on it.

**Also for you to know (no decision needed):** two tests that were in this run yesterday are no longer in it (I have not posted anything for them); a one-minute hand check would settle three oddities I could not prove: the Staff window's Save & Close after turning Time Clock off sends nothing; choosing the location you are already on in the profile menu sometimes does nothing until you pick another one first; and after a reload the Mileage field shows the number without its thousands comma, where the test expects the comma.

---REFERENCE---

Run 498: https://shopview.testrail.io/index.php?/runs/view/498 · build v26.43.0-ffea43c · production app.shopview.com

- Q1 board page scroll (cause: Technician filter https://shopview.atlassian.net/browse/SV-11326, Done 20 Oct; layout readings `evidence/prod-2026-10-22/layout-1023-production.json`): C96953 https://shopview.testrail.io/index.php?/cases/view/96953 (test https://shopview.testrail.io/index.php?/tests/view/3481897 in run 498) · story https://shopview.atlassian.net/browse/SV-10046 (Done) · Fast Follow https://shopview.atlassian.net/browse/SV-11593 · draft `run498-2026-10-08/defect-drafts/tickets/held-1022/C96953-page-scrolls-HELD.wiki` · PRD 845185030 v73 S3-E1.
- Known problem: C368152 https://shopview.testrail.io/index.php?/cases/view/368152 (test https://shopview.testrail.io/index.php?/tests/view/3761673 in run 498) → https://shopview.atlassian.net/browse/SV-11524 (Code Review, read 23 Oct). Comments edited to Rule 135: `comment-edits-1023/`.
- Fixes now on production: C682439 → SV-11430; C682440 / C682420 → https://shopview.atlassian.net/browse/SV-11467 (Done); C682445 https://shopview.testrail.io/index.php?/cases/view/682445 → https://shopview.atlassian.net/browse/SV-11119 (Done).
- Passed this morning (batch 35): C368126, C96988, C682445. Set-up did not work on production (batch 35, held): C682419, C368191, C682421, C682437, C682438, C682446.
- Spacing tests changed 22 Oct (for the automation engineer): C368154, C590120, C96944, C97024, C97025, C97027, C97035.
- Q10 staging: cookies saved in /tmp only; running a staging script was refused by the session's permission check.
- Q2 time zone: `evidence/prod-2026-10-22/tz-source-probe-1022.json`, `tz-source-schedule.png`, readings b–e in PROJECT-STATE.
- Q3 route-only: C368130, C368137, C368158, C368161, C368166, C368209, C368218, C368219, C368223, C581890, C581917, C581918, C614715, C96929, C96937.
- Q4: C368234, C368235 (decision of 22 Oct on C368233).
- Q5: C368238, C368239. Q6: C707077 (Blocked; test https://shopview.testrail.io/index.php?/tests/view/4101036; name ticket https://shopview.atlassian.net/browse/SV-11577 Done; proof `evidence/prod-2026-10-22/names-prod-screen-1023.json`). Q7: C97029. Q8: C368170. Q9: C614719.
- Old Blocked to supersede: C96944, C97027, C97035. Old stand-in Passed: C154890.
- No longer in run 498: C368133, C581891 (also C96954, C96955 judged but not in the run).
- Never run on production (26): C154650, C368175, C368238, C368239, C368240 (sign-out; script stopped twice), C674226, C682422, C690643–C690657 (15), C707078, C97012, C97026, C97033, C97034.
- Held with a non-route reason (step and hand check in each test's verdict file): see `evidence/prod-2026-10-22/prod-summary-1023.json` and `judge/verdicts-batch*.json`.
