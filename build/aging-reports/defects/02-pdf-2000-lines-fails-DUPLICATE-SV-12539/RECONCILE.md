# RECONCILE — PDF of exactly 2,000 lines fails (C715469) — CLAUDE.md §1 bullet (d), Rules 106 / 114 / 137

Read 11 Nov 2026 ~10:55 UTC. Case read live (`get_case/715469`); story and SV-12539 read live from Jira (read-only).

## 1. The SOURCE (verbatim)
PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 11** (5 Nov 2026):
* S3-N1: "Over 2,000 rows, the PDF is refused before anything is generated: no download, and the message "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." Exactly 2,000 rows is allowed."
* S3-R9: "The row count for the export limits is the number of customer or vendor rows (Summaries) or document rows (the other four), not counting headers, subtotals or the Totals row."
* S3-R10: "A successful export shows the native "Success" message, "Data exported successfully." …"
* §3 error handling: "If an export fails for any other reason (a server error or a lost connection), nothing downloads and one error message shows: "We couldn't export this report. Please try again." …"
Same honesty note as ticket 01: one live read on 10 Nov (`sources/prd-947650561-v11-read-1110.md` lines 217-228), not re-fetched today (Rule 81). Owning story SV-11533 (live, 11 Nov) carries S3-N1 word for word and the acceptance line "2,000 rows downloads (S3-N1, S3-N3, S3-R9)".

## 2. The CASE's Expected (live)
Step 4: "After a wait (a 2,000-row PDF can take about 30 seconds), the PDF downloads with the "Success" message: exactly 2,000 rows is allowed, and bucket rows, subtotals and the Totals row are not counted." Step 6: the "too large for PDF" message, exactly one, no download. Provenance quotes S3-R9, S3-N1, S3-N3, S3-R10, S5-R13 and the tech plan.

## 3. Case vs source (Rule 137)
* Forbids more than the sentence? No - "the PDF downloads" is what "Exactly 2,000 rows is allowed" means, with S3-R10's message.
* Allows more? No.
* Can it be true? Yes - the tech plan sizes the 2,000-row cap at "~30 s".
**Verdict: case and source AGREE.**

## 4. The BUILD observed (sv11315, v26.45.2-6a8b89c)
* 11 Nov (p48): 3 vendors = 2,000 lines (screen buckets 1,818 + 73 + 82 + 27 + 0; CSV 2,000 document rows). PDF: server error after 31.8 s, no file in 4 minutes.
* 11 Nov (p48): + vendor "#1 Diesel" = 2,001 lines -> "This report is too large for PDF…" at once (0.34 s), no file. Correct.
* 10-11 Nov (p43, p47): 1,783 lines (all vendors, as of 04/01/2025) -> error at ~31 s, "We couldn't export this report. Please try again.", twice. 444 lines (as of 02/01/2025) -> PDF downloads (16-27 s).

## 5. The case's own Blocked instruction - why it does NOT apply
C715469 says: if step 4 shows "We couldn't export this report…" while the CSV worked, "the test site may not have its PDF generator set up … mark this test Blocked". The 444-row PDF downloaded on the same site and build, so the PDF generator IS set up; the failure depends on size. Failed is the right verdict (the coordinator has recorded it so).

## 6. Outcome
**Case agrees with source + build differs ⇒ real defect — but ALREADY REPORTED as SV-12539 (Open, parent SV-11533, TESTING QA).** Skill 06 A4 ⇒ no new ticket; link the test to SV-12539.
Duplicate searches (`../duplicate-search-2026-11-11.json`): `summary ~ PDF AND summary ~ aging` -> SV-12539; `text ~ "couldn't export this report"` -> SV-12539 (+ unrelated); Story Defects under SV-11531/11533/11534 -> SV-12539 only.
