# Report Suite - handover for the manual tester, 12 August 2026

**For the manual tester on Report Suite. Release is tomorrow.**

> This is the plain-text twin of `Report-Suite_Tester-Handover_2026-08-12.xlsx`. Same content, same four sections.

---

## 1. Read me first

Release is tomorrow. This sheet covers Report Suite only, so everything in it is yours to act on. It has three lists in it, one per tab, and this page explains what they are and the one rule that matters most.

You do not need to know anything about how the tests were written to use it. Row 5 says exactly when these numbers were read, and why that matters today.

### 1. The one rule that matters most

If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.

Every test that cannot be run says so in its own words, at the very bottom of its Expected Results. If you open a test and it tells you it is waiting on something, that is the test telling you it cannot be judged today. Mark it Blocked and move on.

*Why it matters:* This is not a formality. It has already happened on this project. Read from TestRail as this sheet was written: one Report Suite test that cannot currently be judged already has a Passed result recorded against them. A test nobody could run cannot have passed. They are listed on the last tab and shaded in pink, and they need changing to Blocked before anyone reads them as evidence that the feature works.

Across all three projects together the figure is 15.

### 2. What is on each tab

Tab 2, "Problems found, not reported". One real fault we found and confirmed on this project. No ticket has been raised for it. If you want to raise the ticket yourself, everything you need to paste in is on the row, and there is a blank column for you to write the ticket number in.

Tab 3, "Old tickets that mislead". Three cases where what a ticket says and what the product actually does no longer match.

Tab 4, "Tests that cannot be run yet". All 42 of them, with one plain sentence each, grouped by what they are waiting on.

*Why it matters:* Tabs 2 and 3 are suggestions for a person to action. Nothing on them has been done for you, and nothing has been raised in Jira - we were asked to hold off on that. That is why you are getting this sheet: so you can decide for yourself whether each one is worth raising.

### 3. How to mark a test, in four lines

The test tells you it is waiting on something -> Blocked.

The test tells you what you will see today, and that is what you see -> Failed, and raise nothing new. It is already known.

The test tells you what you will see today, and you see something different -> that is a NEW problem. Please report it.

The test says nothing special and it works -> Passed.

*Why it matters:* Anything else, or the test simply does not make sense to you: mark it Blocked and tell the QA lead. Never guess a result.

### 4. How many Report Suite tests there are

438 to run.

42 to skip - they are all on tab 4.

480 in total.

*Why it matters:* A few Report Suite tests were written by a colleague and are not counted above and not listed here. They are not ours to change and not yours to compare against this sheet: 12 of them.

### 5. When these numbers were taken

Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z.

PLEASE NOTE THE TIME. Other people are working on these same tests today, and the numbers move. Treat this as a photograph taken at that minute, not a permanent count.

If a test on the last tab no longer says it is waiting on something when you open it, believe the test, not this sheet.

*Why it matters:* As an example of how fast this moves: an earlier count this morning had 28 Schedule tests on the skip list. By the time this sheet was written it was 35, because more tests had been checked and found to be waiting on something. Neither figure was wrong - they were different minutes.

### 6. One thing to know about the build

The Report Suite test branch is at v3.7-4626299 right now.

Most of what is on tabs 2 and 3 was seen on v3.7-4626299.

The build has not changed since this was checked, so what is written here should match what you see.

*Why it matters:* So if a button is named slightly differently from what a test says, that is worth telling the QA lead, but it is not automatically a fault in the product.

---

## 2. Problems found, not reported

One problem on Report Suite. It was seen with our own eyes on the build named on its row, and no Jira ticket covers it.

WHAT TO DO WITH THIS TAB: nothing, unless you want to. We were asked to hold off raising tickets, so these are written out in full in case you would rather raise them yourself. Everything you need is on the row. Use the last column to write down the ticket number if you do raise one.

BEFORE YOU RAISE ONE, PLEASE READ THE LAST TWO COLUMNS. One says what is still missing; the other says the strongest argument AGAINST it being a fault, so you can answer that first. A ticket that a developer can argue with costs more than no ticket at all.

### Problem 1 - The Location column cannot be turned on, on five of the six reports

**What you will see.** On five of the six reports the Location column only appears if you have ALL locations chosen. Pick a single location and it vanishes. And it is never in the column list, so you cannot turn it on or off yourself.

Measured today on all six reports, with one location chosen and then with all of them:

- Work In Progress: absent with one, present with all, NEVER in the column list
- Sales By Customer: the same
- Technician Utilization: the same
- Sales By Representative: the same
- Parts Velocity: the same
- Inventory Value: present either way, and IS in the column list — this is the only one that behaves correctly

On Work In Progress the column list has 15 entries and Location is not one of them, both before and after switching to all locations.

**What should happen instead.** The Location column should be offered in the column list to anybody who can REACH more than one location — whatever they currently have chosen. For that person it should be shown by default and they should be able to switch it on and off. Somebody who can reach only one location should never see it.

The test is what the person can reach, not what they have picked.

**Where that comes from.** The Work In Progress product description on Confluence, and the same rule in the Sales By Customer and Technician Utilization descriptions, all amended on 5 to 6 August 2026 and read on 12 August 2026. Quoted word for word:

"The Location column is offered in the column selector to any user with access to more than one location; for that user it is shown by default and can be toggled on or off. A user with access to only one location never sees it."

**Exactly how to see it.**

1. Sign in as a user who can reach more than one location. The account used could reach five: "QB Location", "3rd", "L'Espace Tralala Yoga", "Staging Heavy Duty - 9919" and "Staging Lethbridge - 4310".
2. Open Work In Progress. The location filter reads a single location — "Staging Heavy Duty - 9919". Read the column headings: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, Total. There is no Location column.
3. Open the column list. It has 15 entries and Location is not one of them, so there is nothing to switch on.
4. Change the location filter to "All locations". A Location column now appears in the table, between Asset and Advisor.
5. Open the column list again. Location is STILL not in it — the column appeared without you being able to control it.
6. Repeat on Sales By Customer, Technician Utilization, Sales By Representative and Parts Velocity — all four behave the same way.
7. Repeat on Inventory Value. This one is correct: the column is there either way, and it IS in the column list.

**Where we saw it.** Build v3.7-4626299 on https://sv8582.qa.shopview.com. Desktop browser, signed in as an administrator (admin@shopview.com), location "Staging Heavy Duty - 9919".

**Tests affected.** [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) · [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) · [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) · [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)

**What is still needed before filing.** READ THIS FIRST: a ticket already exists for part of this — SV-8954 — but it describes Technician Utilization ONLY, and it was closed as obsolete on 9 August. So this is not a clean new report. The tidiest thing is probably to REOPEN SV-8954 and widen it to all five reports rather than raise a second ticket beside it; see tab 3.

SCREENSHOTS: pictures of all six reports exist and are saved with the day's work, but they are NOT marked up. Before filing, annotate two side by side — the column list with no Location in it, and the table showing a Location column anyway.

DUPLICATE SEARCH: only SV-8954 was found and it is named above. Please run a proper search before filing and record what you searched for.

**The strongest argument AGAINST it being a fault.** The weakest point is not the finding, it is the paperwork: a developer can reasonably say "this is already reported and it was closed", so a brand-new ticket will look like a duplicate. That is why reopening and widening the existing one is the better route. On the substance itself there is no good argument the other way — the wording is plain, it was changed deliberately on 5 to 6 August, and one of the six reports already does exactly what it asks for, which shows it is buildable.

*(Our own record of this: `build/report-suite/verify-final-2026-08-12/DIVERGENCES.md, section 2`.)*

**Filed? / Ticket number:** ______________

---

## 3. Old tickets that mislead

Three entries. Each one is a place where a ticket and the product no longer agree, so anyone reading the ticket today would get the wrong idea.

WHAT TO DO WITH THIS TAB: nothing has been done. We have not reopened, closed or commented on any of these, and we made no Jira calls at all while writing this sheet. The last column is what we would suggest, and it is only a suggestion - a person has to decide.

The tests themselves are already honest about these, so you can run them normally. They tell you what you will see and what to do about it.

### 1. 57 tickets at once

**What the ticket says.** This row is not about one ticket. On 9 August, between 22:40:38 and 22:42:46 — a window of two minutes and eight seconds, with tickets closing about two seconds apart — 57 defect tickets were all set to closed/obsolete.

That is a bulk close, not one-by-one checking.

**What actually happens now.** It matters to you because 75 of the Report Suite tests carry a note saying "this test is expected to fail today, here is the ticket that explains why" — and for those 75 tests the ticket now reads Done. Open one tomorrow morning and you would reasonably conclude the test should now pass.

Two of the 57 were actually checked on the build:

- SV-8954, the Location column: STILL BROKEN, and on five reports rather than the one the ticket names. See tab 2.
- SV-8907, Work In Progress downloads: GENUINELY FIXED. Eight downloads out of eight worked.

So one closed ticket is fixed and another is not. The status tells you nothing.

**What we suggest (a suggestion only).** This is a question for the QA lead, not something to act on: were those 57 closed because the work was done, or because the list was being tidied before release? The answer changes what you should do with 75 tests. Nobody has changed any of those 75 notes — changing them because a ticket says Done would be exactly the mistake this row is warning about.

In the meantime: run each test as written. The test tells you what to expect and what to do if you see something different.

### 2. [SV-8954](https://shopview.atlassian.net/browse/SV-8954)

**What the ticket says.** The Technician Utilization Location column disappears when a single location is chosen.

The ticket is CLOSED, marked obsolete — one of the 57 above.

**What actually happens now.** It still happens, and it is worse than the ticket says. The ticket names Technician Utilization only; it is actually on FIVE of the six reports. Only Inventory Value behaves correctly. Re-proved today on all six — the full detail is on tab 2.

**Tests affected.** [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) · [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) · [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) · [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)

**What we suggest (a suggestion only).** Reopen it and widen it from one report to five, rather than raising a new ticket beside it. A person has to decide that; we have not touched it.

### 3. [SV-8907](https://shopview.atlassian.net/browse/SV-8907)

**What the ticket says.** Work In Progress downloads fail with a server error on any tab that has rows in it.

**What actually happens now.** It is FIXED. Proven by 8 downloads out of 8: all four Work In Progress tabs (with 15, 3, 4 and 15 rows in them — every one a tab WITH rows, which is exactly the state the ticket says must fail), each in both formats. Every one produced a real file, all eight files were different sizes, and the product showed "Success - Data exported successfully."

HONEST NOTE ON ITS STATUS: our own two records from today disagree about whether this ticket is still open or was closed on 9 August. We made no Jira call at all, so we cannot settle it — please just open the ticket and look. Either way the build behaviour above is what was measured.

**Tests affected.** [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) · [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) · [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) · [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) · [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) · [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) · [C30518](https://shopview.testrail.io/index.php?/cases/view/30518)

**What we suggest (a suggestion only).** If it is still open, close it. The seven tests listed here have already been corrected so they no longer tell a tester to expect a failure — if the ticket stays open, somebody will eventually re-add that expectation and the tests will start failing a working build.

---

## 4. Tests that cannot be run yet

Mark every test on this tab BLOCKED. Do not mark any of them Passed.

Each row says in one plain sentence what the test is waiting on. The same sentence is on the test itself, at the bottom of its Expected Results. They are grouped by what they are waiting on, so one thing being sorted out releases a whole group at once.

TWO THINGS TO LOOK AT FIRST. (1) The column 'Already has a result?' - one of these tests already says Passed in the test run, and it is shaded pink. Those need changing to Blocked; they are the most useful thing on this tab. (2) The biggest single group is 'The set-up this test needs cannot be produced on this environment' with 17 tests in it.

(3) At the very bottom there is a short extra group of 3 tests that are NOT marked to skip but which our own notes say cannot be run. They were meant to be marked and the change never went through. Please treat them the same way - Blocked, not Passed - and tell the QA lead.

The first group, 'A problem was found but no ticket exists for it yet', is the one written up in full on tab 2. Those tests are waiting on a ticket that nobody has been allowed to raise yet - which is exactly what tab 2 is for.

The 'What it is waiting on' wording is quoted from the test itself, so it matches what you will read on the case. The only thing changed is that document reference codes have been spelled out in plain words.

### A problem was found but no ticket exists for it yet - 3 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | First visit shows the default columns; the rest are in the column selector | the build does not follow the ratified Location rule; the defect is written up in the team's own notes and needs the QA lead's permission before a ticket exists to point at | - |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Location column: shown to any multi-location user, Multiple on aggregating rows | the build does not follow the ratified Location rule; the defect is written up in the team's own notes and needs the QA lead's permission before a ticket exists to point at | - |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | A hand-made Location column choice is remembered like any other column | the build does not follow the ratified Location rule; the defect is written up in the team's own notes and needs the QA lead's permission before a ticket exists to point at | - |

### The feature or control is not in the build yet - 1 test

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | Selector offers only reps whose sales-representative toggle is on | this part of the report is not built yet | - |

### Waiting on a second sign-in as a different user - 7 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment | - |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization: Location filter hidden for a one-location user | needs a second sign-in as a user who can reach only one location, and there is one shared sign-in on this environment | - |
| [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | Inventory Value: the Location filter is hidden for a one-location user | needs a second sign-in as a user with access to only one location | - |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | A user with ordinary reports access can open Inventory Value | needs a second sign-in as a user holding only the ordinary reports access | - |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | Without reports access Inventory Value is absent from the navigation | needs a second sign-in as a user with no reports access | - |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | You cannot reach an invoice you have no permission to open | waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales | - |
| [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | Invoice # and customer name when you cannot open what they point at | waiting on one answer from the product owner about what these two values should look like, and it needs a second sign-in that cannot open work orders, part sales or customers | - |

### Waiting on an answer from the product owner - 6 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | Opening an invoice you lack permission for shows access-denied; back works | waiting on one answer from the product owner about whether this person is given a link at all | - |
| [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | Sales Representative selector shows on WO and Part Sale, not on imported | waiting on an answer from the product owner | - |
| [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | Customer record shows a "Sales Representative" row; "Unassigned" when none | waiting on an answer from the product owner | - |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Each qualifying work order appears exactly once in exactly one tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | Passed ⚠️ |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | - |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Approved started-boundary: time or part received vs neither decides the tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs | - |

### Depends on a nightly/background job the product never shows you - 8 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | Nightly snapshot records one row per then-open job per calendar date | the nightly capture is written by a background process and nothing in the product reads it back in this version | - |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | Captured Earned and Remaining use the same maths as the on-screen report | the nightly capture is written by a background process and nothing in the product reads it back in this version | - |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Nightly snapshot spans every location with no user location filter | the nightly capture is written by a background process and nothing in the product reads it back in this version | - |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped | the nightly capture is written by a background process and nothing in the product reads it back in this version | - |
| [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Nightly snapshot records one row per in-stock non-core part per location | the nightly capture is a server-side job and its stored rows are not reachable from the application | - |
| [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | A recorded snapshot day equals what the live report showed that day | needs the stored nightly capture rows, which are not reachable from the application | - |
| [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Nightly snapshot: re-running the capture for a date replaces that date's rows | the nightly capture job cannot be re-run or inspected from the application | - |
| [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | Snapshot retention: daily captures are kept for 0–13 months | retention pruning is a server-side job over stored history, not reachable from the application | - |

### The set-up this test needs cannot be produced on this environment - 17 tests

| Test | What the test covers | What it is waiting on | Already has a result? |
|---|---|---|---|
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | Building a custom range on the calendar cannot exceed a 366-day span | the calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen | - |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | A service (S) invoice with no vehicle also lands in the Parts Sales bucket | this organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side | - |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | Reversed and voided invoices are excluded from every row; count and total | this organisation has no reversed or voided invoice inside the report date range | - |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Duplicate asset labels get stable (#1)/(#2) suffixes that survive reloads | no customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear | - |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | An invoice deleted after load shows the not-found state and back returns | deleting a real invoice while the report is open is not something to do on a shared environment | - |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | A failed data fetch shows the error toast which fades after 5 seconds | a failing data fetch cannot be forced from the application | - |
| [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | A Custom range uses the date-picker and holds a 366-day maximum span | needs the calendar driven past a 366-day span, which this harness could not do | - |
| [C30372](https://shopview.testrail.io/index.php?/cases/view/30372) | Core parts are excluded from both the inventory and special-order result sets | no part in this organisation carries the core flag, so core exclusion cannot be exercised | - |
| [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | Internal hours with no default labor rate anywhere show an em-dash | no location on this environment is set up without a default labor rate, so the em-dash state cannot be produced | - |
| [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | Internal hours split across rated and unrated locations show a part value | no location on this environment is set up without a default labor rate, so a part-valued row cannot be produced | - |
| [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0 | no technician on this environment has an em-dash in Est. Lost Labor, because both locations have a default labor rate | - |
| [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | Reconcile exception (a): an open clock is snapshotted at each load instant | needs a technician clocked in at the moment of the test, and no technician on this environment is currently clocked in | - |
| [C30547](https://shopview.testrail.io/index.php?/cases/view/30547) | With no fixed sell price and no category, Unit Sell equals Unit Cost | a part cannot be saved without a category on this build, so the no-category path cannot be produced | - |
| [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Thinned history still served by the closest-recorded-day rule | needs a thinned history that this organisation does not have and cannot be produced from the application | - |
| [C38892](https://shopview.testrail.io/index.php?/cases/view/38892) | A recorded day keeps its category and vendor names after a rename or delete | needs a recorded earlier day plus the stored capture rows, which are not reachable from the application | - |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | An over-cap Work In Progress download is refused with the too-large message | the over-size refusal cannot be produced on this environment; no tab comes near the size limit | - |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | A logo that is set but will not load falls back to the ShopView logo | this organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced | - |

### NOT marked to skip, but our own notes say they cannot be run - 3 tests

| Test | What the test covers | Why it cannot be run |
|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select: both toggles on by default | The steps send you to a "Product Type" filter with two toggles, "Parts" and "Services", and rows reading "All products" and "Clear all". The build still has the older single-choice filter with "Parts & Service", "Parts only" and "Service only". There is nothing to toggle. The change was accepted on 10 August (SV-9074) and has not been built yet. |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | Clear all leaves neither Product Type toggle on | Same reason as the row above — it asks you to read two action rows at the top of the Product Type list, and there are no action rows. |
| [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | Location column: shown to any multi-location user; toggleable | It asserts a Location column you can switch on and off, which five of the six reports do not offer — see tab 2. Its two sister tests (C38912 and C43551) are already marked as "cannot be run yet"; this one was left marked runnable by mistake. |

---

*Every count and every list here was read from TestRail at 2026-08-12T12:33:19Z. The Report Suite branch was on `v3.7-4626299` when this was written (last rebuilt Wed, 12 Aug 2026 05:06:49 GMT). No Jira call was made while writing this sheet, and nothing in TestRail was changed.*
