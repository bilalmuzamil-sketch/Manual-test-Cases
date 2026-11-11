# Defect candidate — A/R and A/P aging PDFs print dates as "Apr 6, 2026" instead of "Nov 04 2026"

QA lead's permission for THIS ticket: 11 Nov 2026, "go for 1, 2 and 5" (item 2 = this ticket). Rule 62/A10 satisfied per ask.
Our case: V1R-80 [C1095436](https://shopview.testrail.io/index.php?/cases/view/1095436) (kept here, never in the ticket — Rule 94 A8).

| Check | Result |
|---|---|
| **A1 reproduced twice, same build** | Run 1 12:55Z, run 2 12:56Z, 11 Nov 2026, QA branch sv11315, marker `v26.45.2-6a8b89c` at start and end (unchanged). Both A/R Aging Detail PDFs: 591 dated document lines, **all 591** in the form "Apr 6, 2026" (`evidence/repro-log.json`). Also seen earlier by the live run (11:5xZ, V1R-80). |
| **A2 source quoted, current version** | PRD Confluence 947650561 **v11** (5 Nov 2026, Chris Ward, "QA answers"), re-read 11 Nov 2026 ~13:00Z — still current. S3-R7a: *"The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today."* |
| **A3 not unfinished** | Owning story SV-11533 (Story 3 – Export to PDF and CSV) is in TESTING QA; the PDF export is built. The SAME requirement's other half (negatives in brackets "(-$1,880.00)") IS implemented in the same PDF, so S3-R7a was worked on; only the date part differs. |
| **A4 not already reported** | JQL (incl. closed): `project = SV AND (text ~ "\"Nov 04 2026\"" OR text ~ "S3-R7a" OR (text ~ "aging" AND text ~ "PDF" AND text ~ "date format") OR (parent in (SV-11533, SV-11315) AND text ~ "PDF"))` → nearest is SV-12539 (PDF export fails at ~1,100 rows, different symptom). All epic children listed: none about PDF dates. |
| **A5 not by design** | The PRD names the reference format: "the same as Sales By Customer". On the SAME build, the Sales By Customer PDF prints "Nov 10 2026" (`evidence/2 - …png`, `Sales By Customer - same build.pdf`); production's Sales By Customer PDF (10 Nov) prints "Nov 02 2026". No PO answer changes it (Chris's 26 Oct answers predate S3-R7a, added 5 Nov). |
| **A6 not environment/data/role** | Format is independent of data (all 591 rows, invoices and credit memos alike). Admin session, QA branch proved by marker. Any customer, any date. |
| **A7 parent** | `Story Defect`, parent SV-11533 (established from `parent = SV-11315` children: "Story 3 - Export to PDF and CSV"; precedent SV-12539 is a Story Defect under SV-11533). Priority Medium. Link "relates to" SV-11533. |
| **A8 evidence** | 3 images + both PDFs + the script, in `evidence/`. |
| **A9 argued down** | *Unbuilt*: no — export built, brackets half of the same sentence done. *Spec changed*: no — v11 current, S3-R7a is the newest line. *Works as designed*: no — the PRD's own reference (Sales By Customer) prints "Nov 10 2026" on this build. *Cannot reproduce*: 2/2 + live run. *Duplicate*: searched, none. *Environment*: format, not data. *Cosmetic?* — it is an explicit PRD requirement with an example; shops compare these PDFs with QuickBooks, so it is filable at Medium. |
| **A10 permission** | Given 11 Nov 2026 for this one ticket. |

**VERDICT: ADMISSIBLE.**
