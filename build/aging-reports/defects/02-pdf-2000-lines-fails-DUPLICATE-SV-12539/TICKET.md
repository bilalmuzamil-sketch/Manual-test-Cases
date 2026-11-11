# NO NEW TICKET — C715469 is a DUPLICATE of the existing SV-12539 (skill 06 check A4)

**Existing ticket:** SV-12539 https://shopview.atlassian.net/browse/SV-12539 — *"Reports - A/P aging: PDF export fails with "We couldn't export this report" at about 1,100 rows, below the 2,000-row limit"*
Story Defect · **Open** · parent **SV-11533** (Story 3 - Export to PDF and CSV, **TESTING QA**) · Medium · label QA_Found · reported by **Mudassir Qamar**, created 11 Nov 2026 10:25 UTC · 0 comments. Read live 2026-11-11T10:55:56Z.

## Why it is the same fault (one root, not a new one)
| | SV-12539 (existing) | C715469 (ours) |
|---|---|---|
| Report | A/P Unpaid Invoices and A/P Aging Detail | A/P Aging Detail |
| Size | 1,133 rows (one vendor) | exactly 2,000 rows (three vendors); also 1,783 rows (all vendors, as of 04/01/2025) on 10-11 Nov |
| What happens | after ~30-52 s "We couldn't export this report. Please try again.", no file | after ~31-32 s the export fails, "We couldn't export this report. Please try again.", no file |
| Works | small vendor (8 rows) | 444 rows (as of 02/01/2025) downloads in 16-27 s |
| PRD rule broken | S3 (2,000-row limit) | S3-N1 "Exactly 2,000 rows is allowed." |

Every size we measured between 1,133 and 2,000 fails the same way; the 2,000-row boundary test is just one more size below the limit. Filing a second ticket would ask a developer to fix one thing twice. Skill 06 A4: "IT IS NOT ALREADY REPORTED" -> not admissible as a new ticket.

## What is proposed instead (each needs the coordinator / QA lead; nothing done)
1. **Link C715469 in run 557 to SV-12539** (Rule 113 - a Failed result with its ticket): `RESULTS-link-SV-12539.json` (dry run passed, `dry-run-1111.txt`). Command:
   `python3 build/testing-tools/push_results_to_run.py --run 557 --results build/aging-reports/defects/02-pdf-2000-lines-fails-DUPLICATE-SV-12539/RESULTS-link-SV-12539.json --build-marker v26.45.2-6a8b89c --date "11 November 2026" --env "QA site sv11315" --allow-non-passed --screenshots yes`
   It adds "Follow the status here https://shopview.atlassian.net/browse/SV-12539" and the title prefix "SV-12539 - " on C715469 (ours, created_by 3).
2. **Optional: one comment on SV-12539** adding the 2,000-row boundary evidence (a Jira write - needs the QA lead's own yes per Rule 62). Draft text in `SV-12539-COMMENT-DRAFT.md`.

## What does NOT fail (keep straight in any comment)
* 2,001 rows is correctly refused at once with exactly one message, "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." (S3-N1, S3-N3) - passed (C715467 too, at 13,708 rows).
* The CSV of the same 2,000-row report downloads with "Data exported successfully." and holds 2,000 document rows.
* The error message itself is the PRD's own failure message ("We couldn't export this report. Please try again."), so the message is right; the failure is not.
