---
title: A/R and A/P aging - behaviours that look like bugs but are proven correct (do not re-investigate)
keywords: aging, collection, overdue, credit, amount, original, partly used, csv, apostrophe, injection, total, zero, blank, sort, punctuation, document number, natural, pdf, 1000, limit, leading space
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md; build/ar-ap-report-sorting/release-audit-2026-11-18/exports/EXPORT-CHECKS.md; build/ar-ap-report-sorting/release-audit-2026-11-18/SORT-AND-FUTURE-DATE.md; build/ar-ap-report-sorting/v1-regression/partly-used-credit-2026-11-18/README.md
---
- A/R Collection leaves out invoices with Past Due <= 0 (due today included) and keeps credits/deposits: PRD S8-R1 "Overdue invoices..." and the old report did the same (fc08f23 CollectionsItem.php:31).
- Partly-used credit: Amount = original, Open Balance = what is left (PRD S5-R18a; QA lead's own 12 Nov comment on SV-11315, Milos "will do" the PRD line). Production (old) shows what is left in both.
- CSV writes a cell that starts with + - = @ with a leading apostrophe ("'+8989+"): deliberate injectionSafeMask, not an order or data bug.
- Summary Total of $0.00 prints "0.00" (a value, sorts among values); an empty bucket cell is blank and sorts last both ways. A vendor can show all-blank buckets with Total $0.00 when a bill and an unused credit cancel in the same bucket.
- Document-number order (S2-R4 + S1-R2): digit runs compare as numbers, everything else by character code: "-", " ", "." sort before digits; a name starting with spaces sorts first.
- PDF: exactly 1,000 rows allowed (~22 s), 1,001 refused with the one S3-N1 message; Detail PDF prints only buckets that hold a document.
- Stillwater 055-541861 / 069-855902 2-cent gap = SV-12538 (old saved Amount), same on production.
