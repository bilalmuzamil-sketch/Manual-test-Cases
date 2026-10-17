Every test in the Work Orders board run has been tested on staging today, and the results are all posted. 246 tests pass, 13 fail and 19 are blocked; none is left untested.

| 1 · DONE | What it means for you |
|---|---|
| Full staging pass, then five repair rounds and a real sign-out round | Every test has a current result with annotated pictures |
| About 25 earlier problems now pass | Their fixes look shipped: columns, text sizes, pills, avatars, grips, keyboard order, Back button, deleted technician, shift question |
| 2 problems confirmed and written up, nothing raised | They wait for your yes, one at a time (below) |

| 2 · LEFT | How to finish it |
|---|---|
| Nothing left to run on staging | — |
| Your decisions on the 2 problems and the questions below | Answer in chat; I act on each answer the same day |

| 3 · BLOCKED | Why, and what it does not block |
|---|---|
| 5 tests wait for the Technician filter | It is not on this build yet; nothing else waits on it |
| 1 test needs a way to make a work order with a lead already set | Not on this build yet |
| 1 test needs "Ralph Edwards", who is missing from the technician list | The list stops at about 100 names (3 more tests fail on the same thing) |
| 1 test needs a brand-new user to sign in for real | A new user has no password until they accept the invitation e-mail; every other step passes |
| 3 analytics tests | The requirements now send 17 fields; the tests still say 15 |
| 8 tests wait for a ruling from you | Questions 2 to 7 and 9 below; every other step in them passes |

| 4 · HOW TO UNBLOCK | Who |
|---|---|
| Answer the questions below | You |
| Ship the Technician filter | Development |
| Reopen or fix the technician-list cut-off | You decide (question 1) |

| 5 · HANDOFF-READY | |
|---|---|
| Ready for another session to pick up | NO (your answers are needed first) |

OUTSTANDING — what I need from you, in order:

A. Problem 1, already asked: keyboard users get no explanation on the greyed-out "Reassign lead technician" option. Yes = I raise it now; No = the test stays failed with your decision noted.

B. Problem 2, asked after A: the List page forgets a hidden column after you sign out and back in. Production remembers it, so staging has gone backwards. I proved it is not another session interfering: staging never saves the choice. Yes = I raise it; No = it stays failed with your decision noted.

C. Questions (each blocks only its own test):
1. Three problems whose tickets are marked obsolete still happen today: the technician list stops at about 100 names (4 tests), a technician's work orders are not in the List's A to Z order (1 test), and the "Lead technician updated" message is still a solid green box with the word "Close" (1 test). Reopen them? Yes = I comment on each with today's proof; No = those tests stay failed against the obsolete tickets.
2. The Back-from-a-work-order and refresh tests start from a Status filter on the Work Orders tab, and that tab has none. Should it have one? Yes = possible missing feature, I check the requirements; No = the tests' starting point needs rewording by you.
3. Closing the payment window cancels a fresh invoice. Is that intended? Yes = the invoice-lock test needs rewording; No = it is a possible invoicing bug for you to route.
4. Moving a technician to another location leaves them pickable at the old one. Intended? Yes = test wording; No = possible bug, I check the requirements and ask to raise it.
5. Dragging a technician onto Unassigned puts them first, which changes the order a later step expects. Accept the new order?
6. After deleting a technician, List shows "Unassigned" where the test expects a blank. Does "Unassigned" count as blank?
7. After Escape on a card's menu, its "More actions" button stays visible while keyboard focus is on the card. Fine?
8. Total price is left-aligned and the count tooltip opens below the number; only the design asks otherwise. Raise as design tickets, or ask the product owner?
9. "Clear all filters" keeps the search text. Should it empty it? (product owner question)

If you say nothing: nothing is raised, every test keeps its current result, and nothing else is waiting.


Update 11:45 UTC: the 2 sorting tests now pass. The customer that always came first is another tester's deliberate test record whose name starts with two spaces, so it correctly sorts first; it was not renamed.
