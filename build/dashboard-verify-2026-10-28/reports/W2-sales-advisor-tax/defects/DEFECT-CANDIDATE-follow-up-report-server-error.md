# DEFECT CANDIDATE — the hidden Follow Up report fails with a server error and shows a blank page
Project: Reports (no epic — legacy report, not in the menu) · Report: Follow Up (/reports/sales-follow-up) · Prepared: 2026-10-28 · Prepared by: W2
TestRail case: none — no TestRail writes

## VERDICT: HELD — fails A2 (no written source for this report exists) and A5 (it is switched off in the menu, so it may be retired on purpose). PO question **SQ-5**. Ticket drafted in `TICKET-W2-5-follow-up-report-server-error.wiki`, to be filed only if the PO says the report is still supported.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. (1) Screen, 2026-10-28 ~20:05 and 20:35 UTC, Staging Heavy Duty - 9919 and DVI Test: /reports/sales-follow-up opens a blank content area — no title, no filter, no table, no message (`pictures/FOLLOWUP-1-blank-page.png`); the page's request `GET /api/reporting/sales-follow-up/last_3_months?dateRange=last_3_months` answered **HTTP 500** twice. (2) Direct reads, all four locations × last_3_months / last_6_months / last_12_months: 12 of 12 → HTTP 500 "An error occurred. We're sorry for this inconvenience…" |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ❌ | No written source. Searched: Confluence CQL `title ~ "Follow Up" / "Follow-up"`, `text ~ "Sales Follow Up"`; Jira `summary ~ "Follow Up" AND text ~ report`, `summary ~ "Sales Follow Up"` (live 2026-10-28) — only DVI and portal follow-ups, nothing about this report. The column list in the formula reference is code-derived, not an expectation. |
| A3 | NOT an unfinished feature | ✅ | The screen and endpoint exist and are routed; the menu entry is switched off |
| A4 | NOT already reported (incl. CLOSED) | ✅ | Same JQL — no ticket about the Follow Up report failing; Sentry search "SalesFollowUp" (24 h, staging) returned no grouped issue |
| A5 | NOT by design | ❓ | The menu hides it in every environment. If it was retired on purpose, a broken hidden page is not a defect |
| A6 | NOT environment / data / role | ✅ | All four locations, all three periods, Admin |
| A7 | Correct parent | ⚠️ | No owning story found; would be a standalone Bug |
| A8 | Evidence complete | ✅ | annotated picture; request/response codes |
| A9 | Adversarial self-review | ❌ | Refusals 3 and "no source" not defeated |
| A10 | Rule 62 | ✅ | Not filed |

## A9 — THE SIX REFUSALS
1. "Unbuilt." → It was built (routes, screen, query); it is hidden, not unbuilt.
2. "Spec changed / obsolete." → **Possibly** — it is hidden from the menu. Not defeated.
3. "Works as designed." → No design exists to compare with.
4. "Cannot reproduce." → 12/12 requests fail; the screen is blank every time.
5. "Duplicate." → None found.
6. "Environment." → All locations.

## Also noted (code reading, for the PO — not checked live because the report never loads)
The report's query counts work order × invoice rows (a work order with two invoices counts twice), sums `invoice.subtotal` with no void filter, and its "Contact" filter filters by the company's sales representative.
