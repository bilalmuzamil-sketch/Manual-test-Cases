# Filters — is it ready for automation? (4 August 2026)

**What this is.** We ran every one of the **110 Filters test cases against the real, running
app** for the first time — the Filters QA branch at `sv8785.qa.shopview.com`. Before today not
one of them had ever been checked against a build. Every case now has a definite answer.

**The build we tested:** ShopView **v3.4.2-4f8211c**, checked at the start, the middle and the
end of the day — the same build all three times, so nothing changed under us.

## The one table

| Part of the feature | Test cases | Work correctly on the build | Broken on the build (a ticket is open) | Waiting on the product owner | Not built yet | Needs a measuring tool in the browser | **Ready to automate** |
|---|---|---|---|---|---|---|---|
| The filter bar and collapsing it | 8 | 6 | 2 | 0 | 0 | 0 | **8** |
| The Status filter | 7 | 4 | 3 | 0 | 0 | 0 | **7** |
| The Customer filter | 9 | 6 | 3 | 0 | 0 | 0 | **9** |
| The Lead Technician filter | 7 | 5 | 2 | 0 | 0 | 0 | **7** |
| The Service Advisor filter | 7 | 5 | 2 | 0 | 0 | 0 | **7** |
| The Asset on Site filter | 7 | 6 | 1 | 0 | 0 | 0 | **7** |
| Active buttons and Clear Filters | 6 | 5 | 1 | 0 | 0 | 0 | **6** |
| The "nothing found" screen | 3 | 1 | 2 | 0 | 0 | 0 | **3** |
| Switching tabs | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| Remembering your filters | 6 | 6 | 0 | 0 | 0 | 0 | **6** |
| Sharing a link with filters in it | 6 | 1 | 5 | 0 | 0 | 0 | **6** |
| Phone screens | 10 | 0 | 2 | 8 | 0 | 1 | **1** |
| The search box on the page | 13 | 6 | 7 | 0 | 0 | 3 | **10** |
| Behind the scenes (the data request) | 6 | 3 | 2 | 0 | 0 | 0 | **5** |
| Parts pages | 5 | 0 | 0 | 0 | 5 | 0 | **0** |
| Reports pages | 4 | 0 | 0 | 0 | 4 | 0 | **0** |
| **TOTAL** | **110** | **60** | **32** | **8** | **9** | **4** | **88** |

One more case is not in the "ready" column for a different reason: **FLT-API-06** needs a
**second sign-in of your own** to prove one person's saved filters do not leak to another. A
manual tester with two accounts can run it in a minute; we could not, because this branch will
not let us borrow another account and a new account cannot receive its invitation email here.

**A manual tester CAN run every single one of these 110 cases today**, with nothing but a
browser — including the 32 that are currently broken (they are supposed to fail, and each one
says so and gives the ticket number) and the 9 on pages that are not built yet (each one tells
the tester to mark it **blocked**, not failed). The only exceptions are the **4** cases that ask
for exact pixel widths, colours and font sizes: those need the browser's built-in inspector,
which is free and already on every machine, but it is not something we should ask a
non-technical tester to do. They are marked so nobody is caught out.

## What the automation engineer should SKIP, and why

1. **The 8 phone cases** — FLT-MOB-01, FLT-MOB-02, FLT-MOB-03, FLT-MOB-04, FLT-MOB-05, FLT-MOB-06, FLT-MOB-07, FLT-MOB-10. The product owner has told us two different
   things about phones on the same day, and the question is still open. Automating now could
   lock in the wrong behaviour. Each of these cases says, in the case itself:
   *"DO NOT AUTOMATE YET."*
2. **The 9 Parts and Reports cases** — FLT-PARTS-01, FLT-PARTS-09, FLT-PARTS-11, FLT-PARTS-12, FLT-PARTS-13, FLT-RPTS-01, FLT-RPTS-21, FLT-RPTS-22, FLT-RPTS-23. Those filter bars simply do
   not exist on the build yet, so there is nothing to automate against.
3. **The 4 pixel-measurement cases** — FLT-MOB-09, FLT-PSRCH-01, FLT-PSRCH-02, FLT-PSRCH-08. These check font names, hex
   colours and exact widths. Automate them LAST: the build currently uses different values from
   the written design, and those numbers are likely to move.
4. **FLT-API-06 step 3** — the second-account check. Automate steps 1, 2 and 4 now; step 3 needs
   a second test login to be provided.

**Everything else — 88 cases — is ready to automate today.** The 32 that currently fail should
still be automated: they are correct, they are what the app is supposed to do, and each one
already carries its ticket number, so a red result is information rather than noise.

**One thing that will make automation much easier, and it is good news:** the developers have
put stable test handles on every control in this feature — the filter buttons, every option in
every dropdown, the Clear Selection and Clear Filters buttons, the search box, the collapse
toggle, and the phone sheets. The full list is in
`build/filters/viu-2026-08-04/tools/findings.py`. An automation engineer will not have to guess
at selectors.

## What is blocked on Branko (the product owner)

1. **Do filters on a phone apply as you tap, or only when you press an Apply button?** On
   4 August he answered our question sheet saying they apply **as you tap, with no Apply
   button** — which is exactly what the app does. A few hours later, the same day, he added a
   new rule to the written specification saying the opposite: that a phone must wait for an
   **"Apply filters"** button. We are not choosing between two answers from the same person on
   the same day. This is already logged as
   [SV-8825](https://shopview.atlassian.net/browse/SV-8825). **It blocks 8 test cases.**
2. **Two small errors in the written specification, found while reading it.** One rule points at
   the wrong neighbouring rule after his renumbering, and one rule contradicts its own example —
   it says the filter button should show *"the first value and a count of the rest"*, but its own
   example shows a comma-separated list, which is what the app does. **No test cases are
   blocked**; we wrote them to the example and to the app. He just needs to tidy the sentences.
3. **His answer of 17 July is now out of date.** He told us then that on the Estimates and
   Completed tabs the Status button would be shown greyed out and pre-filled, and the design
   picture shows that too. His own specification says it is **hidden**, and the app hides it. We
   have followed the specification and the app, and corrected 6 of our cases. He should know
   that his July answer and that design picture no longer match what shipped.

## What is blocked on the developers

Five new tickets were raised today, all at **Low** priority, all hanging off the Filters epic
**SV-8785**, each linked to the story it belongs to:

| Ticket | What is wrong | Test cases affected |
|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | The filter buttons sit on the same row as the tabs instead of on their own row below them, so collapsing the bar frees no space | 2 |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Text typed in the page search is saved to your account forever, so you come back later to a list that looks empty | 3 |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | On a phone, a shared link with filters in it shows the buttons as switched on but lists completely different work orders | 2 |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | On a phone there is no Clear Filters button at all, so you cannot clear everything in one tap | 1 |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | When only a search is active, the empty screen says "no work orders match your filters" and offers Clear Filters, which does not help | 3 |

Three more were already open before we started, raised by the tester working through the run.
Our own testing agrees with two of them and could not reproduce the third:

| Ticket | What is wrong | Test cases affected |
|---|---|---|
| [SV-8824](https://shopview.atlassian.net/browse/SV-8824) | A filter dropdown closes the moment you tick one value, so picking two values means opening it twice | 12 |
| [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | A filter value that has been deleted is hidden from the list but still used to filter the results | 4 |
| [SV-8828](https://shopview.atlassian.net/browse/SV-8828) | Saved filters need a "Back To My Saved Filters" click after closing the browser | 0 — see the note below |

**One honest note on SV-8828.** We could not reproduce it. We opened a completely fresh browser
with nothing remembered locally, on the same build, and the saved filters came back on their own
with no button to press. We are **not** saying the tester is wrong — the most likely explanation
is that his previous visit had been through a shared link, and that button is the one the app
shows for shared links. Someone should ask him. His case keeps its Failed result and we changed
nothing about it.

## One thing we found that we did NOT raise, and why

There is a small inconsistency in how the data request handles nonsense values: a made-up filter
*name* is rejected cleanly, but a made-up **Yes/No value** is silently ignored and you get the
unfiltered list back. **No customer and no manual tester can reach this** — it needs a
hand-crafted request the app itself never sends. Under our rules an issue like that is never
raised without asking you first, so it is written up and waiting for your word.

## Can the automation engineer start on Filters?

**Yes — he can start today on 88 of the 110 cases, and the developers have already given him
stable test handles for every control he needs.**

## OUTSTANDING — what I need from you

1. **Branko's answer on the phone Apply button (SV-8825).** Until it comes, 8 phone cases cannot
   be automated and cannot be given a pass or a fail.
2. **Your word on the one API-only issue above** — raise a ticket for it, or leave it. Nothing is
   filed either way until you say so.
3. **A second test login** so the "one user's filters do not leak to another" case can be run.
4. **Tell us when engineering says this branch is final.** Everything above was measured on a
   branch they are still working on, so every finding is provisional and has to be re-checked
   when it settles. The re-check list is written and dated, one row per case.
5. **A decision on the 19 dropdown merges left over from the July audit.** They were waiting for
   a live build to confirm that the filter dropdowns share one component. They do: every
   dropdown on Work Orders, Parts and Reports uses the same two panel types. The merge can go
   ahead on your word.

Nothing else is outstanding.
