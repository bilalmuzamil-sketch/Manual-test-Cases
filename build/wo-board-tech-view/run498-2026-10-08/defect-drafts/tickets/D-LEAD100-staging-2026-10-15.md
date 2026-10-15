# D-LEAD100 — Work Order Page: Lead Technician List Stops After 100 People (DRAFT, NOT FILED)

**What a user sees (staging, 15 Oct 2026):** on a work order page, the Lead Technician list shows only the first 100 people
(A to the Q names), then the current lead. Technicians later in the alphabet — Ralph Edwards, ZZAUTOTEST Ben Bravo — are
not in it, and the field does not search as you type (typing any name, even one already in the list, does not narrow it). The same people ARE offered in the board's Reassign lead
technician dialog. So a dispatcher cannot set those technicians as lead from the work order page.

**Why it matters for the tests:** three tests (a new lead goes to the bottom of the technician's work; a stale On Site click does not undo
a lead change; the work order page saves a new lead and mileage together) all need a lead set on the work order page to a late-alphabet
technician, so none of them can be finished on staging.

**Ticket shape:** Story Defect under the story for reassigning the lead technician (Ready for QA, read live 15 Oct 2026; re-read before
the ask) · Medium. Its own ticket (QA lead's ruling). Full draft: `D-LEAD100-staging-2026-10-15.wiki`; picture:
`../D-LEAD100-1-page-list-vs-dialog.png` (page list end beside the Reassign dialog offering Ralph Edwards).

**Edit Line (same page):** the Edit Line > Add Technician list stops the same way — 97 names, ending at QA PartsTechnician;
Ralph Edwards not in it; typing does not narrow it. Picture `../D-LEAD100-2-editline-list-and-production.png` (staging Edit Line list end
beside the production Lead Technician list). The QA lead decides: one ticket for both lists, or two.

**Production (Rule 121) — PRODUCTION CANNOT SHOW IT.** Read 15 Oct 2026 11:46 UTC, build v26.40.18-163ddfa: production has only 18
active staff in all (9 offered at that location), and both lists there are complete (10 and 9 entries), so they cannot reach 100. Production neither confirms nor rules out
the same limit; it is not guessed. Typing did not narrow the list there either. Nothing was changed on production.

**Status: NOT YET READY TO ASK.** The tenth pass records which request each list makes and its limit setting, on staging and production.
Same limit asked on production ⇒ the limit is older than this work: do not file, report it instead. Different ⇒ ask the QA lead to file
(and whether one ticket or two).

**Still open:** the live PRD read for the Sources waits for the QA lead's go-ahead (Rule 81/106); the staging pictures are 1x and are
re-taken at 2x in the tenth pass; read the staging build off the page at the re-measure.

**Duplicate search (15 Oct 2026):** 37 recent SV issues about lead technician lists — none about this 100-person limit.

---REFERENCE---
C97007 https://shopview.testrail.io/index.php?/cases/view/97007 · C368159 https://shopview.testrail.io/index.php?/cases/view/368159 ·
C368169 https://shopview.testrail.io/index.php?/cases/view/368169 · run 498 https://shopview.testrail.io/index.php?/runs/view/498 ·
SV-10047 https://shopview.atlassian.net/browse/SV-10047 (Ready for QA, read 15 Oct 2026)
