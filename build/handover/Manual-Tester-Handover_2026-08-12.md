# Handover for the manual test team — 12 August 2026

**For the manual test team. Release is tomorrow.**

> This is the plain-text twin of `Manual-Tester-Handover_2026-08-12.xlsx`. Same content, same four sections.

---

## 1. Read me first

Release is tomorrow. This sheet is for you. It has three lists in it, one per tab, and this page explains what they are and the one rule that matters most. You do not need to know anything about how the tests were written to use it.

### 1. The one rule that matters most

If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.

Every test that cannot be run says so in its own words, at the very bottom of its Expected Results. If you open a test and it tells you it is waiting on something, that is the test telling you it cannot be judged today. Mark it Blocked and move on.

*Why it matters:* This is not a formality. It has already happened. Checked in TestRail this morning: 16 tests that cannot currently be judged already have a Passed result recorded against them. A test nobody could run cannot have passed. Those 16 are listed on the last tab and marked, and they need changing to Blocked before anyone reads them as evidence that the feature works.

### 2. What is on each tab

Tab 2, "Problems found, not reported". Three real faults we found and confirmed. No ticket has been raised for any of them. If you want to raise the ticket yourself, everything you need to paste in is on the row, and there is a blank column for you to write the ticket number in.

Tab 3, "Old tickets that mislead". Four tickets where what the ticket says and what the product actually does no longer match. Three say they are closed and the fault is still there. One is still open and the fault is gone.

Tab 4, "Tests that cannot be run yet". All 91 of them, with one plain sentence each.

*Why it matters:* Tabs 2 and 3 are suggestions for a person to action. Nothing on them has been done for you, and nothing has been raised in Jira - we were asked to hold off on that.

### 3. How to mark a test, in four lines

The test tells you it is waiting on something -> Blocked.

The test tells you what you will see today, and that is what you see -> Failed, and raise nothing new. It is already known.

The test tells you what you will see today, and you see something different -> that is a NEW problem. Please report it.

The test says nothing special and it works -> Passed.

*Why it matters:* Anything else, or the test simply does not make sense to you: mark it Blocked and tell the QA lead. Never guess a result.

### 4. How many tests there are

Filters: 97 to run, 18 to skip (115 in total).
Schedule: 145 to run, 31 to skip (176 in total).
Report Suite: 438 to run, 42 to skip (480 in total).

All three together: 680 to run, 91 to skip, 771 in total.

*Why it matters:* A few tests in Filters and the Report Suite were written by a colleague and are not counted above and not listed here. They are not ours to change and not yours to compare against this sheet: 5 in Filters, 12 in the Report Suite.

### 5. One thing to know about dates on the tests

Near the bottom of every test there is a line saying which build it was last checked against. On most tests that build is older than the one you will be testing on today.

That does not make the test wrong. What a test expects comes from the written product description, not from the build - so a newer build never changes what a test should expect. What can change is the exact wording of a button or where something sits on screen.

*Why it matters:* So if a button is named slightly differently from what the test says, that is worth telling the QA lead, but it is not automatically a fault in the product.

---

## 2. Problems found, not reported

THREE problems. All three are in Schedule. All three were seen with our own eyes on the build listed on each row, and no Jira ticket covers any of them.

WHAT TO DO WITH THIS TAB: nothing, unless you want to. We were asked to hold off raising tickets, so these are written out in full in case you would rather raise them yourself. Everything you need is on the row. Use the last column to write down the ticket number if you do raise one.

BEFORE YOU RAISE ONE, PLEASE READ THE 'What is still needed' COLUMN. Each row says what is already proven and what is still missing. A ticket that a developer can argue with costs more than no ticket at all.

### Problem 1 — Schedule — the button that hides the left panel

**What you will see.** There is no button anywhere to hide or show the left work-order panel.

The leftmost control in the row above the grid is the "Today" button, and there is nothing at all to the left of it.

The only thing on the page that hides anything is a small arrow inside the panel, above the month calendar. Its tooltip reads "Hide the calendar", and pressing it folds away the month calendar only. The panel itself stays exactly where it was. That is a different control and it is easy to mistake for this one.

**What should happen instead.** An icon button that collapses and expands the whole left panel.

It should be the first item in the row of controls above the grid, immediately to the left of "Today".

Its tooltip should read "Hide panel" when the panel is open, and "Show panel" when it is collapsed.

Pressing it should slide the panel closed and let the grid widen into the space, and whatever you had set up in the panel should still be there when you open it again.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 5.3 "Panel collapse". Quoted word for word:

"An icon button collapses and expands the left panel. It is the first item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as belonging to the panel it controls, and grouping with the date controls."

"A borderless panel-left icon in secondary text color. The icon does not change between states; the tooltip carries the meaning — 'Hide panel' when open, 'Show panel' when collapsed."

The same section also names it in the list of grid toolbar controls: "Panel toggle — Collapses and expands the left work order panel (§5.3)."

**Exactly how to see it.** 1. Sign in as an administrator and open Schedule.
2. Look at the row of controls immediately above the grid. Find the "Today" button. Look to the left of it — there is nothing there.
3. Now look inside the left panel, just above the month calendar, and find the small arrow. Rest the mouse on it: the tooltip reads "Hide the calendar".
4. Press it. Only the month calendar folds away. The panel is still there and the grid does not widen.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. The build was read at the start, the middle and the end of 12 August and was identical every time. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) · [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) · [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) · [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) · [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) · [C43587](https://shopview.testrail.io/index.php?/cases/view/43587)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. Before filing, annotate one — a picture of the row above the grid with a box drawn round the empty space to the left of "Today" is the one that makes the point.

DUPLICATE SEARCH: not run for this one. One nearby ticket was checked and ruled out — SV-8942 is about the page scrolling sideways on a narrow window, which is a different thing. Please search Jira before you file, and record what you searched for on the ticket.

THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT, so you can answer it first: this wording was only added to the product description on 7 August. So it is possible the feature has simply not been built yet rather than being broken. It is still worth raising either way — but say "not built yet" rather than "broken", because that is what the evidence actually supports.

**Filed? / Ticket number:** ______________

### Problem 2 — Schedule — no confirmation message and no Undo

**What you will see.** Nothing appears on screen after any of these three actions:

- creating a run of shifts across several days,
- dragging a shift sideways to a new start time,
- dragging an event to a different day.

The change happens, and it happens silently. No message, and nowhere to press Undo. If you drag the wrong thing, you have to put it back by hand.

This was not judged by eye. The screen was watched for 11 seconds after each action, and separately every single thing the page added to itself was recorded: 37 things appeared, none of them a message and none of them containing the word "Undo".

**What should happen instead.** Every create, delete, move and reassign should put a short message on screen with an Undo option on it.

The message should stay for 4 to 7 seconds, should stay put for as long as your mouse is over it, and should disappear when you move the mouse away.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026. It says this in two separate places.

Section 7, quoted word for word: "Toast notifications. Every create, delete, move, and reassign action produces a toast with an Undo option. The toast persists for 4 to 7 seconds, stays while the cursor is over it, and dismisses on mouse-leave."

Section 11, quoted word for word: "Undo. Every destructive action (delete, move, reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered."

**Exactly how to see it.** Creating a run of shifts:
1. In the left panel find work order S8685-14158, customer "Brabay Maintenance" (27 lines, 67h 44m). Drag it onto technician Alicia Campbell on Thursday 13 August.
2. Choose "Schedule whole work order", then press the button reading "Create 8 shifts".
3. Watch the screen for ten seconds. Nothing appears.

Moving a shift:
4. Switch to Day view. Find the shift for customer "Pamill Paving", unit 713, "Replace - Rear ramp handles". Drag it sideways. It moves (in our run, from 02:30 to 05:15) and keeps its length.
5. Watch the screen. Nothing appears.

Moving an event:
6. Switch to Week view and find the event named "Test" on 9 August. Drag it to 10 August. It moves.
7. Watch the screen. Nothing appears.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. The build was read at the start, the middle and the end of 12 August and was identical every time. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) · [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) · [C30020](https://shopview.testrail.io/index.php?/cases/view/30020)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. An absence is hard to photograph — the most useful picture is the whole window immediately after the action, with a caption saying what should have been there and where.

DUPLICATE SEARCH: this one HAS been done. Every ticket in the SV project whose title mentions "undo" or "toast" was checked; three came back and all three are about other parts of the product (work-order lines, timesheets, imports). Please put that search on the ticket so nobody has to repeat it.

THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT: we could not find one. The description says it plainly, and says it twice, in two different sections.

**Filed? / Ticket number:** ______________

### Problem 3 — Schedule — notes on a shift

**What you will see.** A note added from a shift's detail window is kept against that ONE shift only. Every other shift on the same work order still shows no note.

Measured on work order S-13014, which has 18 shifts on the board: after adding a note to one of them, exactly 1 of the 18 carried it and the other 17 were empty.

Adding, editing and deleting a note all work correctly in themselves. It is only where the note is kept that is wrong.

**What should happen instead.** Notes on the shift detail window should be added, edited and deleted PER WORK ORDER — so a note added from any one shift should be visible from every shift of the same work order.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 4.9 "Shift detail modal", in the list of what that window shows. Quoted word for word: "Notes: add, edit, and delete per work order."

**Exactly how to see it.** 1. Open Schedule and find a shift for work order S-13014, customer "Fuline Enterprises", unit G30 (the card reads "Fuline Enterprises G30 6 Lines"). This work order has 18 shifts on the board, which is why it is the one to use.
2. Click the shift to open its detail window.
3. Press the add-note control, type any text, and confirm it. NOTE: the confirm control is a small icon, not a button labelled Save — if you go looking for a Save button you will think there is no way to save the note.
4. Close the window and open ANY OTHER shift of the same work order S-13014.
5. The note is not there.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. The build was read at the start, the middle and the end of 12 August and was identical every time. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. Before filing, annotate two side by side — the shift with the note and another shift of the same work order without it.

DUPLICATE SEARCH: not run for this one. Please search Jira before you file, and record what you searched for.

THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT, and it is a real one: the phrase "per work order" sits in a list of things the shift window offers, so somebody could argue it only means "notes about the work order, written from here" rather than "shared across all that work order's shifts". That is the argument a developer would make. It may be worth asking the product owner which was meant before raising a ticket.

**Filed? / Ticket number:** ______________

---

## 3. Old tickets that mislead

FOUR tickets. Three are closed and the fault is still there. One is still open and the fault is gone. Either way, anyone reading the ticket today would get the wrong idea.

WHAT TO DO WITH THIS TAB: nothing has been done. We have not reopened, closed or commented on any of these. The last column is what we would suggest, and it is only a suggestion - a person has to decide.

The tests themselves are already honest about all four, so you can run them normally. They tell you what you will see and what to do about it.

| # | Ticket | Where | What the ticket says | What actually happens now | Tests affected | What we suggest |
|---|---|---|---|---|---|---|
| 1 | [SV-9090](https://shopview.atlassian.net/browse/SV-9090) | Schedule | Raised on 10 August: when you spread a job across several days, it always starts on the day you dropped it on, and there is no way to choose a different start day.

The ticket is CLOSED, marked obsolete. | It still happens. There is no start-date control anywhere in the spread window.

Before saying that, all five choices in the "How much to schedule" list were opened in turn — including the two that reveal an extra control — because a field that only shows under one option would otherwise look missing. "Until a date…" reveals a field called "Finish by" and "Specific hours…" reveals an hours stepper. Both of those set the END, not the start. | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | Reopen it — or reopen SV-8855 instead, but not both: they are the same fault reported twice. A person needs to decide which one survives. We have not touched either. |
| 2 | [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | Schedule | Raised on 4 August, by us: the same fault as SV-9090 above — the spread always begins on the day you dropped on.

The ticket is CLOSED, marked obsolete. | It still happens — same evidence as the row above. Both tickets describe one fault, and both are closed while the fault is live. | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | The same decision as the row above. Our suggestion is to reopen ONE of SV-9090 and SV-8855 and to link the other to it as a duplicate. |
| 3 | [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | Schedule | The alternative to dragging — a control on the work-order card that arms it so you can place it with a click instead of a drag — was removed.

The ticket is CLOSED, marked obsolete. | It is still gone. Looked for in three ways — when the page loads, when the mouse rests on the card, and inside the card's expanded line list — in a state where it must appear (21 work orders on screen, approved lines, editing rights held). It is not there in any of them.

This matters more than it sounds: it is the only way to place a job for anyone who cannot drag with a mouse. | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | Reopen it. The test itself is already honest — it tells the tester exactly what they will see and that the ticket was closed without a fix — so nothing is blocked either way. This is a tidiness and truthfulness call. |
| 4 | [SV-8907](https://shopview.atlassian.net/browse/SV-8907) | Report Suite | Work In Progress downloads fail with a server error on any tab that has rows in it.

The ticket is still OPEN. | It is fixed. This is the opposite case to the three above, and worth knowing before someone spends the morning on it.

Proven by 8 downloads out of 8: all four Work In Progress tabs (with 15, 3, 4 and 15 rows — every one of them a tab WITH rows, which is exactly the state the ticket says must fail), each in both formats. Every one produced a real file, all eight files were different sizes, and the product showed "Success — Data exported successfully." | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) · [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) · [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) · [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) · [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) · [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) · [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Close it. The seven tests listed here have already been corrected so they no longer tell a tester to expect a failure — if the ticket stays open, somebody will eventually re-add that expectation and the tests will start failing a working build. |

---

## 4. Tests that cannot be run yet

Mark every test on this tab BLOCKED. Do not mark any of them Passed.

Each row says in one plain sentence what the test is waiting on. The same sentence is on the test itself, at the bottom of its Expected Results.

TWO THINGS TO LOOK AT FIRST. (1) The column 'Already has a result?' - 16 of these tests already say Passed in the test run. Those need changing to Blocked; they are the most useful thing on this tab. (2) 14 Schedule tests are all waiting on the same one thing - a second login that is not an administrator. One login would release all 14 at once.

### Filters — 18 tests to skip

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Estimates tab | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: Status chip is greyed out and pre-filled; other four work | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: Status chip is greyed out and pre-filled; other four work | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs and comes back on the All tab | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | held for the QA lead's ruling only - the behaviour IS documented (S10-R4 says each Parts view and each Report tab keeps its own separate filter set and each persists independently), so the earlier reason that no source described it was wrong | — |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the update | cannot be run - it needs an account whose filters were saved before the redesign, and none exists | — |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom start/end range | waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states the periods it must offer | — |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports, detail tabs) | cannot be run yet - its own precondition needs the page-search rollout finished everywhere, and it is still part-way through | — |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate search | only half of it can be run - the report pages have no page search box yet, so the report-tab half cannot be tested | — |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear Selection | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new filter bar | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change covers | Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons each report should show | — |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Transaction Type, etc.) | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | — |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a phone as Work Orders do | the new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet | — |

### Schedule — 31 tests to skip

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | Spread uses the tech's working hours; skips weekends only when hours not set | waiting on the product owner's answer, and the question has not been sent yet | Untested |
| [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | Confirming the spread creates a linked series of daily shifts | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Untested |
| [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | Dragging a shift sideways moves its start time in 15-minute steps | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | Notes can be added, edited, and deleted per work order from the modal | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | Events can be dragged to another technician or another day | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | 'My Shifts' filters the grid to only the current user's shifts | needs a second sign-in as a user with no staff record of their own | Failed |
| [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | Schedule: View grants the full read-only experience across the whole page | needs a second sign-in as a view-only user | Passed ⚠️ |
| [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | View-only: every editing affordance is hidden or disabled | needs a second sign-in as a view-only user | Passed ⚠️ |
| [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | needs a second sign-in as a user without the Schedule permission | Passed ⚠️ |
| [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | Schedule: Edit unlocks all creation and modification interactions | needs a second sign-in as an edit-without-delete user | Passed ⚠️ |
| [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | Edit without Delete: the user can create and modify but not remove | needs a second sign-in as an edit-without-delete user | Passed ⚠️ |
| [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | Schedule: Delete unlocks deleting shifts and events | needs a second sign-in as a delete-capable user | Passed ⚠️ |
| [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | Schedule without Work Orders: View - the sidebar hides the work order list | needs a second sign-in as a user who cannot see work orders | Passed ⚠️ |
| [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | No own-only restriction: a View user sees ALL technicians' shifts | needs a second sign-in as a view-only technician | Passed ⚠️ |
| [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | Clocking into line tasks is gated by the staff 'Time Clock' setting | needs a second sign-in as each of the two staff members | Untested |
| [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | Shop closures do NOT block spread in V1 - shifts can land on closure days | waiting on the product owner's answer, and the shop-closure setting does not exist in the build | Untested |
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | With Work Orders: View OFF, work order details on shifts are hidden | needs a second sign-in as a user who cannot see work orders | Blocked |
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Shifts and events created before the Schedule rewrite still appear after it | cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed | — |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Dashboard shows one schedule row per work order even with many shifts | the Dashboard section this test needs does not exist in the build | — |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | A work order created with an appointment shows up on the Schedule board | work order creation offers no appointment in the build | — |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | the Priority field this test needs does not exist in the build | — |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | needs three separate sign-ins, one per permission level | — |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API - No pricing fields in Schedule responses; WO details need Work Orders View | needs a second sign-in as a user who cannot see work orders | — |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Default roles start at the Schedule level the spec names (view-only vs edit) | needs a second sign-in as a holder of each permission level | — |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Month view: dragging a work order onto a day creates a shift for that day | waiting on the product owner's answer, and the question has not been sent yet | — |
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Panel button sits left of Today and its tooltip names what it will do | the panel button does not exist in this build | — |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Panel button hides the left panel and the grid widens into the space | the panel button does not exist in this build | Failed |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | What you had set up in the left panel survives hiding and showing it | the panel button does not exist in this build | — |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | On a narrow window the panel button still works and your choice holds | the panel button does not exist in this build | — |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Menus and pop-up windows reposition when the left panel is hidden | the panel button does not exist in this build | — |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Hiding the panel lasts for the rest of your sign-in but is not saved | the panel button does not exist in this build | — |

### Report Suite — 42 tests to skip

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | Opening an invoice you lack permission for shows access-denied; back works | waiting on one answer from the product owner about whether this person is given a link at all | Untested |
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | Building a custom range on the calendar cannot exceed a 366-day span | the calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen | Untested |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | A service (S) invoice with no vehicle also lands in the Parts Sales bucket | this organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side | Untested |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | Reversed and voided invoices are excluded from every row; count and total | this organisation has no reversed or voided invoice inside the report date range | Untested |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Duplicate asset labels get stable (#1)/(#2) suffixes that survive reloads | no customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear | Untested |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | An invoice deleted after load shows the not-found state and back returns | deleting a real invoice while the report is open is not something to do on a shared environment | Untested |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | A failed data fetch shows the error toast which fades after 5 seconds | a failing data fetch cannot be forced from the application | Untested |
| [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | A Custom range uses the date-picker and holds a 366-day maximum span | needs the calendar driven past a 366-day span, which this harness could not do | Untested |
| [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | Sales Representative selector shows on WO and Part Sale, not on imported | waiting on an answer from the product owner | Untested |
| [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | Selector offers only reps whose sales-representative toggle is on | this part of the report is not built yet | Untested |
| [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | Customer record shows a "Sales Representative" row; "Unassigned" when none | waiting on an answer from the product owner | Untested |
| [C30372](https://shopview.testrail.io/index.php?/cases/view/30372) | Core parts are excluded from both the inventory and special-order result sets | no part in this organisation carries the core flag, so core exclusion cannot be exercised | Untested |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment | Untested |
| [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | Internal hours with no default labor rate anywhere show an em-dash | no location on this environment is set up without a default labor rate, so the em-dash state cannot be produced | Untested |
| [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | Internal hours split across rated and unrated locations show a part value | no location on this environment is set up without a default labor rate, so a part-valued row cannot be produced | Untested |
| [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0 | no technician on this environment has an em-dash in Est. Lost Labor, because both locations have a default labor rate | Untested |
| [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | Reconcile exception (a): an open clock is snapshotted at each load instant | needs a technician clocked in at the moment of the test, and no technician on this environment is currently clocked in | Untested |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization: Location filter hidden for a one-location user | needs a second sign-in as a user who can reach only one location, and there is one shared sign-in on this environment | Untested |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Each qualifying work order appears exactly once in exactly one tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | Passed ⚠️ |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | Untested |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Approved started-boundary: time or part received vs neither decides the tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | Untested |
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | First visit shows the default columns; the rest are in the column selector | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at | Untested |
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | Nightly snapshot records one row per then-open job per calendar date | the nightly capture is written by a background process and nothing in the product reads it back in this version | Untested |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | Captured Earned and Remaining use the same maths as the on-screen report | the nightly capture is written by a background process and nothing in the product reads it back in this version | Untested |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Nightly snapshot spans every location with no user location filter | the nightly capture is written by a background process and nothing in the product reads it back in this version | Untested |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped | the nightly capture is written by a background process and nothing in the product reads it back in this version | Untested |
| [C30547](https://shopview.testrail.io/index.php?/cases/view/30547) | With no fixed sell price and no category, Unit Sell equals Unit Cost | a part cannot be saved without a category on this build, so the no-category path cannot be produced | Untested |
| [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | Inventory Value: the Location filter is hidden for a one-location user | needs a second sign-in as a user with access to only one location | Untested |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | A user with ordinary reports access can open Inventory Value | needs a second sign-in as a user holding only the ordinary reports access | Untested |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | Without reports access Inventory Value is absent from the navigation | needs a second sign-in as a user with no reports access | Untested |
| [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Nightly snapshot records one row per in-stock non-core part per location | the nightly capture is a server-side job and its stored rows are not reachable from the application | Untested |
| [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | A recorded snapshot day equals what the live report showed that day | needs the stored nightly capture rows, which are not reachable from the application | Untested |
| [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Nightly snapshot: re-running the capture for a date replaces that date's rows | the nightly capture job cannot be re-run or inspected from the application | Untested |
| [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | Snapshot retention: daily captures are kept for 0–13 months | retention pruning is a server-side job over stored history, not reachable from the application | Untested |
| [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Thinned history still served by the closest-recorded-day rule | needs a thinned history that this organisation does not have and cannot be produced from the application | Untested |
| [C38892](https://shopview.testrail.io/index.php?/cases/view/38892) | A recorded day keeps its category and vendor names after a rename or delete | needs a recorded earlier day plus the stored capture rows, which are not reachable from the application | — |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Location column: shown to any multi-location user, Multiple on aggregating rows | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at | — |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | An over-cap Work In Progress download is refused with the too-large message | the over-size refusal cannot be produced on this environment; no tab comes near the size limit | — |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | A hand-made Location column choice is remembered like any other column | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at | — |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | A logo that is set but will not load falls back to the ShopView logo | this organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced | — |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | You cannot reach an invoice you have no permission to open | waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales | — |
| [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | Invoice # and customer name when you cannot open what they point at | waiting on one answer from the product owner about what these two values should look like, and it needs a second sign-in that cannot open work orders, part sales or customers | — |

---

*Every count and every list in this document was read from TestRail on 12 August 2026. If tests are added or changed after that, the counts move with them.*
