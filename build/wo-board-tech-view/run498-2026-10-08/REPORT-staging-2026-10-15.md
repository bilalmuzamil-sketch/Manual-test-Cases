# Work Orders Board and Tech View — full run on staging (DRAFT, kept current until the passes finish)

Last updated 15 Oct 2026, 06:05 UTC. Everything below was done on staging only, as you asked. Production was used only to
compare, and only where production has the same screen.

## 1 · Done

| What | Where it stands |
|---|---|
| Ran the whole test run on staging, unattended, overnight | Most tests now have a staging result with marked-up pictures on them |
| Your 22 new design tests ("Design — how it looks") | 2 pass. 13 show the screen does not match the design (tickets held for you). 6 are being measured again. 1 has no expected result yet |
| Three report filter tests that failed the same way on production | Those three tests have since been DELETED from TestRail (not by me) and left the run, so they no longer count. They had no ticket, because production does the same |
| One sorting test fails on staging only | It worked on the test branch on 9 Oct; on staging the cards are not in the List's order. Ticket held for you |
| Four tests that used to fail now pass | The fixes for the "clear the technician's shifts?" question have reached staging |

## 2 · Left (running now, no action needed from you)

| What | How it finishes |
|---|---|
| Re-runs of tests whose first reading was not usable | Queued in the fifth and sixth passes on staging; they start by themselves. Each reading is judged, and passes are posted with pictures |
| Your 4 new technician-filter tests | Run: all 4 fail — there is no Technician filter yet (ticket held) |
| The two "no staff from another company" tests | A second company is made on staging and both screens are checked against it |
| Three analytics tests | Two pass. The third needs a second day: it runs by itself just after midnight Pakistan time (16 Oct) |
| Six design tests whose first reading looked at the wrong part of the page | Fixed and queued in the sixth pass |
| The sign-out test | Runs last of all, because signing out ends the staging sign-in every other test uses |

## 3 · Blocked

| What | Why | What it does NOT block |
|---|---|---|
| Chris's bug: a technician's card shows a different name from their staff record | On staging a technician has only ONE name: renaming the staff record renames the account too, and the other way round. So the two names cannot differ there, and the bug cannot be shown. Production does not have these screens yet, and you asked that nothing runs on a test branch | Every other test |
| Two tests that check another company's staff and work orders are never shown | Staging has only one company and will not let a second one be made (its sign-up page is not there). So there is no other company to check against | Every other test |
| Deleting a technician who has worked on a line | Staging refuses: "Staff is being used elsewhere". So the "Deleted user" state that one test needs cannot be made by deleting | Every other test |

## 4 · How to unblock — what I need from you

1. **A sorting problem on staging that was fixed on the test branch.**
   - **What a user sees:** in Tech View and Board View a technician's work orders are not in the same order as the List, even when the List is sorted by customer. On the test branch on 9 Oct this was fixed, and its ticket was closed as no longer needed. On staging it is broken again.
   - **The question:** reopen the old ticket, or raise a new one?
   - **Options:** (a) reopen the old ticket — I add the staging pictures and steps to it; (b) raise a new ticket under the Tech View story — I file it in our usual layout; (c) leave it — the test stays failed in the run.
   - **If you say nothing:** the test stays failed with its ticket held. Nothing else waits on it.
2. **13 places where the screen does not match the design.** Some examples:
   - no Technician filter in Tech View or Board View — your 4 new technician-filter tests fail on this too, so it is one ticket covering all 5 tests;
   - a grey strip down each side of the table;
   - a new user sees the wrong columns;
   - the success message is a solid green box instead of the design's white box with a green tick;
   - technicians without a photo get a solid blue circle instead of a light grey one.
   - **The question:** may I raise these as tickets, one at a time? I will show you each one first.
   - **Options:** (a) yes, one by one — I show you the first now and wait for your yes on each; (b) some are expected differences — tell me which, and I record your ruling on the result; (c) not now — they stay failed in the run with tickets held.
   - **If you say nothing:** they stay failed with tickets held. Nothing else waits on them.
3. **The Lead Technician list on the work order page stops at 100 names** (its own ticket, as you asked).
   - **What a user sees:** on a work order, the Lead Technician list shows only the first 100 people (A to about Q). Typing a name does not find anyone else, so technicians later in the alphabet can never be made lead there. The board's Reassign window does offer them.
   - **Where it stands:** the ticket is drafted in the usual layout and held. It goes to you only if production does NOT have the same limit; if production does the same, this release did not cause it and I will tell you instead.
   - **The question:** may I file it?
   - **Options:** (a) yes — I file it under the lead technician story, add its number to the three tests it blocks, and post that into the run; (b) not now — the three tests stay held with the reason.
   - **If you say nothing:** nothing is filed; the three tests stay held.
4. **A second company on staging.**
   - **What it is:** two tests check that technicians and work orders from ANOTHER company never show up. Staging has only one company, and a new one cannot be signed up there.
   - **The question:** is there a second company on staging I can use, or a way to create one?
   - **Options:** (a) you name one or give me a sign-in for it — I run both tests straight away; (b) no — both stay Blocked with this reason.
   - **If you say nothing:** both stay Blocked. Nothing else waits on them.
5. **Chris's name bug cannot be shown on staging** (see Blocked).
   - **The question:** is there a way the two names can differ on staging?
   - **Options:** (a) you know a way — I run it straight away; (b) no — I mark the test Blocked with this reason and the bug stays with Chris; (c) allow one test branch just for this — I run it there.
   - **If you say nothing:** I mark it Blocked with the reason at the end of the run.
6. **Moving the last work order out of "Assigned to me".**
   - **What a user sees:** with "Assigned to me" on, giving your only work order to someone else empties the board, and it shows "No work orders match these filters" instead of your column with 0.
   - **Why it is a question:** the test says your column should stay with a count of 0. A newer version of the product requirements says an empty filtered board shows that message.
   - **Options:** (a) the newer requirements win — the test passes; (b) the test is right — it fails and I prepare a ticket for you to approve.
   - **If you say nothing:** it stays unjudged.
7. **A view-only user drops a technician before "Unassigned".**
   - **What a user sees:** the technician lands right after Unassigned, because Unassigned always stays first. The test expects the drop to do nothing.
   - **Options:** (a) landing next to Unassigned is fine — it passes; (b) the drop should do nothing — it fails and I prepare a ticket.
   - **If you say nothing:** it stays unjudged.
8. **Switching to Tech View while offline.**
   - **What a user sees:** offline, in a browser that has never opened Tech View, the page shows "Something went wrong loading this section" instead of switching. In a browser that has opened Tech View before, it may work.
   - **Options:** (a) test only a browser that has opened Tech View before — I run it that way; (b) a fresh browser must work offline too — it fails and I prepare a ticket.
   - **If you say nothing:** it stays unjudged.
9. **Coming back to the board after opening a work order.**
   - **What a user sees:** the sideways position comes back exactly, but up-and-down can shift by about one row.
   - **Options:** (a) one row is fine — it passes; (b) it must be exact — it fails and I prepare a ticket.
   - **If you say nothing:** it stays unjudged.
10. **"Sign out and sign back in" in two tests.**
   - **What I did instead:** opened a fresh browser window. A real sign-out ends the staging sign-in every other test uses, and I cannot sign back in unattended.
   - **Options:** (a) a fresh window is enough — both stay passed; (b) a real sign-out is needed — I run it last, once you can sign me in again afterwards.
   - **If you say nothing:** both stay passed, and the comment says how it was done.
11. **Dark theme test.** It has no expected result yet; it is waiting for the product owner. On staging, Dark turns both views dark.
   - **Options:** (a) you give the expected look — I judge it against that; (b) leave it until the product owner answers.
12. **How a line's technicians are named on a card.**
    - **What a user sees:** a line with two technicians shows the first person's FULL name and then "+1", on the card and in the List alike, for example "Cora Clock +1".
    - **Why it is a question:** the test, quoting the product requirements, says it should be their FIRST name and then "+1", for example "Cora +1". The card and the List agree with each other but not with that wording.
    - **Options:** (a) the card matching the List is what matters — it passes; (b) it must be the first name only — it fails and I prepare a ticket for you to approve; (c) ask the product owner which is meant — I add it to the product owner question sheet.
    - **If you say nothing:** it stays unjudged.
13. **For your information, no action needed:**
    - Four tests about the "clear the technician's shifts?" question now pass on staging, so those fixes have reached it.
    - After moving a technician's time from one line to another, the receiving line correctly shows her name, but a second entry "Deleted user" also appears under it, although nobody on that line was deleted. The test passed on what it asks; I am telling you in case you want it looked into.
    - On staging the shop setting "a line needs a tech story before it can be completed" was OFF, which is why a line completed without a story in last night's run. I turned it on for the test, the test passed, and I turned it off again.

## 5 · Handoff-ready

| Gate | State |
|---|---|
| Every test has a staging result | NO — passes 5 and 6 still running |
| Every pass and fail carries marked-up pictures | YES for everything posted so far |
| Tickets | None filed; all held for your yes, one at a time |
| **Ready to hand off** | **NO** |

---REFERENCE---
Run 498: https://shopview.testrail.io/index.php?/runs/view/498
1 · C96929 https://shopview.testrail.io/index.php?/cases/view/96929 — old ticket https://shopview.atlassian.net/browse/SV-11101 (Obsolete); story https://shopview.atlassian.net/browse/SV-10045 (Ready for QA, read 15 Oct)
2 · Design failures C590110 C590111 C590112 C590113 C590115 C590116 C590117 C590118 C590119 C590121 C590124 C590127 C590130; passes C590126 C590131; re-measuring C590114 C590120 C590122 C590123 C590128 C590129; Dark theme C590125
5 · C581895 https://shopview.testrail.io/index.php?/cases/view/581895 — story https://shopview.atlassian.net/browse/SV-10048
6 · C96973 · 7 · C97003 · 8 · C96920 · 9 · C96916 · 10 · C97005 step 8, C96989 · 11 · Dark theme C590125 · 12 · C96978 · 13 · C368134 C368136 C154888 C154889; tech-story setting C96998
Deleted from TestRail during the run (not by this session): C368232 C368236 C368237. Deleted user: C368191, C368177.
4 · Second company: C368175 C154650 · Technician filter: C581915 C581916 C581917 C581918 (with C590127)
3 · Lead list stops at 100 (own ticket, held): C97007 C368159 C368169 — story https://shopview.atlassian.net/browse/SV-10047
