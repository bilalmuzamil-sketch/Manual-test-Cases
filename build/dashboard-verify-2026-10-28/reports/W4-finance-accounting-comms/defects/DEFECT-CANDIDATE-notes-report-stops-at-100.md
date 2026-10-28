# DEFECT CANDIDATE — Notes Report shows at most 100 notes, with no way to see the rest (e.g. "Last Week": 100 of 255)
Project: Reports — Communications · Prepared: 2026-10-28 · Prepared by: W4 finance / accounting / communications lane
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — fails A2: no written source for the Notes Report exists (searches below). PO question RQ-4. Ticket drafted in `TICKET-NOTES1-notes-report-stops-at-100.wiki`.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. Screen 20:21 UTC (Heavy Duty): *Date Range: All* → after scrolling to the end, **100** note cards; the server answer behind it says "more exist" (hasMore true); the organisation has **2,545** notes. *Last Month* → 33 (all, correct). API 20:27 UTC at all four locations: All 100/2,545 (Newest First) and 82/2,545 (Oldest First), Last Week 100/255, This Month 100/326, Filter by Author 100/1,105, Filter by Mention 100/110. Every listed note IS inside the chosen range and matches the filter (N1, N4, N6 pass); only the cut-off fails. |
| A2 | Expectation quoted VERBATIM | ❌ | No PRD or story found. Searches: Confluence `title ~ "notes report" OR text ~ "\"Notes Report\"" …` (56 hits, none a Notes-report spec); Jira `summary ~ "notes" AND summary ~ "report"` / `"Reports → Communication"` → SV-5333, SV-7933 (staff filter list, Open), SV-8261 (High Priority sort, Done), SV-11081 — no story defining the report's list. |
| A3 | NOT unfinished | ✅ | Live in the Reports menu (Communications). |
| A4 | NOT already reported | ✅ | Same searches — nothing about a 100-note limit. |
| A5 | NOT by design | ⚠️ | The screen asks the server once with no page number; the server's default page is 100. No decision found either way. |
| A6 | NOT environment | ✅ | All four locations; Admin. |
| A7 | Parent | — | None found (no owning story) — QA lead to choose. |
| A8 | Evidence | ✅ | `results-notes-reminders.json` (N2/N5/N7), screen counts in RESULTS.md. Reminders Report not affected today (20 reminders in total). |
| A9 | Adversarial | ⚠️ | "By design / performance" not defeated without a source. |
| A10 | Rule 62 | ✅ | Not filed. |

## IF NOT ADMISSIBLE
PO decision RQ-4: should the Notes Report list every note in the chosen range (e.g. with "load more" or paging)? Recorded in `PO-QUESTIONS.md`.
