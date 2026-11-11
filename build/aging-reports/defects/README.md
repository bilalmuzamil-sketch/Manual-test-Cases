# Aging reports — defect drafts from run 557 (11 Nov 2026)

Prepared by a read-only worker. **Nothing has been filed in Jira and nothing has been written to TestRail by this pass.**
QA site https://sv11315.qa.shopview.com, build v26.45.2-6a8b89c. Run 557: https://shopview.testrail.io/index.php?/runs/view/557

## 1. A big customer or vendor opens all its documents at once — NEW TICKET, ready to ask
Folder: `01-open-group-loads-every-document-at-once/`
* **What users see:** on *A/R Aging Collection* and *A/P Unpaid Invoices*, opening a customer or vendor that has more than 100 documents shows every document at once. The PRD (4 Nov change) says it should show the first 100, then the next 100 as you scroll. The totals and counts are right.
* **Owning story:** SV-11531 https://shopview.atlassian.net/browse/SV-11531 (Story 1) — **TESTING QA**, read live 11 Nov 10:55 UTC, so a defect is allowed. Also related: SV-11534 (Story 4, TESTING QA).
* **One ticket for both tests** (C1062570 A/R, C1062571 A/P): same PRD sentence, same fault, one example per report.
* **Ready to ask the QA lead:** YES. Still to do at filing time: a one-minute re-check on the build (the last measurement was 03:50 UTC today).
* One thing worth telling him: the story's own text (unchanged since 23 Oct) does not yet carry the 4 Nov "100 at a time" sentence; only the PRD does.

## 2. A PDF of exactly 2,000 lines fails — NO NEW TICKET (already reported)
Folder: `02-pdf-2000-lines-fails-DUPLICATE-SV-12539/`
* **What users see:** on *A/P Aging Detail*, asking for a PDF of 2,000 lines (the most the PRD allows) waits about 30 seconds and then says "We couldn't export this report. Please try again." No file. 2,001 lines is correctly refused with the "too large" message; 444 lines downloads fine.
* **Already reported** today by Mudassir Qamar as SV-12539 https://shopview.atlassian.net/browse/SV-12539 — **Open**, a Story Defect under SV-11533 (Story 3, **TESTING QA**). It fails at 1,133 lines; ours fails at 1,783 and 2,000. Same fault.
* **Proposed instead:** link the failed test (C715469) to SV-12539 in run 557 (prepared and dry-run checked), and optionally add one comment to SV-12539 with the 2,000-line example (needs his yes; draft ready).

## Shared files
* `duplicate-search-2026-11-11.json` — every Jira search run for the duplicate check, with results.
* The older sketch `../tickets-held/01-open-group-loads-all-documents-at-once.md` is superseded by draft 1.
