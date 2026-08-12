# Schedule - handover for the manual tester, 12 August 2026

**For the manual tester on Schedule. Release is tomorrow.**

> This is the plain-text twin of `Schedule_Tester-Handover_2026-08-12.xlsx`. Same content, same four sections.

---

## 1. Read me first

Release is tomorrow. This sheet covers Schedule only, so everything in it is yours to act on. It has three lists in it, one per tab, and this page explains what they are and the one rule that matters most.

You do not need to know anything about how the tests were written to use it. Row 5 says exactly when these numbers were read, and why that matters today.

### 1. The one rule that matters most

If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.

Every test that cannot be run says so in its own words, at the very bottom of its Expected Results. If you open a test and it tells you it is waiting on something, that is the test telling you it cannot be judged today. Mark it Blocked and move on.

*Why it matters:* This is not a formality. It has already happened on this project. Read from TestRail as this sheet was written: ten Schedule tests that cannot currently be judged already have a Passed result recorded against them. A test nobody could run cannot have passed. They are listed on the last tab and shaded in pink, and they need changing to Blocked before anyone reads them as evidence that the feature works.

Across all three projects together the figure is 15.

### 2. What is on each tab

Tab 2, "Problems found, not reported". Eight real faults we found and confirmed on this project. No ticket has been raised for any of them. If you want to raise the ticket yourself, everything you need to paste in is on the row, and there is a blank column for you to write the ticket number in.

Tab 3, "Old tickets that mislead". Four cases where what a ticket says and what the product actually does no longer match.

Tab 4, "Tests that cannot be run yet". All 35 of them, with one plain sentence each, grouped by what they are waiting on.

*Why it matters:* Tabs 2 and 3 are suggestions for a person to action. Nothing on them has been done for you, and nothing has been raised in Jira - we were asked to hold off on that. That is why you are getting this sheet: so you can decide for yourself whether each one is worth raising.

### 3. How to mark a test, in four lines

The test tells you it is waiting on something -> Blocked.

The test tells you what you will see today, and that is what you see -> Failed, and raise nothing new. It is already known.

The test tells you what you will see today, and you see something different -> that is a NEW problem. Please report it.

The test says nothing special and it works -> Passed.

*Why it matters:* Anything else, or the test simply does not make sense to you: mark it Blocked and tell the QA lead. Never guess a result.

### 4. How many Schedule tests there are

141 to run.

35 to skip - they are all on tab 4.

176 in total.

*Why it matters:* Every test in this project is ours, so there is nothing here written by someone else that you should ignore.

### 5. When these numbers were taken

Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z.

PLEASE NOTE THE TIME. Other people are working on these same tests today, and the numbers move. Treat this as a photograph taken at that minute, not a permanent count.

If a test on the last tab no longer says it is waiting on something when you open it, believe the test, not this sheet.

*Why it matters:* As an example of how fast this moves: an earlier count this morning had 28 Schedule tests on the skip list. By the time this sheet was written it was 35, because more tests had been checked and found to be waiting on something. Neither figure was wrong - they were different minutes.

### 6. One thing to know about the build

The Schedule test branch is at v3.5-85ee495 right now.

Most of what is on tabs 2 and 3 was seen on v3.5-65d6500.

The Schedule build was rebuilt at 12 Aug 2026 12:11:04 GMT, so it is NEWER than the one most of this was checked against. What a test EXPECTS does not change when the build changes - that comes from the written product description. What CAN change is the exact wording of a button, or where something sits on screen.

*Why it matters:* BECAUSE THE BUILD HAS MOVED SINCE, please spend two minutes confirming a problem on tab 2 still happens before you raise a ticket for it. A ticket for something that was fixed this morning is worse than no ticket.

---

## 2. Problems found, not reported

Eight problems on Schedule. Every one was seen with our own eyes on the build named on its row, and no Jira ticket covers any of them.

THE BUILD HAS MOVED SINCE THESE WERE SEEN. They were seen on v3.5-65d6500; the branch is now on v3.5-85ee495. Please confirm the problem still happens before you raise a ticket for it - it takes two minutes.

WHAT TO DO WITH THIS TAB: nothing, unless you want to. We were asked to hold off raising tickets, so these are written out in full in case you would rather raise them yourself. Everything you need is on the row. Use the last column to write down the ticket number if you do raise one.

BEFORE YOU RAISE ONE, PLEASE READ THE LAST TWO COLUMNS. One says what is still missing; the other says the strongest argument AGAINST it being a fault, so you can answer that first. A ticket that a developer can argue with costs more than no ticket at all.

### Problem 1 - There is no button to hide the left panel

**What you will see.** There is no button anywhere to hide or show the left work-order panel.

The leftmost control in the row above the grid is the "Today" button, and there is nothing at all to the left of it.

The only thing on the page that hides anything is a small arrow inside the panel, above the month calendar. Its tooltip reads "Hide the calendar", and pressing it folds away the month calendar only — the panel itself stays exactly where it was. That is a different control and it is easy to mistake for this one.

**What should happen instead.** An icon button that collapses and expands the whole left panel.

It should be the first item in the row of controls above the grid, immediately to the left of "Today".

Its tooltip should read "Hide panel" when the panel is open and "Show panel" when it is collapsed.

Pressing it should slide the panel closed and let the grid widen into the space, and whatever you had set up in the panel should still be there when you open it again.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 5.3 "Panel collapse". Quoted word for word:

"An icon button collapses and expands the left panel. It is the first item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as belonging to the panel it controls, and grouping with the date controls."

"A borderless panel-left icon in secondary text color. The icon does not change between states; the tooltip carries the meaning — 'Hide panel' when open, 'Show panel' when collapsed."

The same section also lists this control by name among the controls in the row above the grid, calling it the "Panel toggle".

**Exactly how to see it.**

1. Sign in as an administrator and open Schedule.
2. Look at the row of controls immediately above the grid. Find the "Today" button. Look to the left of it — there is nothing there.
3. Now look inside the left panel, just above the month calendar, and find the small arrow. Rest the mouse on it: the tooltip reads "Hide the calendar".
4. Press it. Only the month calendar folds away. The panel is still there and the grid does not widen.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) · [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) · [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) · [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) · [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) · [C43587](https://shopview.testrail.io/index.php?/cases/view/43587)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. Before filing, annotate one — a picture of the row above the grid with a box drawn round the empty space to the left of "Today" is the one that makes the point.

DUPLICATE SEARCH: not run for this one. One nearby ticket was checked and ruled out — SV-8942 is about the page scrolling sideways on a narrow window, which is a different thing. Please search Jira before you file, and record what you searched for on the ticket.

**The strongest argument AGAINST it being a fault.** This wording was only added to the product description on 7 August. So it is possible the feature has simply not been built yet rather than being broken. It is still worth raising either way — but say "not built yet" rather than "broken", because that is what the evidence actually supports.

*(Our own record of this: `build/schedule/panel-collapse-2026-08-11/`.)*

**Filed? / Ticket number:** ______________

### Problem 2 - No confirmation message and no Undo after three actions

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

**Exactly how to see it.**

Creating a run of shifts:
1. In the left panel find work order S8685-14158, customer "Brabay Maintenance" (27 lines, 67h 44m). Drag it onto technician Alicia Campbell on Thursday 13 August.
2. Choose "Schedule whole work order", then press the button reading "Create 8 shifts".
3. Watch the screen for ten seconds. Nothing appears.

Moving a shift:
4. Switch to Day view. Find the shift for customer "Pamill Paving", unit 713, "Replace - Rear ramp handles". Drag it sideways. It moves (in our run, from 02:30 to 05:15) and keeps its length.
5. Watch the screen. Nothing appears.

Moving an event:
6. Switch to Week view and find the event named "Test" on 9 August. Drag it to 10 August. It moves.
7. Watch the screen. Nothing appears.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) · [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) · [C30020](https://shopview.testrail.io/index.php?/cases/view/30020)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. An absence is hard to photograph — the most useful picture is the whole window immediately after the action, with a caption saying what should have been there and where.

DUPLICATE SEARCH: this one HAS been done. Every ticket in the SV project whose title mentions "undo" or "toast" was checked; three came back and all three are about other parts of the product (work-order lines, timesheets, imports). Please put that search on the ticket so nobody has to repeat it.

**The strongest argument AGAINST it being a fault.** We could not find one. The description says it plainly, and says it twice, in two different sections.

*(Our own record of this: `build/schedule/drag-retry-2026-08-12/`.)*

**Filed? / Ticket number:** ______________

### Problem 3 - A note added to a shift is kept against that one shift only

**What you will see.** A note added from a shift's detail window is kept against that ONE shift only. Every other shift on the same work order still shows no note.

Measured on work order S-13014, which has 18 shifts on the board: after adding a note to one of them, exactly 1 of the 18 carried it and the other 17 were empty.

Adding, editing and deleting a note all work correctly in themselves. It is only where the note is kept that is wrong.

**What should happen instead.** Notes on the shift detail window should be added, edited and deleted PER WORK ORDER — so a note added from any one shift should be visible from every shift of the same work order.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 4.9 "Shift detail modal", in the list of what that window shows. Quoted word for word: "Notes: add, edit, and delete per work order."

**Exactly how to see it.**

1. Open Schedule and find a shift for work order S-13014, customer "Fuline Enterprises", unit G30 (the card reads "Fuline Enterprises G30 6 Lines"). This work order has 18 shifts on the board, which is why it is the one to use.
2. Click the shift to open its detail window.
3. Press the add-note control, type any text, and confirm it. NOTE: the confirm control is a small icon, not a button labelled Save — if you go looking for a Save button you will think there is no way to save the note.
4. Close the window and open ANY OTHER shift of the same work order S-13014.
5. The note is not there.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)

**What is still needed before filing.** SCREENSHOTS: pictures were taken and are saved with the day's work, but they are NOT marked up. Before filing, annotate two side by side — the shift with the note and another shift of the same work order without it.

DUPLICATE SEARCH: not run for this one. Please search Jira before you file, and record what you searched for.

**The strongest argument AGAINST it being a fault.** This is a real one. The phrase "per work order" sits in a list of things the shift window offers, so somebody could argue it only means "notes about the work order, written from here" rather than "shared across all that work order's shifts". That is the argument a developer would make. It may be worth asking the product owner which was meant before raising a ticket.

*(Our own record of this: `build/schedule/drag-retry-2026-08-12/`.)*

**Filed? / Ticket number:** ______________

### Problem 4 - Clicking a department heading does not collapse it

**What you will see.** Clicking a department heading in the grid does nothing at all. The technician rows under it stay exactly where they were.

The heading is not even clickable: the mouse pointer does not change over it, there is no arrow or chevron on it, and nothing about it tells a screen reader it can be opened or closed.

This was checked hard before it was written down: in BOTH Week and Day view, on ALL THREE headings on the page ("WORK ORDER STATUS", "SERVICE/PARTS" and "SERVICE"), with two different kinds of click — a scripted one and a real mouse click at the heading's own position on screen. The number of rows in the grid was counted before and after every single attempt: 30 rows before, 30 rows after, every time. Nothing popped up either.

**What should happen instead.** Clicking a department heading should collapse that department, hiding its technician rows while the heading itself stays visible. Clicking again should bring them back.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 3.2 "Grid grouping". Quoted word for word:

"Rows are grouped by department under collapsible group headers (e.g. SERVICE/PARTS, ADMINISTRATION), with the department's technicians listed beneath each header."

The word that matters is "collapsible".

**Exactly how to see it.**

1. Open Schedule in Week view. Count the rows in the grid — there were 30 in our run.
2. Click the department heading "WORK ORDER STATUS". Count the rows again. Still 30, and nothing on screen has changed.
3. Repeat on the headings "SERVICE/PARTS" and "SERVICE". Nothing happens on either.
4. Switch to Day view and repeat all three. Nothing happens there either.
5. Rest the mouse on any heading: the pointer stays an ordinary arrow, and there is no chevron or triangle to click.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C29929](https://shopview.testrail.io/index.php?/cases/view/29929)

**What is still needed before filing.** SCREENSHOTS: NONE EXIST for this one. What was recorded is a written measurement — the row counts before and after each click. Before filing you will need to take and annotate a picture yourself: the grid with a box round a department heading, captioned "clicking here does nothing".

DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.

**The strongest argument AGAINST it being a fault.** A developer could fairly say the FUNCTION of hiding a department already exists, just somewhere else: the "Filter & display" menu has Service / Work order status / Service/Parts switches, and turning "Service" off did take the grid from 30 rows down to 9. So the ability is there. The argument back is that the description says the HEADINGS are collapsible, and no one reading "click a department group header" would recognise a menu in the toolbar as the same thing. Worth mentioning both in the ticket so nobody thinks it was missed.

*(Our own record of this: `build/schedule/finish2-2026-08-12/DIVERGENCES.md, section A1`.)*

**Filed? / Ticket number:** ______________

### Problem 5 - The Tech Hours switch turns on but shows nothing

**What you will see.** Turning on "Tech Hours" in the View options menu changes nothing on screen. No working hours appear beside any technician's name. The technician rows are identical before and after, letter for letter.

The switch itself works — it moves when you click it. It is what it is supposed to display that never arrives.

**What should happen instead.** With Tech Hours turned on, each technician's working hours should be displayed next to their name in the row heading, and the hours shown should match the hours set up against that technician.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 9, in the table of View options. Quoted word for word:

"Tech Hours | Off | Displays each technician's working hours next to their name."

**Exactly how to see it.**

1. First check the set-up is right, or the empty result would be correct. Go to Settings then Staff, and open a few technicians. In our run six were opened — Admin ShopView, Alicia Campbell, Anthony Mejia, Ayesha Khan, Benjamin Peters and Bilal Muzamil — and ALL SIX had "Set working hours for this technician" switched on, with 7:00 AM to 7:00 PM Monday to Friday.
2. Open Schedule. Note what the technician row headings say.
3. Open the "View options" menu and turn "Tech Hours" on.
4. Look at the technician row headings again. They are unchanged. No hours appear anywhere near any name.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)

**What is still needed before filing.** SCREENSHOTS: NONE EXIST for this one. What was recorded is a written before-and-after comparison of the row headings. Before filing, take a picture of the View options menu with Tech Hours ON and the technician rows visible in the same shot, and annotate it.

DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.

**The strongest argument AGAINST it being a fault.** The obvious one — "no technician has any hours set up, so there is nothing to show" — was checked and ruled out; step 1 is that check, and it is worth repeating yourself so you can say so on the ticket. The other obvious one — "the click never landed" — was also ruled out: the very same menu, driven the very same way, moved three other switches on the same visit ("Show Saturday" took the columns from 7 to 6, "VIN Number" made VINs appear on 27 blocks, and the "Service" switch took the grid from 30 rows to 9). Three switches worked; this one did not.

*(Our own record of this: `build/schedule/finish2-2026-08-12/DIVERGENCES.md, section A2`.)*

**Filed? / Ticket number:** ______________

### Problem 6 - The filter panel has no Priority section

**What you will see.** The filter panel in the left work-order panel has no Priority section, and no High, Medium or Low to choose. It also has no headings at all — the choices are one flat list.

The whole text of the panel reads: "FILTERS · Clear all · Unassigned 22 · Assigned 71 · Approved 92 · Declined 0 · In Progress 0 · Ready for Review 1". That is all of it. It was read on three separate visits, so it is not something scrolled out of sight.

**What should happen instead.** The filter panel should offer three named groups: Assignment (Assigned, Unassigned), Status (the work order statuses), and Priority (High, Medium, Low).

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026, section 5.1, in the table of filter groups. Quoted word for word:

"Filter group / Options — Assignment: Assigned, Unassigned. Status: All work order statuses currently supported in the app. Priority: High, Medium, Low."

**Exactly how to see it.**

1. Open Schedule.
2. In the left work-order panel, open the filter control.
3. Read everything in the panel. There is no "Priority" anywhere, and no High, Medium or Low to choose. There are no group headings either — Assignment and Status choices are mixed into one flat list.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) · [C29945](https://shopview.testrail.io/index.php?/cases/view/29945)

**What is still needed before filing.** SCREENSHOTS: one picture exists (saved with the day's work as "c-29942.png") but it is NOT marked up. Before filing, annotate it — a box round the whole panel with the caption "no Priority group, no headings" is enough.

DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.

**The strongest argument AGAINST it being a fault.** A developer could say Priority does not exist anywhere in the product yet, so a filter for it could not have been built — and that is probably true: a separate test (C38871) records that the work order form has no Priority field either. If you raise this, "the Priority feature is not built" is the more accurate way to put it, and it covers the missing group headings too, which is a genuinely separate and smaller point.

*(Our own record of this: `build/schedule/finish-2026-08-12/DIVERGENCES.md, section E1`.)*

**Filed? / Ticket number:** ______________

### Problem 7 - There is no Unassigned row in the grid

**What you will see.** The grid has no Unassigned row. It shows 30 rows: three department headings ("WORK ORDER STATUS", "SERVICE/PARTS", "SERVICE") and 27 technician rows. None of them is named Unassigned, and the word "unassigned" does not appear anywhere on the page.

So there is nowhere to drop a work order to create a shift with no technician, and nothing to drag one out of.

**What should happen instead.** An Unassigned row should sit inside the grid itself — not in a separate tray at the side — holding shifts that are not yet tied to a technician. Dragging a shift from that row down onto a technician should assign it.

**Where that comes from.** The Schedule product description on Confluence, version 27, read on 11 August 2026. It says this in two places.

Section 3.2, quoted word for word: "Unassigned placeholder. An unassigned row sits within the grid (not a separate tray) and holds shifts that are not yet tied to a technician. Dragging a shift from this row down onto a technician assigns it."

Section 4.2, quoted word for word: "Unassigned shifts are created by dropping a work order (or line) onto the grid's Unassigned placeholder row (an in-grid lane, not a separate tray)."

**Exactly how to see it.**

1. Open Schedule in Week view, on a week that contains shifts with no technician. In our run the grid showed "Aug 10 - 16, 2026" and there were shifts with no technician inside it — against work orders S-13014 and S-12876, on 10, 11 and 13 August.
2. Read every row name down the left-hand side. There are 30. Three are department headings; the other 27 are technicians. None is called Unassigned.
3. Search the page for the word "unassigned". It does not appear.

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) · [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) · [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) · [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)

**What is still needed before filing.** SCREENSHOTS: a full-page picture exists (saved with the day's work as "unassigned.png") but it is NOT marked up. Before filing, annotate it — the row names down the left with a caption saying which row should have been there.

DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.

**The strongest argument AGAINST it being a fault.** The three obvious ones were checked and ruled out already, and saying so on the ticket is what will stop it being closed: (1) "the row is empty so it is hidden" — no, there were shifts with no technician on the board at the time, 13 of them; (2) "a switch in the toolbar is hiding it" — no, both toolbar menus were opened and read in full and neither mentions unassigned; (3) "it is below the fold" — no, the row names were read from the whole page, not just the visible part, and a full-page picture was taken.

*(Our own record of this: `build/schedule/finish3-2026-08-12/DIVERGENCES.md, section 1`.)*

**Filed? / Ticket number:** ______________

### Problem 8 - The hover summary hides the VIN unless a display switch is on

**What you will see.** Rest the mouse on a shift and a small summary appears. Its second line shows the unit number only — for example "G30".

Turn the "VIN Number" switch on in the View options menu and rest the mouse on the same shift again: now it reads "G30 - VIN 12-06696".

So the VIN in the hover summary is tied to that display switch.

**What should happen instead.** The hover summary should show the VIN whenever the unit has one, whichever way the "VIN Number" switch is set. That switch is meant to control the shift blocks in the grid, not the hover summary.

**Where that comes from.** The product owner (Branko) answered this directly on 31 July 2026, question 6, choosing option A. Quoted word for word:

"A. Vin is always visible on hover regardless of the toggle"

The Schedule product description, version 27, section 4.13, agrees with him — it lists what the hover summary shows with no condition attached: "Shift tooltip: customer name (plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range".

**Exactly how to see it.**

1. Open Schedule and make sure the "VIN Number" switch in the View options menu is OFF.
2. Rest the mouse on a shift whose unit has a VIN. In our run this was unit G30, VIN 12-06696.
3. Read the second line of the summary that appears: it says "G30" and no VIN.
4. Now turn the "VIN Number" switch ON.
5. Rest the mouse on the same shift again. The second line now reads "G30 - VIN 12-06696".

**Where we saw it.** Build v3.5-65d6500 on https://sv8685.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)

**What is still needed before filing.** PLEASE DO NOT FILE THIS ONE WITHOUT ASKING FIRST — see the column to the left. It is the one item on this sheet where a ticket would land in the middle of a disagreement that has not been settled.

SCREENSHOTS: none marked up. Two would be needed, the same shift with the switch off and on.

DUPLICATE SEARCH: partly done — SV-8835 is known and is named opposite.

**The strongest argument AGAINST it being a fault.** This is the strongest counter-argument on the whole sheet, and it is why this row says ask before filing.

First, the product description contradicts itself. Section 4.13 lists the VIN in the hover summary with no condition, but the View options table in section 9 says the switch "Shows the VIN number as an additional line on shift blocks (day and week views) and in hover tooltips" — which puts the hover summary UNDER the switch, exactly as the build behaves.

Second, and more awkward: a ticket already exists saying the OPPOSITE of this — SV-8835 argues the hover summary SHOULD hide the VIN when the switch is off. So filing this would put two tickets on the same screen asking for opposite things.

What actually needs to happen is that the product owner fixes the section 9 wording so it matches his own answer. That is a question, not a defect ticket.

*(Our own record of this: `build/schedule/verify-final-2026-08-12/FINDINGS.md, section 1 · build/schedule/provenance-2026-08-04/PO-RULING-DEFENCE.md, A-ii`.)*

**Filed? / Ticket number:** ______________

---

## 3. Old tickets that mislead

Four entries. Each one is a place where a ticket and the product no longer agree, so anyone reading the ticket today would get the wrong idea.

WHAT TO DO WITH THIS TAB: nothing has been done. We have not reopened, closed or commented on any of these, and we made no Jira calls at all while writing this sheet. The last column is what we would suggest, and it is only a suggestion - a person has to decide.

The tests themselves are already honest about these, so you can run them normally. They tell you what you will see and what to do about it.

### 1. [SV-9090](https://shopview.atlassian.net/browse/SV-9090)

**What the ticket says.** Raised on 10 August: when you spread a job across several days, it always starts on the day you dropped it on, and there is no way to choose a different start day.

The ticket is CLOSED, marked obsolete.

**What actually happens now.** It still happens. There is no start-date control anywhere in the spread window.

Before saying that, all five choices in the "How much to schedule" list were opened in turn — including the two that reveal an extra control — because a field that only shows under one option would otherwise look missing. "Until a date..." reveals a field called "Finish by" and "Specific hours..." reveals an hours stepper. Both of those set the END, not the start.

**Tests affected.** [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)

**What we suggest (a suggestion only).** Reopen it — or reopen SV-8855 instead, but not both: they are the same fault reported twice. A person needs to decide which one survives. We have not touched either.

### 2. [SV-8855](https://shopview.atlassian.net/browse/SV-8855)

**What the ticket says.** Raised on 4 August, by us: the same fault as SV-9090 above — the spread always begins on the day you dropped on.

The ticket is CLOSED, marked obsolete.

**What actually happens now.** It still happens — same evidence as the row above. Both tickets describe one fault, and both are closed while the fault is live.

**Tests affected.** [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)

**What we suggest (a suggestion only).** The same decision as the row above. Our suggestion is to reopen ONE of SV-9090 and SV-8855 and to link the other to it as a duplicate.

### 3. [SV-8957](https://shopview.atlassian.net/browse/SV-8957)

**What the ticket says.** The alternative to dragging — a control on the work-order card that arms it so you can place it with a click instead of a drag — was removed.

The ticket is CLOSED, marked obsolete.

**What actually happens now.** It is still gone. Looked for in three ways — when the page loads, when the mouse rests on the card, and inside the card's expanded line list — in a state where it must appear (21 work orders on screen, approved lines, editing rights held). It is not there in any of them.

This matters more than it sounds: it is the only way to place a job for anyone who cannot drag with a mouse.

**Tests affected.** [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)

**What we suggest (a suggestion only).** Reopen it. The test itself is already honest — it tells the tester exactly what they will see and that the ticket was closed without a fix — so nothing is blocked either way. This is a tidiness and truthfulness call.

### 4. [SV-9005](https://shopview.atlassian.net/browse/SV-9005)

**What the ticket says.** The "Finish by" control in the spread window may not respond at all — pressing its arrows does nothing to the date or the preview.

The ticket is OPEN.

**What actually happens now.** It is fixed. This is the opposite case to the three above, and worth knowing before somebody spends time on it.

The control responds fully in both directions and the preview follows it: from "Tue, Aug 11 / 1 shift", five presses forward gave "Sun, Aug 16 / 4 shifts", five more gave "Fri, Aug 21 / 9 shifts", and three presses back gave "Tue, Aug 18".

**Tests affected.** [C29980](https://shopview.testrail.io/index.php?/cases/view/29980)

**What we suggest (a suggestion only).** Close it. The test has already been corrected so it no longer tells a tester to expect a dead control — if the ticket stays open, somebody will eventually put that expectation back and the test will start failing a working build.

---

## 4. Tests that cannot be run yet

Mark every test on this tab BLOCKED. Do not mark any of them Passed.

Each row says in one plain sentence what the test is waiting on. The same sentence is on the test itself, at the bottom of its Expected Results. They are grouped by what they are waiting on, so one thing being sorted out releases a whole group at once.

TWO THINGS TO LOOK AT FIRST. (1) The column 'Already has a result?' - ten of these tests already say Passed in the test run, and they are shaded pink. Those need changing to Blocked; they are the most useful thing on this tab. (2) The biggest single group is 'The feature or control is not in the build yet' with 12 tests in it.

The first group, 'A problem was found but no ticket exists for it yet', is the one written up in full on tab 2. Those tests are waiting on a ticket that nobody has been allowed to raise yet - which is exactly what tab 2 is for.

The 'What it is waiting on' wording is quoted from the test itself, so it matches what you will read on the case. The only thing changed is that document reference codes have been spelled out in plain words.

### A problem was found but no ticket exists for it yet - 8 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | Collapsing a department header hides its technician rows | the control this test needs does not exist in this build; a ticket cannot be raised yet | Passed ⚠️ |
| [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | Priority filter offers High, Medium, Low and narrows the list accordingly | the Priority filter this test needs does not exist in this build; a ticket cannot be raised yet | Blocked |
| [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | Confirming the spread creates a linked series of daily shifts | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | - |
| [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | Dragging a shift sideways moves its start time in 15-minute steps | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | Notes can be added, edited, and deleted per work order from the modal | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | Events can be dragged to another technician or another day | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | Shift hover tooltip shows the full shift summary incl. up to 3 line names | an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker | Passed ⚠️ |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | Tech Hours toggle displays each technician's working hours next to their name | the toggle displays nothing in this build; a ticket cannot be raised yet | - |

### The feature or control is not in the build yet - 12 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) | Dropping onto the Unassigned row creates a shift with no technician | the Unassigned row does not exist in the build, so this cannot be run | - |
| [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) | Unassigned shift start time uses business hours or the default | the Unassigned row does not exist in the build, so this cannot be run | - |
| [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | Dragging an unassigned shift onto a technician row assigns it | the Unassigned row does not exist in the build, so this cannot be run | - |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Dashboard shows one schedule row per work order even with many shifts | the Dashboard section this test needs does not exist in the build | - |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | A work order created with an appointment shows up on the Schedule board | work order creation offers no appointment in the build | - |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | the Priority field this test needs does not exist in the build | - |
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Panel button sits left of Today and its tooltip names what it will do | the panel button does not exist in this build | - |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Panel button hides the left panel and the grid widens into the space | the panel button does not exist in this build | Failed |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | What you had set up in the left panel survives hiding and showing it | the panel button does not exist in this build | - |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | On a narrow window the panel button still works and your choice holds | the panel button does not exist in this build | - |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Menus and pop-up windows reposition when the left panel is hidden | the panel button does not exist in this build | - |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Hiding the panel lasts for the rest of your sign-in but is not saved | the panel button does not exist in this build | - |

### Waiting on a second sign-in as a different user - 11 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | 'My Shifts' filters the grid to only the current user's shifts | point 4 needs a user with no staff record of their own; points 1 to 3 are observed and pass | Failed |
| [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | needs a second sign-in as a user without the Schedule permission | Passed ⚠️ |
| [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | Schedule: Edit unlocks all creation and modification interactions | needs a second sign-in as an edit-without-delete user | Passed ⚠️ |
| [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | Edit without Delete: the user can create and modify but not remove | needs a second sign-in as an edit-without-delete user | Passed ⚠️ |
| [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | Schedule: Delete unlocks deleting shifts and events | needs a second sign-in as a delete-capable user | Passed ⚠️ |
| [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | Schedule without Work Orders: View - the sidebar hides the work order list | needs a second sign-in as a user who cannot see work orders | Passed ⚠️ |
| [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | Clocking into line tasks is gated by the staff 'Time Clock' setting | needs a second sign-in as each of the two staff members | - |
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | With Work Orders: View OFF, work order details on shifts are hidden | needs a second sign-in as a user who cannot see work orders | Blocked |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | points 1 and 3 need a user with no Schedule permission and a user with Schedule Edit but not Delete; point 2 is observed and passes | - |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API - No pricing fields in Schedule responses; WO details need Work Orders View | point 2 needs a user without Work Orders View; point 1 is observed and passes | - |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Default roles start at the Schedule level the spec names (view-only vs edit) | needs a second sign-in as a holder of each permission level | - |

### Waiting on an answer from the product owner - 3 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | Spread uses the tech's working hours; skips weekends only when hours not set | waiting on the product owner's answer, and the question has not been sent yet | - |
| [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | Shop closures do NOT block spread in V1 - shifts can land on closure days | waiting on the product owner's answer, and the shop-closure setting does not exist in the build | - |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Month view: dragging a work order onto a day creates a shift for that day | waiting on the product owner's answer, and the question has not been sent yet | - |

### The set-up this test needs cannot be produced on this environment - 1 test

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Shifts and events created before the Schedule rewrite still appear after it | cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed | - |

---

*Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z. The Schedule branch was on `v3.5-85ee495` when this was written (last rebuilt Wed, 12 Aug 2026 12:11:04 GMT). No Jira call was made while writing this sheet, and nothing in TestRail was changed.*
