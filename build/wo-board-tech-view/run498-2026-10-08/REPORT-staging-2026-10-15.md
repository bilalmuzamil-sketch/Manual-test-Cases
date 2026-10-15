# Work Orders Board and Tech View — full run on staging: final report

15 October 2026, 12:30 UTC. Everything below was tested on staging only, as you asked. Production was used only to compare
where production has the same screen. Every pass and fail in the run carries marked-up pictures.

**Where the run stands: 271 tests. 244 passed, 21 failed, 4 blocked, 2 not yet run.**
Of the 244 passed, 16 still show an older result from the test branch; those need one more staging run or your call (see Left).

## 1 · Done

| What | Result |
|---|---|
| The whole run on staging, unattended, overnight and this morning (ten passes) | Every other test passes on staging with pictures |
| Your 22 design tests ("Design — how it looks") | 4 pass. 16 do not match the design (tickets held for you). 1 needs one more run. 1 has no expected result yet |
| Your 4 new technician-filter tests | All 4 fail: Tech View and Board View have no Technician filter (one ticket, held) |
| Sorting in Tech View and Board View | Fails on staging (cards not in the List's order), though it worked on the test branch on 9 Oct (ticket held) |
| The "clear the technician's shifts?" question | The fixes have reached staging: those tests now pass |
| View-only user and the "Asset on Site" switch | Passes: the switch is greyed out and cannot be changed, exactly as on production |
| Three report filter tests | They were deleted from TestRail during the run (not by me), so they left the run |

## 2 · Left — what still has to run, and how

| What | How it finishes |
|---|---|
| 7 tests whose last reading could not be used: switching back to Heavy Duty, two Schedule shifts, the lead-change history, the "Session expired" drag, the part-sale counts, one design card | Each script is fixed. Staging is signed out now (the sign-out test ran last, as it must), so they need a fresh staging sign-in from you — question 1 below. Then about 45 minutes |
| 4 tests that cannot change the lead to someone late in the alphabet | Waiting on the 100-name list problem — question 2 |
| The two-day analytics test | Day 2 runs by itself tonight at 19:10 UTC (just after midnight Pakistan time) and is posted then |
| 5 tests where the test's wording and staging disagree | Waiting on your call — questions 6 to 10 |

## 3 · Blocked

| What | Why | What it does NOT block |
|---|---|---|
| Chris's bug: a card showing a different name from the staff record | Staging keeps one name per technician; the two names can never differ there | Every other test |
| Another company's staff and work orders never showing (2 tests) | Staging has only one company and cannot make a second one | Every other test |
| How a line shows work done by someone who was deleted | Staging will not delete anyone who has logged work | Every other test |

## 4 · What I need from you

1. **A fresh staging sign-in, to finish 7 re-runs.**
   - **What it is:** the last test of the run signs staging out. Seven tests still need one more run with their fixed scripts.
   - **Options:** (a) send me a fresh staging sign-in — I run all seven at once and post them, about 45 minutes; (b) leave them — they keep their older test-branch results.
   - **If you say nothing:** the seven stay as they are; nothing else waits on them.
2. **The Lead Technician list on the work order page stops at about 100 people — may I file it?** (Its own ticket, as you asked.)
   - **What a user sees:** on staging 255 people can lead work, but the work order page's Lead Technician list shows only the first 100 or so (to the P/Q names), and the line's Add Technician list stops at the same point. Typing a name puts no text in the box and finds no one. So technicians later in the alphabet (Ralph Edwards, Ben Bravo) can never be chosen there, although the board's Reassign window offers them.
   - **Is it new?** I cannot tell. Production has only 18 staff, so it can never reach 100. Both sites ask for the list the same way, so the limit comes from the server, and the developer's notes for this release say these lists were changed. It may be new or it may be old.
   - **Options:** (a) file it as ONE ticket covering both lists, under the lead technician story (Ready for QA, read today); (b) file it as TWO tickets, one per list; (c) do not file — the four tests stay waiting with this reason.
   - **If you say nothing:** nothing is filed.
3. **The other held tickets — one at a time, after question 2.** All are drafted in the usual layout with pictures; their stories all read "Ready for QA":
   - no Technician filter in Tech View and Board View (covers 5 tests);
   - sorting on staging does not follow the List (fixed on the test branch earlier and its old ticket closed as no longer needed — reopen it or file new);
   - 16 places where the screen does not match the design (for example the grey strip down each side of the table, a black work order number instead of a blue link, no progress bar, technicians without a photo shown as a solid blue circle, the green message box).
   - I will ask you about each one in turn once question 2 is answered.
4. **A second company on staging.** Is there one I can use, or a way to make one? (a) yes — I run both tests at once; (b) no — they stay Blocked.
5. **Chris's name bug.** Is there any way the two names can differ on staging? (a) yes — I run it at once; (b) no — it stays Blocked and the bug stays with Chris.
6. **Moving your last work order out of "Assigned to me".** The board shows "No work orders match these filters" instead of your column with 0. The newer product requirements say an empty filtered board shows that message. (a) newer requirements win — pass; (b) the test is right — fail, ticket prepared.
7. **A view-only user drops a technician before "Unassigned".** It lands right after Unassigned, which always stays first; the test expects nothing to happen. (a) fine — pass; (b) the drop should do nothing — fail, ticket prepared.
8. **Switching to Tech View while offline.** A browser that has never opened Tech View shows "Something went wrong loading this section". (a) only test a browser that has opened it before; (b) a fresh browser must work offline too — fail, ticket prepared.
9. **Coming back to the board after opening a work order.** The sideways position comes back exactly; up-and-down can shift by about one row. (a) fine — pass; (b) must be exact — fail, ticket prepared.
10. **How a line's two technicians are named on a card.** It shows the first person's full name then "+1" ("Cora Clock +1"), the same as the List; the test says first name only ("Cora +1"). (a) matching the List is right — pass; (b) first name only — fail, ticket prepared; (c) ask the product owner.
11. **Dark theme test.** It has no expected result yet (waiting for the product owner). On staging, Dark turns both views dark. (a) give me the expected look; (b) leave it.
12. **For your information, nothing to decide:**
    - "Sign out and sign back in" in two tests was done with a fresh browser window, because a real sign-out ends the staging sign-in; both pass, and the comment says so.
    - After moving a technician's time to another line, a second entry "Deleted user" also appears under that line, though nobody there was deleted.
    - The shop setting "a line needs a tech story before it can be completed" is OFF on staging; I turned it on for its test and back off.
    - Production moved to a newer version (v26.40.18) during the morning.
    - The testing machine restarted five times this morning when the session sat idle; a watcher now keeps it awake, and nothing finished was lost.

## 5 · Handoff-ready

| Gate | State |
|---|---|
| Every test has a staging result | NO — 7 need a fresh staging sign-in, 4 wait on question 2, 5 wait on your calls, 1 runs tonight |
| Every pass and fail carries marked-up pictures | YES |
| Tickets | None filed; every one is held for your yes, one at a time |
| **Ready to hand off** | **NO** |

---REFERENCE---
Run 498: https://shopview.testrail.io/index.php?/runs/view/498
1 · Re-runs: C368156 C368178 C368179 C96962 C97012 C368217 C590120
2 · Lead list (draft defect-drafts/tickets/D-LEAD100-staging-2026-10-15.wiki): C97007 C368159 C368169 C368173 — story SV-10047 https://shopview.atlassian.net/browse/SV-10047 (Ready for QA, read 11:53 UTC)
3 · Technician filter: C581915 C581916 C581917 C581918 C590127 (story SV-10044 https://shopview.atlassian.net/browse/SV-10044) · Sorting: C96929 (old ticket SV-11101 https://shopview.atlassian.net/browse/SV-11101 Obsolete; story SV-10045 https://shopview.atlassian.net/browse/SV-10045) · Design: C590110 C590111 C590112 C590113 C590114 C590115 C590116 C590117 C590118 C590119 C590121 C590124 C590128 C590129 C590130
4 · C368175 C154650 · 5 · C581895 (story SV-10048 https://shopview.atlassian.net/browse/SV-10048) · Deleted person: C368191
6 · C96973 · 7 · C97003 · 8 · C96920 · 9 · C96916 · 10 · C96978 · 11 · C590125
12 · Sign-out by new window: C97005 C96989 · Deleted user entry: C368177 · Tech-story setting: C96998
Two-day analytics: C97033 (day 2 at 19:10 UTC) · Deleted from TestRail during the run: C368232 C368236 C368237
