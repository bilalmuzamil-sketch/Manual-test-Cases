# DEFECT CANDIDATE — Technician Utilization shows "Utilization %" with two decimals; the spec asks for one
Project: Report Suite (epic SV-8582) · Report: Technician Utilization · Prepared: 2026-10-28 · Prepared by: reports-phase worker W1
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — the spec sentence is verbatim and current, but two tickets conflict with it: SV-9059 "TU | Utilization % shows 1 decimal instead of 2" (Done, ready for staging 2026-08-13) changed the build to two decimals, and SV-9407 "TU | Utilization % - two decimal places instead of one with rounding half up" (reported 2026-08-20) was closed OBSOLETE with no comment. A closed ticket is not a spec change (Rule 57), but the two together show an unrecorded decision. PO question WQ-2. Ticket drafted in `TICKET-W1-D2-tu-utilization-two-decimals.wiki`.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | `v26.43.2-f8698cb`. Run 1 20:39 UTC, DVI Test, This month: Esther Howard **85.71%**, Summary **90.12%**. Run 2 20:40 UTC, Staging Heavy Duty - 9919: Admin Shopview **57.56%**, Summary **35.31%**, every row two decimals (pictures W1-TU-1, W1-TU-2). |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ | TU spec, Confluence 641400833, **version 9 (last modified 13 Aug 2026)**, read 2026-10-28, S2-R7: *"Utilization % shows one decimal place followed by a percent sign, rounded round-half-up (e.g., 66.65% → 66.7%)."* |
| A3 | NOT an unfinished feature | ✅ | SV-8649 "Tech Util - Story 2 - Columns and Calculations" Done; SV-8582 Done. |
| A4 | NOT already reported (incl. CLOSED) | ❌ | `project = SV AND (summary ~ "Utilization" OR summary ~ "TU") AND (text ~ "decimal" OR text ~ "Utilization %" OR text ~ "percent")` → **SV-9407** (same symptom, OBSOLETE) and **SV-9059** (the opposite request, Done). Also SV-11827, SV-11826, SV-11688, SV-11295, SV-9447, SV-9362 — unrelated. |
| A5 | NOT by design | ❌ | SV-9059 asked for two decimals and was built; that is a decision, just not written into the spec. |
| A6 | NOT environment / data / role | ✅ | Two locations, Admin. |
| A7 | Correct parent, proved | ✅ | S2-R7 → Story 2 → SV-8649. |
| A8 | Evidence complete | ✅ | Two annotated pictures; screen rows saved in `/tmp`-backed meta (values quoted above). |
| A9 | Adversarial self-review survived | ❌ | Refusals 2 ("spec obsolete") and 5 ("duplicate — SV-9407 closed as OBSOLETE") are not defeated. |
| A10 | Rule 62 | ✅ | Not filed. |

## IF NOT ADMISSIBLE
PO decision WQ-2: "One decimal (spec S2-R7) or two (SV-9059, as built)?" If two, the spec sentence S2-R7 needs updating (and the dashboard's Technician Utilization figures, which also show two decimals, stay as they are).
