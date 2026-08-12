# Filters - handover for the manual tester, 12 August 2026

**For the manual tester on Filters. Release is tomorrow.**

> This is the plain-text twin of `Filters_Tester-Handover_2026-08-12.xlsx`. Same content, same four sections.

---

## 1. Read me first

Release is tomorrow. This sheet covers Filters only, so everything in it is yours to act on. It has three lists in it, one per tab, and this page explains what they are and the one rule that matters most.

You do not need to know anything about how the tests were written to use it. Row 5 says exactly when these numbers were read, and why that matters today.

### 1. The one rule that matters most

If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.

Every test that cannot be run says so in its own words, at the very bottom of its Expected Results. If you open a test and it tells you it is waiting on something, that is the test telling you it cannot be judged today. Mark it Blocked and move on.

*Why it matters:* This is not a formality. It has already happened on this project. Read from TestRail as this sheet was written: four Filters tests that cannot currently be judged already have a Passed result recorded against them. A test nobody could run cannot have passed. They are listed on the last tab and shaded in pink, and they need changing to Blocked before anyone reads them as evidence that the feature works.

Across all three projects together the figure is 15.

### 2. What is on each tab

Tab 2, "Problems found, not reported". One real fault we found and confirmed on this project. No ticket has been raised for it. If you want to raise the ticket yourself, everything you need to paste in is on the row, and there is a blank column for you to write the ticket number in.

Tab 3, "Old tickets that mislead". One case where what a ticket says and what the product actually does no longer match.

Tab 4, "Tests that cannot be run yet". All 18 of them, with one plain sentence each, grouped by what they are waiting on.

*Why it matters:* Tabs 2 and 3 are suggestions for a person to action. Nothing on them has been done for you, and nothing has been raised in Jira - we were asked to hold off on that. That is why you are getting this sheet: so you can decide for yourself whether each one is worth raising.

### 3. How to mark a test, in four lines

The test tells you it is waiting on something -> Blocked.

The test tells you what you will see today, and that is what you see -> Failed, and raise nothing new. It is already known.

The test tells you what you will see today, and you see something different -> that is a NEW problem. Please report it.

The test says nothing special and it works -> Passed.

*Why it matters:* Anything else, or the test simply does not make sense to you: mark it Blocked and tell the QA lead. Never guess a result.

### 4. How many Filters tests there are

97 to run.

18 to skip - they are all on tab 4.

115 in total.

*Why it matters:* A few Filters tests were written by a colleague and are not counted above and not listed here. They are not ours to change and not yours to compare against this sheet: 5 of them.

### 5. When these numbers were taken

Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z.

PLEASE NOTE THE TIME. Other people are working on these same tests today, and the numbers move. Treat this as a photograph taken at that minute, not a permanent count.

If a test on the last tab no longer says it is waiting on something when you open it, believe the test, not this sheet.

*Why it matters:* As an example of how fast this moves: an earlier count this morning had 28 Schedule tests on the skip list. By the time this sheet was written it was 35, because more tests had been checked and found to be waiting on something. Neither figure was wrong - they were different minutes.

### 6. One thing to know about the build

The Filters test branch is at v3.7-20e801b right now.

Most of what is on tabs 2 and 3 was seen on v3.6-3e9dd6d.

The Filters build was rebuilt at 12 Aug 2026 12:09:14 GMT, so it is NEWER than the one most of this was checked against. What a test EXPECTS does not change when the build changes - that comes from the written product description. What CAN change is the exact wording of a button, or where something sits on screen.

*Why it matters:* BECAUSE THE BUILD HAS MOVED SINCE, please spend two minutes confirming a problem on tab 2 still happens before you raise a ticket for it. A ticket for something that was fixed this morning is worse than no ticket.

---

## 2. Problems found, not reported

One problem on Filters. It was seen with our own eyes on the build named on its row, and no Jira ticket covers it.

THE BUILD HAS MOVED SINCE THESE WERE SEEN. They were seen on v3.6-3e9dd6d; the branch is now on v3.7-20e801b. Please confirm the problem still happens before you raise a ticket for it - it takes two minutes.

WHAT TO DO WITH THIS TAB: nothing, unless you want to. We were asked to hold off raising tickets, so these are written out in full in case you would rather raise them yourself. Everything you need is on the row. Use the last column to write down the ticket number if you do raise one.

BEFORE YOU RAISE ONE, PLEASE READ THE LAST TWO COLUMNS. One says what is still missing; the other says the strongest argument AGAINST it being a fault, so you can answer that first. A ticket that a developer can argue with costs more than no ticket at all.

### Problem 1 - When nothing matches, there is no way to clear just the search

**What you will see.** Put a filter on AND type something in the page search box so that nothing matches. The table is replaced by the message "No work orders match your filters".

Two things are wrong with that screen.

First, the message blames the filters only. It never mentions the search — not even when the search is the ONLY thing narrowing the list.

Second, the only thing it offers you is a "Clear Filters" link. There is no offer to clear just the search.

**What should happen instead.** The message should mention BOTH the filters and the search, not the filters alone.

And because a search is active, the screen should offer a way to clear the filters AND a separate way to clear the search, so that each can be undone on its own — clearing the filters should leave your typed word in place, and clearing the search should leave the filters in place.

**Where that comes from.** The Filters product description on Confluence, version 19, read on 11 August 2026. Two requirements.

Quoted word for word: "The empty state includes a prompt or link to clear filters."

And, quoted word for word: "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters."

**Exactly how to see it.**

1. Open Work Orders on the All tab.
2. Turn on any Status filter — Approved is fine.
3. Type a word into the page Search box that matches nothing. We used "zzzznomatchqqq".
4. The table empties and the message reads "No work orders match your filters". Read it: it does not mention the search at all.
5. Look at what the message offers you. There is one link, "Clear Filters". There is nothing offering to clear the search.
6. Now take the filter off and leave only the search. The message is word for word the same — still blaming the filters.

**Where we saw it.** Build v3.6-3e9dd6d on https://sv8785.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)

**What is still needed before filing.** SCREENSHOTS: two pictures exist and are saved with the day's work ("empty-state-filter-plus-search.png" and "empty-state-search-only.png"), but they are NOT marked up. Before filing, annotate one — a box round the message and the single "Clear Filters" link, captioned "no way to clear the search".

DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.

RE-CHECK IT FIRST: this was seen on build v3.6-3e9dd6d, and the Filters branch was rebuilt at 12:09 today. It takes two minutes to confirm on the build you are on.

**The strongest argument AGAINST it being a fault.** This one has a real counter-argument and you should get in front of it. The search box itself has its own little clear (x) control, and that control IS present on this screen — it was recorded as present. So a developer can say "the search can be cleared, just not from the message." The answer back is that the requirement says each is cleared independently FROM THE EMPTY STATE, and the message is the empty state. Say both things in the ticket; it will not survive if you only say the first.

*(Our own record of this: `build/filters/finish-2026-08-12/DIVERGENCES.md, section 2`.)*

**Filed? / Ticket number:** ______________

---

## 3. Old tickets that mislead

One entry. It is a place where a ticket and the product no longer agree, so anyone reading that ticket today would get the wrong idea.

WHAT TO DO WITH THIS TAB: nothing has been done. We have not reopened, closed or commented on any of these, and we made no Jira calls at all while writing this sheet. The last column is what we would suggest, and it is only a suggestion - a person has to decide.

The tests themselves are already honest about these, so you can run them normally. They tell you what you will see and what to do about it.

### 1. [SV-8875](https://shopview.atlassian.net/browse/SV-8875)

**What the ticket says.** On a phone, tapping a choice inside a single filter's own sheet applies it straight away instead of waiting for you to press "Apply Filters".

The ticket is OPEN, and two of our tests point at it and tell the tester to expect a failure.

**What actually happens now.** Part of it may already be fixed, and the evidence is your own colleague's test run from today.

One of the two tests, C29625, was marked PASSED in the test run this morning by Ahtasham Amjad — while the test itself still says "expect this to fail". The other one, C29624, was marked Failed on the same run, which is what the ticket predicts.

We did NOT re-check this ourselves and we made no Jira call, so this is a signal, not a verdict.

**Tests affected.** [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625)

**What we suggest (a suggestion only).** Somebody should check C29625 on a phone once. If it really passes now, the ticket has been part-fixed and the note on that test needs taking off, or the next person to run it will report a working screen as broken. This is exactly the case the test itself asks you to report: "if it PASSES, the fix has shipped, tell the QA lead."

---

## 4. Tests that cannot be run yet

Mark every test on this tab BLOCKED. Do not mark any of them Passed.

Each row says in one plain sentence what the test is waiting on. The same sentence is on the test itself, at the bottom of its Expected Results. They are grouped by what they are waiting on, so one thing being sorted out releases a whole group at once.

TWO THINGS TO LOOK AT FIRST. (1) The column 'Already has a result?' - four of these tests already say Passed in the test run, and they are shaded pink. Those need changing to Blocked; they are the most useful thing on this tab. (2) The biggest single group is 'Waiting on an answer from the product owner' with 13 tests in it.

The first group, 'A problem was found but no ticket exists for it yet', is the one written up in full on tab 2. Those tests are waiting on a ticket that nobody has been allowed to raise yet - which is exactly what tab 2 is for.

The 'What it is waiting on' wording is quoted from the test itself, so it matches what you will read on the case. The only thing changed is that document reference codes have been spelled out in plain words.

### The feature or control is not in the build yet - 3 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports, detail tabs) | cannot be run yet - its own precondition needs the page-search rollout finished everywhere, and it is still part-way through | Blocked |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate search | only half of it can be run - the report pages have no page search box yet, so the report-tab half cannot be tested | - |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a phone as Work Orders do | the new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet | - |

### Waiting on an answer from the product owner - 13 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Estimates tab | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: Status chip is greyed out and pre-filled; other four work | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: Status chip is greyed out and pre-filled; other four work | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs and comes back on the All tab | waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification | Passed ⚠️ |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom start/end range | waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states the periods it must offer | - |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear Selection | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new filter bar | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change covers | Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons each report should show | - |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Transaction Type, etc.) | waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do | - |

### Waiting on the QA lead's ruling - 1 test

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | held for the QA lead's ruling only - the behaviour IS documented (the written description says each Parts view and each Report tab keeps its own separate filter set and each persists independently), so the earlier reason that no source described it was wrong | - |

### The set-up this test needs cannot be produced on this environment - 1 test

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the update | cannot be run - it needs an account whose filters were saved before the redesign, and none exists | - |

---

*Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z. The Filters branch was on `v3.7-20e801b` when this was written (last rebuilt Wed, 12 Aug 2026 12:09:14 GMT). No Jira call was made while writing this sheet, and nothing in TestRail was changed.*
