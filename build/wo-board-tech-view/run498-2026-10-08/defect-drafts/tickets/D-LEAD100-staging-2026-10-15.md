# D-LEAD100 — Work Order Page: Lead Technician List Stops After 100 People (DRAFT, NOT FILED)

**What a user sees (staging, 15 Oct 2026):** on a work order page, the Lead Technician list shows only the first 100 people
(A to the Q names), then the current lead. Technicians later in the alphabet — Ralph Edwards, ZZAUTOTEST Ben Bravo — are
not in it, and typing their name into the field finds nobody. The same people ARE offered in the board's Reassign lead
technician dialog. So a dispatcher cannot set those technicians as lead from the work order page.

**Why it matters for the tests:** three tests (a new lead goes to the bottom of the technician's work; a stale On Site click does not undo
a lead change; the work order page saves a new lead and mileage together) all need a lead set on the work order page to a late-alphabet
technician, so none of them can be finished on staging.

**Ticket shape:** Story Defect under the story for reassigning the lead technician (Ready for QA, read live 15 Oct 2026; re-read before
the ask) · Medium. Its own ticket (QA lead's ruling). Full draft: `D-LEAD100-staging-2026-10-15.wiki`; picture:
`../D-LEAD100-1-page-list-vs-dialog.png` (page list end beside the Reassign dialog offering Ralph Edwards).

**Before it goes to the QA lead:**
1. **Production (Rule 121):** lead100-compare.mts (seventh pass) reads the same list on production. Same limit on production ⇒
   not caused by this work, do not file. Production offers the late technician ⇒ staging fault, ask to file.
2. **Positive control (Rule 104):** lead100-compare also types a name that IS in the first 100; if that narrows the list and the late
   name does not, the "typing finds nobody" line holds; if neither narrows, the line becomes "the field does not search as you type".
3. **Live PRD read** for the Sources waits for the QA lead's go-ahead (Rule 81/106); the draft quotes the test cases meanwhile.
4. Swap in the lead100-compare pictures (slot in the draft) and read the staging build off the page.

**Duplicate search (15 Oct 2026):** 37 recent SV issues about lead technician lists — none about this 100-person limit.

---REFERENCE---
C97007 https://shopview.testrail.io/index.php?/cases/view/97007 · C368159 https://shopview.testrail.io/index.php?/cases/view/368159 ·
C368169 https://shopview.testrail.io/index.php?/cases/view/368169 · run 498 https://shopview.testrail.io/index.php?/runs/view/498 ·
SV-10047 https://shopview.atlassian.net/browse/SV-10047 (Ready for QA, read 15 Oct 2026)
