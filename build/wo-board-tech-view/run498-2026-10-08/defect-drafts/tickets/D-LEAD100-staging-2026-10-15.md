# Work order page: technician lists stop after 100 people (draft, not filed)

**What a user sees on staging:** on a work order page, the Lead Technician list shows only the first 100 people
(A to the Q names), then the current lead. The location has 184 people who can lead work, so the later ones,
such as Ralph Edwards, cannot be picked as lead there. The same people can be picked in the board's
"Reassign lead technician" window.

**The second list:** the Edit Line window's "Add Technician" list stops the same way. It ends at QA PartsTechnician
(97 names), and Ralph Edwards is not in it, so he cannot be added to a line.

**Typing does not help:** neither field has a search box. Typing a name, even one already in the list, shows
no text and does not change the list. Production behaves the same way here, so this part is not new and is
not part of the problem we report.

**Production:** production has only 18 active staff, so both lists there hold everyone (10 and 9 people).
Production therefore cannot show whether it would also stop at 100. We do not guess; we say so.

**What is next before we ask you:** the next test round records how many people each list asks the system for,
on staging and on production. If production asks for the same 100, the limit is older than this work and we
report it instead of raising it. If not, we ask you whether to raise it.

**What we will ask you then:** one report covering both lists, or two separate reports. The draft is written in
two parts so either answer works without rewriting.

**Why it matters:** four tests need a later-alphabet technician picked on the work order page or in Edit Line.
They cannot be finished on staging until this question is answered.

---REFERENCE---
Draft: `D-LEAD100-staging-2026-10-15.wiki` (PART A lead list, PART B Edit Line).
Pictures: `../D-LEAD100-1-page-list-vs-dialog.png`, `../D-LEAD100-2-lead-list-staging-vs-production.png`,
`../D-LEAD100-3-editline-staging-vs-production.png`. Staging pictures are 1x, re-taken at 2x in the tenth pass.
Part A: C97007 https://shopview.testrail.io/index.php?/cases/view/97007 · C368159 https://shopview.testrail.io/index.php?/cases/view/368159 ·
C368169 https://shopview.testrail.io/index.php?/cases/view/368169. Part B: C368173 https://shopview.testrail.io/index.php?/cases/view/368173.
All in run 498 https://shopview.testrail.io/index.php?/runs/view/498.
Parent story SV-10047 https://shopview.atlassian.net/browse/SV-10047 (re-read live by the coordinator 15 Oct 2026).
Production build v26.40.18-163ddfa, work order S2-968; staging work order S2-36154.
