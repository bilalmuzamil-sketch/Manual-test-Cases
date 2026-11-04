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
- 4 Nov, unattended (QA lead asleep: "Continue unattended"):
  - **QA branch sv11839** (QA lead's message 4 Nov): full Dashboard check done → `rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md`. **No new Dashboard bug beyond epic SV-11839.** SV-11931 and SV-11932 fixes are visible on the branch. Observations O1 (no comma at ≥1,000 %) and O2 (remembered technician filter shows a technician never chosen; PRD S8-R6 silent) are PO-question candidates, not tickets.
  - **Worker re-checks, verified from committed evidence (Rule 86):**
    - 38 (P2-D7): REPRODUCED.
    - 39(a) (P2-A5): REPRODUCED.
    - 39(b) (P2-A6): REPRODUCED, but it is a **probable duplicate of SV-10702** (multi-day punch slices, double time-zone conversion; the Karachi direction). Recommendation: comment on SV-10702, not a new ticket.
    - 40: still running.
- **QA lead, 4 Nov 2026 (answers to my questions 1–6, verbatim):** "1. Yes 2. Yes 3. If it's a big create ticket and attach to the same epic 4. Lets see this after everything else 5. Ok 6. Leave it"
  1. QA-test the 14 TESTING QA tickets of epic SV-11839 on sv11839, each by its own steps; Jira status/comments only with his approval per ticket.
  2. Comment on SV-11826 with the sv11839 evidence. Approved; posted after re-testing it by its own steps.
  3. Chris answers 38 (P2-D7) and 39(a) (P2-A5) are bugs: **create the tickets with parent SV-11839** (the same epic), one at a time (Rule 73).
  4. 39(b) / SV-10702 comment: later, after everything else.
  5. Q40: OK, wait for the worker.
  6. O1 (no comma at ≥1,000 %) and O2 (remembered technician filter): leave them.
- **Filed 4 Nov 2026 (decision 3):**
  - **SV-12199** (Chris 38, Customer Invoice export Terms), parent SV-11839.
  - **SV-12201** (Chris 39(a), Payroll Timesheet export overlap), parent SV-11839.
  - Both are Bug · Medium · Reports & Dashboards, with pictures embedded and read back OK. Record: `tickets-2026-11-04/filed/FILED-2026-11-04.json`.
- **Staging worker finished (Rule 86 verified for 38 / 39a / 39b).** Q40 REPRODUCED: part ZZAUTOTEST-PV8-11041710 sold 4 Nov 10:13 PM Karachi reads "0 days" at 12:07 AM on 5 Nov; it should read 1. Draft `P2-B8-reports-parts-velocity-last-sale-counts-24-hour-periods.md`, NOT FILED. Q40 was not in decision 3, so its go-ahead is still needed.
- **Worker side notes (not verified by me):**
  - Timesheet Activities opened from a link carrying a Custom range shows "No record matches these filters".
  - The S2-38354 invoice (Heavy Duty) shows "REMIT PAYMENT TO Staging Lethbridge - 4310".
- **STANDING INSTRUCTION, QA lead, 4 Nov 2026 (verbatim):** "Note: The new tickets which you will create. Please Tag Chris ward in the comment explain in easiest to understand words what is happening vs what as per my understanding ahould be happening, asking him to confirm if this beuavior should be left as is or this needs to be fixed"
  → Every NEW ticket I create gets one comment that:
  - tags @Chris Ward (account 712020:aa00b8d6-a71f-4259-8919-82a304227c20; HTML mention `<span data-type="mention" data-user-id="…">@Chris Ward</span>`);
  - says in the plainest words what happens today and what we understand should happen, with one example;
  - asks him to confirm "fix it or leave it as is".
  - Applied 4 Nov to SV-12199 (comment 80134) and SV-12201 (comment 80135).
  - A matching rule proposal (Rule 72) is to be put to the QA lead before recording it in the rule book.
- **QA lead, 4 Nov 2026, before sleeping (verbatim):** "1. If its a genuine bug and reporting it will not bite me, then report it and attach it to the correct epic, yes I wouod go with your recommendation. Also if any ticjetvwas created because it was a separate issue foujd while testing the other ticket that new ticket should clearly tell at the top that tjisnissue was foujd whole testing this ticket {{Ticket number and link}}. And 11945 instead of posting the correction in the ticket comment, re draft the ticket description if it is still the Bug with the correct details and everything. 2. Yes 3. Ok 4. Ok. Now continue unattended as I am going to sleep. The tickets if they turn out to be QA passed, please move their starus to QA complete, assign Bilal Muzamil as a QA assignee and add the existing label to the ticket QAcomplete. Those whoch do not pass the QA move them to rejected from testing status and tye ricket comment should clearly state in clear comment for a layman to u derstand with the annotated screenshot why it failed."
  - **Q40:** file it (genuine, documented by Chris's answer 40) under the correct epic, with the Chris confirmation comment (Rule 103).
  - **SV-11945:** no correcting comment. Re-check that it is still a bug; if so, re-draft its DESCRIPTION with the corrected Last Sale wording (calendar days, Chris answer 40).
  - **New standing instruction:** a ticket created for a separate issue found while testing another ticket starts with "This issue was found while testing <ticket key + link>".
  - **Rule 103 approved** ("2. Yes").
  - **The 14 TESTING QA tickets on sv11839:**
    - PASS → transition to **QA Complete**, QA assignee = Bilal Muzamil, add the existing label QAcomplete.
    - FAIL → transition to **Rejected from testing**, with a plain comment and an annotated screenshot of why it failed.
