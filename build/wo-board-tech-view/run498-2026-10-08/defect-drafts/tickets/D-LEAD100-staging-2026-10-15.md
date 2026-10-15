# Work order page: technician lists stop after 100 people (draft, not filed)

**What a user sees on staging:** on a work order page, the Lead Technician list shows only about the first 100 people
(up to the P and Q names), then the current lead. The location has 184 to 255 people (more were added during the day) who can lead work, so the later ones,
such as Ralph Edwards, cannot be picked as lead there. The same people can be picked in the board's
"Reassign lead technician" window.

**The second list:** the Edit Line window's "Add Technician" list stops the same way. It ends in the P and Q names
(97 names), and Ralph Edwards is not in it, so he cannot be added to a line.

**Typing does not help:** neither field has a search box. Typing a name, even one already in the list, shows
no text and does not change the list. Production behaves the same way here, so this part is not new and is
not part of the problem we report.

**Production:** production has only 18 active staff, so both lists there hold everyone (10 and 9 people).
Production therefore cannot show whether it would also stop at 100. We do not guess; we say so.

**What we found out last:** the work order page asks the system for the technician list in exactly the same way on
staging and on production, and it does not ask for any size limit. So the cut-off at about 100 people is not something
the page asks for: the system's answer stops there. Production has too few people to show whether its answer would stop
at 100 as well, so we cannot say; we do not guess.

**What that means:** we cannot tell whether this is new. Production cannot show it, because it has too few people.
And we cannot call it old either: the developer's list of changes for this release says the technician lists on the
Lines tab were changed. So we do not guess either way, and the choice is yours.

**What we need from you:** do you want it raised? If yes, say whether as one report covering both lists or two
separate reports. The draft is written in two parts so either answer works without rewriting. If we hear nothing, nothing
is raised, and the four tests that need a later-alphabet technician stay waiting on this.

**Why it matters:** four tests need a later-alphabet technician picked on the work order page or in Edit Line.
They cannot be finished on staging until this is decided.

---REFERENCE---
Draft: `D-LEAD100-staging-2026-10-15.wiki` (PART A lead list, PART B Edit Line).
Pictures: `../D-LEAD100-1-page-list-vs-dialog.png`, `../D-LEAD100-2-lead-list-staging-vs-production.png`,
`../D-LEAD100-3-editline-staging-vs-production.png`. Staging pictures are 1x, re-taken at 2x in the tenth pass.
Part A: C97007 https://shopview.testrail.io/index.php?/cases/view/97007 · C368159 https://shopview.testrail.io/index.php?/cases/view/368159 ·
C368169 https://shopview.testrail.io/index.php?/cases/view/368169. Part B: C368173 https://shopview.testrail.io/index.php?/cases/view/368173.
All in run 498 https://shopview.testrail.io/index.php?/runs/view/498.
Parent story SV-10047 https://shopview.atlassian.net/browse/SV-10047 (re-read live by the coordinator 15 Oct 2026).
Production build v26.40.18-163ddfa, work order S2-968; staging work order S2-36154.
