# Decisions, 4 Nov 2026

- QA lead (4 Nov): "1. Yes" → start the Dashboard calculation check. "2. Check if he has responded" → he has. "3. OK" → SV-11936 approval stays parked until 10 Nov.
- Chris Ward answered Section 3 of "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)" (Google Doc 1mEcB4cpsOqZXeim0vzmlbam2xSB02YshnyYRY0dk9s8; Drive modified 3 Nov 16:09 UTC). Verbatim copy: `../chris-answers-2026-11-04-section3-verbatim.md`.
  - 38 (corrected): invoice's own term (COD for S1-38216), defect → draft P2-D7 (not filed).
  - 39 (corrected) (a): overlap counts once, defect → draft P2-A5 (not filed).
  - 39 (corrected) (b): time counts on the day worked, split at midnight in the location's zone, defect → no draft yet; check SV-10702 (Blocked; multi-day punch on wrong days) for a duplicate first.
  - 40: Last Sale in calendar days in the location's zone, defect; S5-R4 to be updated → no draft yet.
- Every draft needs a re-check on the current build (v26.45.0-440aa25) before filing. DVI Test now runs on Pacific/Fiji.
- Duplicate check 4 Nov (Jira, project SV):
  - 39(b): related, not the same → SV-10702 "Payroll Timesheet export dates each day of a multi-day punch one day early" (Blocked). 39(b) is a punch on one day that is counted on the NEXT day.
  - 40: no open ticket. But our own SV-11945 (Open) says Last Sale reads "0 days within the first 24 hours after the sale", which Chris's answer 40 now contradicts; it needs a correcting comment (ask the QA lead first).
  - 38 and 39(a): no ticket filed; drafts P2-D7 and P2-A5 are held.
