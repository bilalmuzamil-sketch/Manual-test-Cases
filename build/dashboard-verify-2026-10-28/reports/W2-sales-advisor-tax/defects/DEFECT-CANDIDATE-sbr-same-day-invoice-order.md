# DEFECT CANDIDATE — Sales By Representative lists same-day invoices newest first instead of by invoice number
Project: Report Suite (epic SV-8582) · Report: Sales By Representative · Prepared: 2026-10-28 · Prepared by: W2 (reports phase, independent pass)
TestRail case: none — independent pass, no TestRail writes (QA lead, 2026-10-28: "TestRail ... NO")

## VERDICT: ALREADY REPORTED — SV-8974 ("Sales By Representative: invoices on the same day are not ordered by invoice number"), closed **OBSOLETE** on 9 Aug 2026 in the 57-ticket bulk sweep (22:40–22:42, see `build/report-suite/verify-final-2026-08-12/DIVERGENCES.md` §1). **It still reproduces on today's build.** No new ticket: the QA lead decides whether SV-8974 is reopened (the reopen comment is below, ready to paste).

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb` (staging). (1) Screen, 2026-10-28 20:28 UTC, DVI Test, Date: This month, Show Unassigned on, Unassigned opened: Oct 28 rows read S1-38204, S1-38203, S1-38200, S1-38199, S1-38198, S1-38196, S1-38195; Oct 13 rows read S1-35010 then S1-35003 (`pictures/SBR-1-same-day-order.png`). (2) Same screen again 2026-10-28 21:07 UTC: Oct 28 rows S1-38206, S1-38204, S1-38203, S1-38200, S1-38199, S1-38198, S1-38196, S1-38195; Oct 13 S1-35010 above S1-35003. (3) Server rows for QB Location, Last 12 months, Unassigned: Sep 1 2026 rows S2-31544, P2-1855, S2-31516, P2-1851, P2-1847, S2-31462 … (newest time first). Counts per location in `../RESULTS.md` (check "Invoice rows newest first, same-day ties by invoice number (S6-R9)"). |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ | SBR spec, Confluence 585629698, **v30 (2026-10-21, Chris Ward)**, read 2026-10-28, S6-R9: *"Within an expanded rep (and within the Unassigned row), invoice detail rows are ordered by invoice date descending (newest first), tie-broken by invoice number ascending by the numeric portion after the P/S prefix (numeric, not lexical — so S999 precedes S1000); if both the date and the numeric portion tie (e.g., P100 and S100 on the same day), P (Parts) sorts before S (Service)."* |
| A3 | NOT an unfinished feature | ✅ | Owning story SV-8624 (SBR Story 6) Done; epic SV-8582 Done |
| A4 | NOT already reported (incl. CLOSED) | ❌ | **SV-8974** is exactly this, closed OBSOLETE without a fix. JQL run live 2026-10-28 (`sources/jql-duplicates-2026-10-28.txt`). |
| A5 | NOT by design | ✅ | No later decision found: spec v30 change log has no ordering change; SV-8974 carries no comment explaining the closure |
| A6 | NOT environment / data / role | ✅ | Same order in all four locations' data; Admin |
| A7 | Correct parent, proved | ✅ | S6-R9 is Story 6 → SV-8624 |
| A8 | Evidence complete | ✅ | annotated picture; server rows; build marker |
| A9 | Adversarial self-review survived | ✅ | see below |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Nothing filed or reopened |

## A9 — THE SIX REFUSALS
1. "Unbuilt." → Story 6 Done; the order is simply by full time stamp.
2. "Spec changed." → v30 (21 Oct) still carries S6-R9 word for word.
3. "Works as designed." → S6-R9 is explicit; newest-time-first is not what it says.
4. "Cannot reproduce." → Seen on screen and in every location's data today.
5. "Duplicate." → Yes: SV-8974. That is why this is not a new ticket.
6. "Environment." → All locations, plain Admin.

## REOPEN COMMENT FOR SV-8974 (only if the QA lead says so)
Still happens on staging build v26.43.2-f8698cb (28 Oct 2026). Reports > Sales By Representative, location DVI Test, Date: This month, click Show Unassigned, open the Unassigned row: the seven invoices dated Oct 28 2026 are listed S1-38204, S1-38203, S1-38200, S1-38199, S1-38198, S1-38196, S1-38195 (highest number first), and on Oct 13 2026 S1-35010 is listed above S1-35003. The SBR spec v30, S6-R9, says same-day invoices are listed by invoice number, lowest first (P before S on a tie). Picture attached: SBR-1-same-day-order.png.
